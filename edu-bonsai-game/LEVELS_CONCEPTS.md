# Levels → Blockchain Concepts (Quick Reference)

| Level | Name | Blockchain concept taught | Where it’s shown |
|-------|------|----------------------------|------------------|
| **1** | Wallet & Ownership | Wallets, public address, private key ownership, balance on-chain | View address + BONSAI balance; Etherscan “address” tab |
| **2** | First Transaction | Peer-to-peer transfer, transaction confirmation, gas fees | Send 5 BONSAI to NPC; Etherscan: From, To, Value, Gas Used |
| **3** | Gas & Fees | Gas price, gas limit, why gas is paid in ETH not BONSAI | Choose slow/normal/fast; optional failed tx with too-low gas |
| **4** | Smart Contract Interaction | Token approvals; why contracts can’t take tokens without permission | approve tx + unlockFeature (transferFrom) tx; both on Etherscan |
| **5** | Staking | Staking, locked liquidity, rewards vs opportunity cost | stake() tx; contract holds tokens; lock period |
| **6** | Rewards & Claiming | Claim functions, on-chain state changes | claimRewards() tx; token transfer to user on Etherscan |
| **7** | Burning & Scarcity | Total supply, token burning, irreversible on-chain actions | burnFrom / unlockCosmetic; Burn event on Etherscan |
| **8** | Governance | Governance tokens, voting power, decentralization | vote(proposalId) tx; Voted event with balance as weight |

Every level: show **tx hash** and **clickable Sepolia Etherscan** link; no fake interactions.
