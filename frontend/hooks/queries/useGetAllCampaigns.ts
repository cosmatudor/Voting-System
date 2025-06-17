import { useCallback, useState, useEffect } from "react";
import { DevnetEntrypoint, ProxyNetworkProvider } from "@multiversx/sdk-core/out";
import { smartContract } from "@/lib/utils/smartContract";
import { API_URL } from "@/config";
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { formatTimestamp } from "@/lib/utils";
import { SmartContractQuery, Address } from "@multiversx/sdk-core";
import { AbiRegistry } from "@multiversx/sdk-core";
import abi from "@/abis/voting-system.abi.json";

export interface CampaignView {
    campaign_id: number;
    owner: string;
    title: string;
    description: string;
    start_timestamp: number;
    end_timestamp: number;
    votes_num: number;
    eligible_voters: string[];
    is_tallied: boolean;
    is_confidential: boolean;
    is_sponsored: boolean;
}

export interface FormattedCampaign {
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
    is_tallied: boolean;
    is_confidential: boolean;
    is_sponsored: boolean;
    result?: 'Approved' | 'Rejected';
    eligible_voters: string[];
}

export const useGetAllCampaigns = () => {
    const { account } = useGetAccountInfo();
    const [campaigns, setCampaigns] = useState<FormattedCampaign[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCampaigns = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // const networkProvider = new ProxyNetworkProvider(API_URL);
            // const interaction = smartContract.methods.getAllCampaigns();
            // const query = interaction.buildQuery();
            const entrypoint = new DevnetEntrypoint();
            const registry = AbiRegistry.create(abi);
            const controller = entrypoint.createSmartContractController(registry);


            const response = await controller.query({
                contract: Address.newFromBech32("erd1qqqqqqqqqqqqqpgqjtl4cwve2vfx3cvvswgdhcmvx4zms4jmd4sq69lcx0"),
                function: "getAllCampaigns",
                arguments: [],
            });

            console.log('response:', response.valueOf());

            // Format the campaign data
            const formattedCampaigns: FormattedCampaign[] = response[0].map((campaign: any) => {
                const now = Math.floor(Date.now() / 1000);
                const startTime = Number(campaign.start_timestamp);
                const endTime = Number(campaign.end_timestamp);
                
                let status: 'active' | 'upcoming' | 'closed';
                if (now < startTime) status = 'upcoming';
                else if (now > endTime) status = 'closed';
                else status = 'active';

                return {
                    id: campaign.campaign_id,
                    title: Buffer.from(campaign.title).toString("utf-8"),
                    description: Buffer.from(campaign.description).toString("utf-8"),
                    status,
                    startTime: formatTimestamp(startTime),
                    endTime: formatTimestamp(endTime),
                    participation: calculateParticipation(Number(campaign.votes_num), campaign.eligible_voters.length),
                    creator: {
                        address: new Address(campaign.owner).toBech32()
                    },
                    is_tallied: campaign.is_tallied,
                    is_confidential: campaign.is_confidential,
                    is_sponsored: campaign.is_sponsored,
                    eligible_voters: campaign.eligible_voters.map((x: any) => x.bech32()),
                };
            });

            setCampaigns(formattedCampaigns);
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    return {
        campaigns,
        isLoading,
        error,
        refetchAllCampaigns: () => {
            fetchCampaigns();
        }
    };
};

function calculateParticipation(totalVotes: number, eligibleWallets: number): number {
    if (eligibleWallets === 0) return totalVotes;
    return Math.round((totalVotes / eligibleWallets) * 100);
}