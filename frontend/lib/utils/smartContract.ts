import { SmartContract, Address, AbiRegistry } from "@multiversx/sdk-core";
import abi from '@/abis/blockchain.abi.json';

const abiRegistry = AbiRegistry.create(abi);

export const smartContract = new SmartContract({
    address: new Address('erd1qqqqqqqqqqqqqpgqz6slcp2ugvuqcegz9ram7a9jzervz908d4sq9z7h32'),
    abi: abiRegistry
})