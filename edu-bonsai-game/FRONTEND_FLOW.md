# Frontend Flow — Level by Level

Use **wagmi** + **viem** + **React** (or vanilla JS with viem). Every action that changes state must be a **real transaction**; show **tx hash** and **Etherscan Sepolia** link after each success.

---

## Level 1 — Wallet & Ownership

**Blockchain concept:** Wallets, public address, ownership (you control what your address holds).

**Flow:**
1. Connect wallet (MetaMask / Injected); ensure network is **Sepolia**.
2. If no wallet: trigger backend “create wallet” or use a custodial/simple sign-in that creates or links an address; then **faucet drip** (backend or user clicks “Get 20 BONSAI”).
3. **Display:**
   - Wallet address (shortened: `0x1234...5678`).
   - BONSAI balance: `readContract(token, 'balanceOf', [userAddress])`.
4. **No transaction** from user this level; only view.
5. **Explain:** “This is your public address. Your BONSAI balance is stored on the blockchain; only you can move it with your wallet.”

---

## Level 2 — First Transaction

**Blockchain concept:** Peer-to-peer transfer, transaction confirmation, gas (who pays and why).

**Flow:**
1. Show “Send 5 BONSAI to the NPC wallet.”
2. **NPC wallet:** A fixed address (e.g. `0x...` from env); display it.
3. User clicks “Send 5 BONSAI” → `writeContract(token, 'transfer', [npcWallet, parseUnits('5', 18)])`.
4. User **confirms** in MetaMask (and pays gas in ETH).
5. On success:
   - Show **tx hash**.
   - Show link: `https://sepolia.etherscan.io/tx/${txHash}`.
   - Highlight what to look for: **From** (user), **To** (token contract for ERC-20; internal tx or Token Transfer shows NPC), **Value / Token** (5 BONSAI), **Gas Used**.
6. **Explain:** “You signed a transaction. Miners included it; the transfer is permanent and verifiable on Etherscan.”

---

## Level 3 — Gas & Fees

**Blockchain concept:** Gas price, gas limit, fee = gas price × gas used; gas paid in ETH, not BONSAI.

**Flow:**
1. Same “Send BONSAI” action, but let user choose **gas speed**: slow / normal / fast (e.g. 1x, 1.2x, 1.5x multiplier on current gas price).
2. When sending: pass `maxFeePerGas` / `maxPriorityFeePerGas` (EIP-1559) or `gasPrice` (legacy) based on speed.
3. **Optional:** Add a “Try with very low gas” button that will likely fail; show failed tx on Etherscan and explain “Insufficient gas → transaction reverted.”
4. **Explain:** “Gas is paid in ETH. Higher gas price = faster inclusion. BONSAI is the asset you send; ETH is the fee.”

---

## Level 4 — Smart Contract Interaction (approve + transferFrom)

**Blockchain concept:** Tokens are not “pullable” by contracts; user must **approve** then contract (or user) calls **transferFrom**.

**Flow:**
1. Show “Unlock feature: pay 2 BONSAI to the game contract.”
2. **Step 1 — Approval:**  
   `writeContract(token, 'approve', [gameLogicAddress, parseUnits('2', 18)])`  
   → User signs. Show tx hash + Etherscan. Explain: “This transaction only gave the contract permission; it did not move tokens yet.”
3. **Step 2 — Unlock:**  
   `writeContract(gameLogic, 'unlockFeature', [])`  
   → Contract does `transferFrom(user, gameLogic, 2 BONSAI)`. Show tx hash + Etherscan. Explain: “This transaction moved your 2 BONSAI to the contract.”
4. **Show both** transactions on Etherscan: approval tx and “Unlock” (transferFrom) tx.

---

## Level 5 — Staking

**Blockchain concept:** Staking = locking tokens in a contract for a period; locked liquidity.

**Flow:**
1. Show “Stake 10 BONSAI for 7 days.”
2. **Step 1:** `approve(stakingAddress, parseUnits('10', 18))` → show tx + Etherscan.
3. **Step 2:** `writeContract(staking, 'stake', [parseUnits('10', 18)])` → show tx + Etherscan (contract address + “Internal Tx” or token transfer).
4. Display: staked amount, `lockedUntil` (from contract read), and “Rewards will be claimable after staking.”
5. **Explain:** “Your tokens are now locked in the contract until the lock period ends.”

---

## Level 6 — Rewards & Claiming

**Blockchain concept:** Claiming = calling a contract function that changes on-chain state and sends tokens (reward).

**Flow:**
1. Read `staking.pendingReward(userAddress)` and show “Claimable: X BONSAI.”
2. User clicks “Claim rewards” → `writeContract(staking, 'claimRewards', [])`.
3. On success: show tx hash + Etherscan; point to the **token transfer** (contract → user) in the tx.
4. **Explain:** “The claim transaction updated the contract state and sent you BONSAI; you can verify the transfer on Etherscan.”

---

## Level 7 — Burning & Scarcity

**Blockchain concept:** Burning = permanently removing tokens; total supply decreases; irreversible.

**Flow:**
1. Show “Burn 1 BONSAI to unlock a cosmetic.”
2. **Step 1:** `approve(gameLogicAddress, parseUnits('1', 18))`.
3. **Step 2:** `writeContract(gameLogic, 'unlockCosmetic', [])` → contract calls `token.burnFrom(user, 1e18)`.
4. On success: show tx hash + Etherscan; point to **Burn** event (or token transfer to 0x0) and **total supply** before/after if visible.
5. **Explain:** “Burning removes tokens forever; total supply decreased and cannot be undone.”

---

## Level 8 — Governance (Optional)

**Blockchain concept:** Governance tokens, voting power, on-chain voting.

**Flow:**
1. Show current “proposal” (e.g. proposal id from `gameLogic.currentProposalId()`).
2. User clicks “Vote” → `writeContract(gameLogic, 'vote', [proposalId])`.
3. Contract emits `Voted(user, proposalId, balanceAtVote)` (voting power = BONSAI balance).
4. Show tx hash + Etherscan; explain “Your vote is recorded on-chain; your voting power was your BONSAI balance at the time of the tx.”

---

## UX Checklist (Every Level)

- After **every** successful tx:
  - Show **transaction hash**.
  - Show **clickable** link: `https://sepolia.etherscan.io/tx/<hash>`.
  - When relevant: **contract address** link: `https://sepolia.etherscan.io/address/<address>`.
- Short **“What just happened”** and “What to look for on Etherscan” for each level.
- **Never** fake or simulate blockchain data; only show hashes/links for real Sepolia transactions.
