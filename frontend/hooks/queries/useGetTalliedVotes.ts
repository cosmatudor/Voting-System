import { useCallback, useState } from "react";
import { DevnetEntrypoint, AbiRegistry, ProxyNetworkProvider } from "@multiversx/sdk-core/out";
import abi from "@/abis/voting-system.abi.json";
import { Address } from "@multiversx/sdk-core";

export const useGetTalliedVotes = () => {
    const [tallyResults, setTallyResults] = useState<number[]>([]);

    const getTalliedVotes = useCallback(async (campaignId: bigint) => {
        // const networkProvider = new ProxyNetworkProvider(API_URL);
        // const interaction = smartContract.methods.getTalliedVotes([campaignId]);
        // const query = interaction.buildQuery();

        const entrypoint = new DevnetEntrypoint();
        const registry = AbiRegistry.create(abi);
        const controller = entrypoint.createSmartContractController(registry);

        const response = await controller.query({
            contract: Address.newFromBech32("erd1qqqqqqqqqqqqqpgqjtl4cwve2vfx3cvvswgdhcmvx4zms4jmd4sq69lcx0"),
            function: "getTalliedVotes",
            arguments: [campaignId],
        });

        const results = response[0];

        if (results) {
            const voteCounts = results.map((count: bigint) => Number(count));
            setTallyResults(voteCounts);
        }

        return results;
    }, []);

    return {
        tallyResults,
        getTalliedVotes
    };
}