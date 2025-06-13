import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { getChainID } from "@multiversx/sdk-dapp/utils";
import { smartContract } from "@/lib/utils/smartContract";
import { Address } from "@multiversx/sdk-core";

export const useSimpleVoteTx = () => {
    const { account } = useGetAccountInfo();

    const getSimpleVoteTx = async (
        campaignId: number,
        optionId: number, 
    ) => { 
        const interaction = smartContract.methods
            .vote([BigInt(campaignId), BigInt(optionId)])
            .withGasLimit(BigInt(10000000))
            .withChainID(getChainID())
            .withSender(Address.newFromBech32(account.address))
            .buildTransaction()
            .toPlainObject();

        return interaction;
    }

    return { getSimpleVoteTx };
}