import { SmartContract, Address, AbiRegistry } from "@multiversx/sdk-core";
import abi from '@/abis/blockchain.abi.json';

const abiRegistry = AbiRegistry.create(abi);

export const smartContract = new SmartContract({
    address: new Address('erd1qqqqqqqqqqqqqpgqeu4l9869cnjk7dya8x0tv4spuxcraulzd4sqjdx63j'),
    abi: abiRegistry
})