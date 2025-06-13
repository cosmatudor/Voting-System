import { useCallback, useState, useEffect } from "react";
import { Address, DevnetEntrypoint, ProxyNetworkProvider } from "@multiversx/sdk-core/out";
import { smartContract } from "@/lib/utils/smartContract";
import { API_URL } from "@/config";
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { formatTimestamp } from "@/lib/utils";
import { AbiRegistry } from "@multiversx/sdk-core";
import abi from "@/abis/voting-system.abi.json";

interface FormattedCampaignDetails {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'upcoming' | 'closed';
    startTime: string;
    endTime: string;
    participation: number;
    creator: {
        address: string;
    };
    options: {
        id: string;
        label: string;
    }[];
    totalVotes: number;
    results?: number[];
    is_tallied: boolean;
    is_confidential: boolean;
    is_sponsored: boolean;
    eligible_voters: string[];
}

export interface CampaignDetails {
    campaign_id: number;
    owner: string;
    title: string;
    description: string;
    options: string[];
    start_timestamp: number;
    end_timestamp: number;
    votes: number[];
    eligible_voters: string[];
    is_tallied: boolean;
    is_confidential: boolean;
    is_sponsored: boolean;
}

export const useGetCampaignDetails = (campaignId: number) => {
    const [campaign, setCampaign] = useState<FormattedCampaignDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCampaignDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            // const networkProvider = new ProxyNetworkProvider(API_URL);
            
            // Get campaign details
            // const interaction = smartContract.methods.getCampaignById([campaignId]);
            // const query = interaction.buildQuery();
            // const response = await networkProvider.queryContract(query);
            const entrypoint = new DevnetEntrypoint();
            const registry = AbiRegistry.create(abi);
            const controller = entrypoint.createSmartContractController(registry);

            const response = await controller.query({
                contract: Address.newFromBech32("erd1qqqqqqqqqqqqqpgqjtl4cwve2vfx3cvvswgdhcmvx4zms4jmd4sq69lcx0"),
                function: "getCampaignById",
                arguments: [campaignId],
            });
            // const { firstValue: campaignData } = new ResultsParser().parseQueryResponse(
            //     response,
            //     interaction.getEndpoint()
            // );

            const campaignData = response[0];

            const campaignDetails = campaignData as CampaignDetails;
            const now = Math.floor(Date.now() / 1000);
            const startTime = Number(campaignDetails.start_timestamp);
            const endTime = Number(campaignDetails.end_timestamp);
            
            let status: 'active' | 'upcoming' | 'closed';
            if (now < startTime) status = 'upcoming';
            else if (now > endTime) status = 'closed';
            else status = 'active';

            // Get vote results
            let results: number[] = [];
            let totalVotes = 0;
            if (campaignDetails.is_confidential || campaignDetails.is_tallied) {
                // Confidential or tallied: use getTalliedVotes
                const response2 = await controller.query({
                    contract: Address.newFromBech32("erd1qqqqqqqqqqqqqpgqjtl4cwve2vfx3cvvswgdhcmvx4zms4jmd4sq69lcx0"),
                    function: "getTalliedVotes",
                    arguments: [campaignId],
                });
                const tallyData = response2[0];
                results = tallyData ? tallyData.map((count: bigint) => Number(count)) : [];
                totalVotes = results.reduce((sum: number, count: number) => sum + count, 0);
            } else {
                // Public and not tallied: count votes from campaign.votes
                const optionsNum = campaignDetails.options.length;
                results = Array(optionsNum).fill(0);
                for (const vote of campaignDetails.votes) {
                    if (typeof vote === 'number' && vote >= 0 && vote < optionsNum) {
                        results[vote]++;
                    }
                }
                totalVotes = results.reduce((sum, count) => sum + count, 0);
            }

            // Create options array from the options list
            const options = campaignDetails.options.map((option, index) => ({
                id: (index + 1).toString(),
                label: Buffer.from(option.valueOf(), 'hex').toString()
            }));

            const calculateParticipation = (votes: number, eligibleVoters: number): number => {
                if (!eligibleVoters || eligibleVoters === 0) return 0;
                return Math.round((votes / eligibleVoters) * 100);
            };

            const formattedCampaign: FormattedCampaignDetails = {
                id: campaignId.toString(),
                title: Buffer.from(campaignDetails.title).toString(),
                description: Buffer.from(campaignDetails.description).toString(),
                status,
                startTime: formatTimestamp(startTime),
                endTime: formatTimestamp(endTime),
                participation: calculateParticipation(totalVotes, campaignDetails.eligible_voters.length),
                creator: {
                    address: new Address(campaignDetails.owner).toBech32()
                },
                options,
                totalVotes,
                    results,
                    is_tallied: campaignDetails.is_tallied,
                    is_confidential: campaignDetails.is_confidential,
                    is_sponsored: campaignDetails.is_sponsored,
                    eligible_voters: campaignDetails.eligible_voters.map(voter => voter.valueOf().toString())
            };

            setCampaign(formattedCampaign);
        } catch (error) {
            console.error("Error fetching campaign details:", error);
            setError(error instanceof Error ? error.message : 'Failed to fetch campaign details');
        } finally {
            setIsLoading(false);
        }
    }, [campaignId]); // Only depend on campaignId

    // Initial fetch when component mounts
    useEffect(() => {
        if (campaignId !== undefined) {
            fetchCampaignDetails();
        }
    }, [campaignId, fetchCampaignDetails]);

    return {
        campaign,
        isLoading,
        error,
        refetch: fetchCampaignDetails
    };
};