# Security Considerations & Testnet Limitations

## Security Considerations

### Smart contracts

- **Reentrancy:** Faucet, Staking, and GameLogic use `transfer`/`safeTransfer` and state updates in a safe order; no external call before state change in critical paths. Staking uses OpenZeppelin `SafeERC20`.
- **Access control:** Faucet has no owner (anyone can call `drip` within rate limit). Staking and GameLogic use `Ownable` for admin (withdraw fees, create proposal). BonsaiToken `mint` is `onlyOwner`.
- **Integer overflow:** Solidity 0.8+ has built-in checks; no unchecked math in user-facing paths.
- **Front-running:** Faucet drip and simple transfers are not sensitive. Staking/stake amount and governance votes could be front-run; acceptable for an educational game on testnet.
- **Token approvals:** Users approve exact amounts where possible (e.g. 2 BONSAI for Level 4). Educate users to revoke or reduce allowance after use if desired.
- **Centralization:** Owner can mint BONSAI, withdraw GameLogic fees, and create proposals. Document this clearly; for production governance, use timelock and multi-sig.

### Frontend / backend

- **Private keys:** Never send or log private keys. Wallet creation (if any) must be server-side, encrypted at rest, and only derived/signing used for txs.
- **RPC / API keys:** Use env vars; don’t commit RPC URLs with keys. Rate-limit backend faucet triggers.
- **Phishing:** Always show contract addresses and tx hashes; link only to official Sepolia Etherscan. Warn users to check the domain.

---

## Testnet limitations

- **Sepolia only:** No mainnet deployment; no real monetary value. Tokens and ETH are for testing only.
- **Faucets:** Users need Sepolia ETH for gas. Use a Sepolia ETH faucet (e.g. Alchemy, Infura, community faucets). BONSAI is from our Faucet contract.
- **Reliability:** Testnet can have delays, reorgs, or downtime. Show “pending” state and retries; don’t assume every tx will confirm in 1 block.
- **No fiat:** No credit card or fiat onboarding; only “connect wallet” and testnet faucets.
- **Data persistence:** On-chain state is the source of truth. Any “progress” or “level” stored off-chain (e.g. backend DB) is for UX only and must not replace blockchain verification (e.g. level completion should be derivable from on-chain txs/events).
- **Rate limits:** Faucet has a 24h cooldown per address. Staking has a fixed lock period. These are by design for the game and to avoid drain on testnet.

---

## What we do NOT do

- No mainnet deployment or real-money flows in this educational scope.
- No fiat payments or custodial conversion.
- No off-chain database used as the source of truth for token balances, stakes, or votes; those come from the contracts and Etherscan.
