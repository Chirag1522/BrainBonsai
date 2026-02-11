# 🚀 BlockLearn Real Ethereum Guide

## Getting Started with Sepolia Testnet

BlockLearn has two learning modes:
- **📚 Educational Mode**: Learn blockchain concepts with safe, simulation-based BON tokens
- **🌐 Real Mode**: Practice with actual Ethereum on the Sepolia testnet

---

## 🔧 Setup Instructions

### Step 1: Install MetaMask
1. Visit **[metamask.io](https://metamask.io)**
2. Click "Download" and select your browser
3. Install the extension
4. Create a new wallet or import an existing one
5. **Save your recovery phrase in a safe place!**

### Step 2: Switch to Sepolia Testnet
In MetaMask:
1. Click the network dropdown (top of MetaMask)
2. Enable "Show test networks"
3. Select "Sepolia"

**Your MetaMask is now on Sepolia!**

### Step 3: Get Free Sepolia ETH
You need test ETH to practice transactions. Visit a **Sepolia Faucet**:

**Option A: Quicknode Faucet (Fastest)**
- Go to: [faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia)
- Paste your MetaMask address (click copy button in BlockLearn)
- Get 0.5 ETH instantly

**Option B: Alchemy Faucet**
- Go to: [sepoliafaucet.com](https://sepoliafaucet.com)
- Login with GitHub/Google
- Request 0.5 ETH daily

**Option C: Infura Faucet**
- Go to: [infura.io/faucet/sepolia](https://infura.io/faucet/sepolia)
- Paste address
- Receive ETH in minutes

### Step 4: Verify Your Balance
1. Return to BlockLearn
2. Go to "Real Ethereum" section
3. Click "🔌 Connect MetaMask Wallet"
4. Approve the connection
5. See your balance appear!

---

## 💡 Understanding Sepolia

| Aspect | Sepolia | Mainnet |
|--------|---------|---------|
| **Real Money?** | No (test ETH only) | Yes (real ETH) |
| **Block Time** | ~12 seconds | ~12 seconds |
| **Gas Costs** | Free (test ETH) | Real ETH |
| **Data Persistence** | ~1 year | Permanent |
| **Use Case** | Learning & Testing | Production |

**Key Point**: Everything you learn on Sepolia directly applies to Ethereum Mainnet!

---

## 🎯 Learning Path

### Phase 1: BlockLearn Educational (Recommended First)
1. Create a wallet
2. Learn about gas, units, transactions
3. Make simulated transactions
4. View the immutable ledger
5. Understand blockchain fundamentals

### Phase 2: Sepolia Real Transactions
1. Install MetaMask
2. Switch to Sepolia
3. Get test ETH from faucet
4. Connect MetaMask in BlockLearn
5. Send real transactions
6. View on Etherscan

### Phase 3: Etherscan Exploration
1. After each transaction, click "View on Etherscan"
2. Explore the block explorer
3. See:
   - Transaction details
   - Gas usage
   - Block composition
   - Account history

---

## 📊 Example Transaction Walkthrough

### What Happens When You Send 0.001 ETH

**Sepolia Real Mode:**
```
You: 0x1234...5678 (Balance: 0.5 ETH)
Send: 0.001 ETH to 0xabcd...ef01
Gas Price: ~30 Gwei
Gas Limit: 21,000
Fee: 0.00063 ETH (21,000 × 30 Gwei)
---
Total Cost: 0.00163 ETH
Recipient Receives: 0.001 ETH
Your New Balance: 0.49837 ETH
```

**Then on Etherscan:**
- ✅ Transaction appears within 2-30 seconds
- ✅ Block number assigned after 1 confirmation
- ✅ Gas actually used shown (≤21,000)
- ✅ Permanent record (viewable forever)

---

## 🔍 How to View Your Transaction on Etherscan

After sending a real transaction:
1. BlockLearn shows your transaction hash
2. Click "🔗 View on Etherscan"
3. You'll see:
   - Your address (From)
   - Recipient address (To)
   - Amount sent
   - Gas used
   - Block number
   - Timestamp
   - Status (Success/Pending)

**This is real Ethereum data!**

---

## ❌ Troubleshooting

### "MetaMask not installed"
→ Install from [metamask.io](https://metamask.io)

### "Please switch to Sepolia Testnet"
→ Click MetaMask → Select "Sepolia" from network dropdown

### "Invalid address"
→ Make sure recipient address starts with "0x" and is 42 characters

### "Insufficient funds"
→ Get free ETH from a [Sepolia faucet](#sepolia-faucets)

### Transaction stuck?
→ Check on [sepolia.etherscan.io](https://sepolia.etherscan.io)
→ Transactions rarely get stuck on Sepolia

### Balance not updating?
→ Refresh the page
→ Check MetaMask shows Sepolia network
→ Faucets can take 30-60 seconds to deliver

---

## 🛡️ Security Best Practices

### DO ✅
- ✅ Keep your recovery phrase safe (offline, written down)
- ✅ Use Sepolia for learning/testing
- ✅ Approve only transactions you understand
- ✅ Check recipient address carefully
- ✅ Use official Sepolia faucets

### DON'T ❌
- ❌ Share your recovery phrase (even MetaMask won't ask)
- ❌ Import private keys carelessly
- ❌ Send real ETH on mainnet until you're confident
- ❌ Approve random token contracts
- ❌ Use same password as other accounts

---

## 📚 Key Concepts to Understand

### Gas
- Amount of computation required
- Measured in units (usually 21,000 for simple transfers)
- Paid in Gwei (1 ETH = 1,000,000,000 Gwei)

### Gwei
- Unit for gas prices
- 1 Gwei = 0.000000001 ETH
- Gas price is how much you pay per unit of gas

### Transaction Fee
- Formula: `Gas Used × Gas Price`
- You always pay, even if transaction fails
- Actual gas used ≤ gas limit

### Block
- Container for multiple transactions
- Confirmed every ~12 seconds on Ethereum
- Immutable once included

---

## 📖 Further Learning

After Sepolia practice, learn:
1. **Smart Contracts**: Code that runs on blockchain
2. **Solidity**: The programming language for Ethereum
3. **DeFi**: Decentralized Finance applications
4. **Web3.js/ethers.js**: Libraries for blockchain development

---

## 🌐 Useful Links

**Educational:**
- [ethereum.org/en/developers](https://ethereum.org/en/developers)
- [Solidity Docs](https://docs.soliditylang.org)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

**Tools:**
- [Sepolia Etherscan](https://sepolia.etherscan.io) - Block Explorer
- [MetaMask](https://metamask.io) - Wallet
- [Sepolia Faucets](#sepolia-faucets) - Get test ETH

**Testnet Faucets:**
- [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)
- [Alchemy Faucet](https://sepoliafaucet.com)
- [Infura Faucet](https://infura.io/faucet/sepolia)

---

## 💬 Questions?

Remember:
- Test on **Sepolia** first before mainnet
- Every transaction is a learning opportunity
- Failed transactions still cost gas
- All actions are permanent on blockchain
- This knowledge applies to all EVM chains

**Happy learning! 🌱**
