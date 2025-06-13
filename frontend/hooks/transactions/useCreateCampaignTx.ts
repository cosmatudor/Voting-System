import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { getChainID } from "@multiversx/sdk-dapp/utils";
import { smartContract } from "@/lib/utils/smartContract";
import { Address } from "@multiversx/sdk-core";

export const useCreateCampaignTx = () => {
    const { account } = useGetAccountInfo();

    const getCreateCampaignTx = async (
        title: string, 
        description: string, 
        startTimestamp: number, 
        endTimestamp: number, 
        eligibleVoters: string[],
        options: string[],
        isConfidential: boolean,
        is_sponsored: boolean
    ) => {
        const eligibleVotersArray = eligibleVoters.map(voter => new Address(voter));
        const interaction = smartContract.methods
            .createCampaign([title, description, startTimestamp, endTimestamp, eligibleVotersArray, options, isConfidential, is_sponsored])
            .withGasLimit(BigInt(10000000))
            .withChainID(getChainID())
            .withSender(Address.newFromBech32(account.address))
            .buildTransaction()
            .toPlainObject();

        return interaction;
    }

    return { getCreateCampaignTx };
}