import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { getChainID } from "@multiversx/sdk-dapp/utils";
import { smartContract } from "@/lib/utils/smartContract";
import { Address } from "@multiversx/sdk-core";

export const useCloseCampaignTx = () => {
    const { account } = useGetAccountInfo();

    const getCloseCampaignTx = async (
      campaignId: number
    ) => {
        const interaction = smartContract.methods
            .closeCampaign([BigInt(campaignId)])
            .withGasLimit(BigInt(10000000))
            .withChainID(getChainID())
            .withSender(Address.newFromBech32(account.address))
            .buildTransaction()
            .toPlainObject();

        return interaction;
    }

    return { getCloseCampaignTx };
}