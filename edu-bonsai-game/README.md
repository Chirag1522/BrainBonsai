# Edu BONSAI — Educational Blockchain Game

Hands-on blockchain learning with **real on-chain interactions** on **Ethereum Sepolia** using the **BONSAI** ERC-20 token.

## Principles

- **Learning by doing:** Every important action is a real blockchain transaction.
- **Verifiable:** Users check every step on [Sepolia Etherscan](https://sepolia.etherscan.io).
- **Progression:** Levels/quests from wallet basics to staking, burning, and governance.

## Token: BONSAI (ERC-20)

- In-game currency, reputation, staking asset, governance weight.
- Deployed on Sepolia; used in all levels.

## Levels (summary)

| Level | Name                     | Concept                          | Main action                          |
|-------|--------------------------|-----------------------------------|--------------------------------------|
| 1     | Wallet & Ownership       | Wallets, addresses, balance      | View address + BONSAI balance        |
| 2     | First Transaction        | P2P transfer, confirmation, gas  | Send 5 BONSAI to NPC                 |
| 3     | Gas & Fees               | Gas price, limit, ETH vs BONSAI | Send with chosen gas speed          |
| 4     | Smart Contract Interaction | approve + transferFrom         | Pay 2 BONSAI to unlock feature       |
| 5     | Staking                  | Locking tokens, liquidity       | Stake 10 BONSAI                      |
| 6     | Rewards & Claiming       | Claim tx, on-chain state        | Claim staking rewards                |
| 7     | Burning & Scarcity       | Burn, total supply               | Burn 1 BONSAI for cosmetic           |
| 8     | Governance (optional)    | Voting power, governance tokens | Vote with BONSAI                     |

## Repo structure

```
edu-bonsai-game/
├── ARCHITECTURE.md       # Smart contract architecture (text)
├── FRONTEND_FLOW.md      # Frontend flow per level
├── SECURITY_AND_TESTNET.md
├── README.md             # This file
├── contracts/
│   ├── BonsaiToken.sol   # ERC-20 BONSAI
│   ├── Faucet.sol        # 20 BONSAI per user (rate-limited)
│   ├── Staking.sol       # Lock BONSAI, claim rewards
│   ├── GameLogic.sol     # Unlock feature (approve/transferFrom), burn, vote
│   ├── hardhat.config.js
│   └── package.json
└── frontend/             # Optional: wagmi + viem app
    ├── package.json
    └── ...
```

## Contracts (outline)

- **BonsaiToken:** ERC-20 + burn; initial supply to deployer; optional `mint` for rewards.
- **Faucet:** Holds BONSAI; `drip(to)` sends 20 BONSAI per address per 24h.
- **Staking:** `stake(amount)` (7-day lock), `withdraw()`, `claimRewards()`; rewards in BONSAI.
- **GameLogic:** `unlockFeature()` (2 BONSAI via transferFrom), `unlockCosmetic()` (burn 1 BONSAI), `vote(proposalId)`.

Deploy order: BonsaiToken → Faucet → Staking → GameLogic. Fund Faucet and (if needed) Staking with BONSAI.

## Frontend

- Use **wagmi** + **viem** (or ethers); Sepolia only.
- After every tx: show **tx hash** and **Etherscan Sepolia** link.
- See **FRONTEND_FLOW.md** for level-by-level flows and UX.

## Running

1. **Contracts (from project root):**  
   `npm install && npm run compile`  
   Or from contracts folder: `cd contracts && npm install && npx hardhat compile`.  
   Deploy with Hardhat or a script; set `PRIVATE_KEY` and optionally `SEPOLIA_RPC`.

2. **Frontend:**  
   `cd frontend && npm install && npm run dev`  
   Set env: `VITE_BONSAI_TOKEN_ADDRESS`, `VITE_FAUCET_ADDRESS`, etc. (see FRONTEND_FLOW.md).

3. **Backend (optional):**  
   Use only for orchestration (e.g. trigger faucet after sign-in); never replace on-chain logic.

## What we don’t include

- Mainnet deployment or real money.
- Fiat payments.
- Centralized DB as source of truth for balances/stakes/votes.

Focus: **clarity, learning, and real blockchain verification** on Sepolia.
