# Confidential Voting dApp Requirements

## Technical Stack

- **Blockchain**: Arbitrum One (Mainnet)
- **Wallet**: MetaMask (via WalletConnect fallback)
- **Frontend Framework**: Next.js (App Router)
- **State Management**: Zustand (for wallet state)
- **UI Library**: Tailwind CSS + ShadCN components
- **Web3 Libraries**:
  - `wagmi` (core wallet/contract interactions)
  - `viem` (transaction handling)

## Core Requirements

### 1. Persistent Wallet Header

- **Location**: `app/layout.jsx` (applies to all routes)
- **Functionality**:
  - Displays connected address (truncated) when authenticated
  - Shows MetaMask connection button when disconnected
  - Network indicator (must show "Arbitrum One")
  - Survives page navigation

### 2. Arbitrum-Specific Config

- **Network Validation**:
  - Auto-switch to Arbitrum if user is on wrong network
  - Reject transactions unless chain ID = 42161
- **RPC Endpoints**:
  - Primary: Arbitrum public RPC
  - Fallback: Alchemy/Infura URL

### 3. Contract Interaction Flow

1. **Voting Creation**:

   - All the parameters and variables from the poll creation will be send to the smart contract

2. **Vote**:

   - Frontend encrypts the vote using existing Rust API in this format: public_key taken from the api which is the id of the poll, number of choises and vote number

3. **Transaction Handling**:

   - Submit encrypted vote to smart contract
   - Monitor transaction status (pending/success/fail)
   - Gas estimation with 25% buffer

4. **Post-Vote**:
   - Display transaction hash with Arbiscan link
   - Cache vote receipt in local storage

### 4. Security Requirements

- **Wallet Guardrails**:
  - Timeout after 15 minutes of inactivity
  - Clear wallet data on refresh if not "remembered"
- **Network Security**:
  - Reject any contract calls not on Arbitrum
  - Warn about testnet/mainnet mismatch

### 5. Quality Attributes

- **Performance**:
  - Max 2s load time for wallet connection
  - Lazy-load voting results
- **UX**:
  - Mobile-first responsive design
  - Clear transaction progress indicators
- **Maintainability**:
  - TypeScript interfaces for all contracts
  - Isolated crypto operations

## Integration Points for Cursor AI

1. Analyze existing Rust API encryption outputs
2. Map contract ABI to wagmi hooks
3. Generate TypeScript types from contracts
4. Implement wallet connection persistence
5. Add error boundaries for failed TXs

## Abi file

- location: /contract-abi.json
- you can relocate this file

## References

- [Arbitrum Official Docs](https://developer.arbitrum.io)
- [Wagmi React Best Practices](https://wagmi.sh/react/guides/connect-wallet)
- [MetaMask API Spec](https://docs.metamask.io/wallet/)
