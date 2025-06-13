import { SmartContract, Address, AbiRegistry } from "@multiversx/sdk-core";
import abi from '@/abis/voting-system.abi.json';

const abiRegistry = AbiRegistry.create(abi);

export const smartContract = new SmartContract({
    address: new Address('erd1qqqqqqqqqqqqqpgqjtl4cwve2vfx3cvvswgdhcmvx4zms4jmd4sq69lcx0'),
    abi: abiRegistry
})