import { useCallback } from 'react';
import { buildMerkleTree } from '@/lib/utils/merkleTree';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks';

export const useMerkleProof = (eligibleWallets: string[]) => {
  const { address } = useGetAccount();

  const getProof = useCallback(() => {
    if (!address || !eligibleWallets.length) return null;
    const { proofs } = buildMerkleTree(eligibleWallets);
    return proofs.get(address);
  }, [address, eligibleWallets]);

  return { getProof };
}; 