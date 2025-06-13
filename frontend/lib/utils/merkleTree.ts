import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export interface MerkleProof {
  proof: string[];
  index: number;
}

export function buildMerkleTree(addresses: string[]): {
  tree: MerkleTree;
  root: string;
  proofs: Map<string, MerkleProof>;
} {
  // Sort addresses to ensure consistent tree structure
  const sortedAddresses = [...addresses].sort();
  
  // Create leaves by hashing addresses
  const leaves = sortedAddresses.map(addr => keccak256(addr));
  
  // Create the Merkle tree
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  
  // Get the root
  const root = tree.getHexRoot();
  
  // Generate proofs for each address
  const proofs = new Map<string, MerkleProof>();
  sortedAddresses.forEach((address, index) => {
    const proof = tree.getHexProof(leaves[index]);
    proofs.set(address, {
      proof,
      index
    });
  });

  return {
    tree,
    root,
    proofs
  };
}

// Helper function to get proof for a specific address
export function getProofForAddress(
  address: string,
  addresses: string[]
): MerkleProof | null {
  const { proofs } = buildMerkleTree(addresses);
  return proofs.get(address) || null;
}
