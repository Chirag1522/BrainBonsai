/* ========================================
   MetaMask Integration for Real Ethereum (Sepolia)
   Educational Web3 functionality
======================================== */

class MetaMaskManager {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.account = null;
        this.isConnected = false;
        this.network = null;
        this.SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
        this.etherscanURL = 'https://sepolia.etherscan.io/tx/';
        
        // Initialize ethers.js (using CDN — will be added to HTML)
        this.initializeEthers();
    }

    // Initialize ethers library
    initializeEthers() {
        // ethers.js is loaded from CDN in HTML
        // Check if window.ethers is available
        if (typeof ethers === 'undefined') {
            console.error('ethers.js not loaded. Add CDN script to HTML.');
            return false;
        }
        return true;
    }

    // Check if MetaMask is installed
    isMetaMaskInstalled() {
        return typeof window.ethereum !== 'undefined';
    }

    // Connect to MetaMask
    async connectMetaMask() {
        // Check if MetaMask installed
        if (!this.isMetaMaskInstalled()) {
            throw new Error('MetaMask not installed. Please install MetaMask to continue.');
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            this.account = accounts[0];

            // Create provider and signer using ethers.js
            this.provider = new ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();

            // Check network
            const network = await this.provider.getNetwork();
            this.network = network;

            // Check if on Sepolia
            if (network.chainId !== 11155111) {
                throw new Error('Please switch to Sepolia Testnet in MetaMask');
            }

            this.isConnected = true;
            return {
                account: this.account,
                network: network.name,
                chainId: network.chainId
            };
        } catch (error) {
            throw error;
        }
    }

    // Disconnect MetaMask
    async disconnectMetaMask() {
        this.provider = null;
        this.signer = null;
        this.account = null;
        this.isConnected = false;
        this.network = null;
        return true;
    }

    // Get current account
    getCurrentAccount() {
        return this.account;
    }

    // Get wallet balance
    async getBalance() {
        if (!this.isConnected || !this.provider) {
            throw new Error('MetaMask not connected');
        }

        try {
            const balanceWei = await this.provider.getBalance(this.account);
            const balanceEth = ethers.formatEther(balanceWei);
            return balanceEth;
        } catch (error) {
            throw error;
        }
    }

    // Get current gas price
    async getGasPrice() {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        try {
            const gasPrice = await this.provider.getGasPrice();
            const gasPriceGwei = ethers.formatUnits(gasPrice, 'gwei');
            return {
                wei: gasPrice.toString(),
                gwei: gasPriceGwei
            };
        } catch (error) {
            throw error;
        }
    }

    // Estimate gas for transaction
    async estimateGas(to, amount) {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        try {
            // Standard ETH transfer gas is ~21,000
            // But let's get a real estimate
            const tx = {
                from: this.account,
                to: to,
                value: ethers.parseEther(amount)
            };

            const gasEstimate = await this.provider.estimateGas(tx);
            return gasEstimate.toString();
        } catch (error) {
            // Default to 21000 if estimation fails
            return '21000';
        }
    }

    // Send transaction
    async sendTransaction(toAddress, amountEth) {
        if (!this.isConnected || !this.signer) {
            throw new Error('MetaMask not connected');
        }

        if (!ethers.isAddress(toAddress)) {
            throw new Error('Invalid Ethereum address');
        }

        try {
            // Create transaction object
            const tx = {
                to: toAddress,
                value: ethers.parseEther(amountEth)
                // Let MetaMask handle gas price
            };

            // Send transaction
            const txResponse = await this.signer.sendTransaction(tx);

            // Return transaction details
            return {
                hash: txResponse.hash,
                from: txResponse.from,
                to: txResponse.to,
                value: ethers.formatEther(txResponse.value),
                gasLimit: txResponse.gasLimit.toString(),
                gasPrice: ethers.formatUnits(txResponse.gasPrice, 'gwei'),
                nonce: txResponse.nonce,
                blockNumber: txResponse.blockNumber,
                receipt: txResponse // Keep original response for waiting
            };
        } catch (error) {
            throw error;
        }
    }

    // Wait for transaction confirmation
    async waitForTransaction(txHash, confirmations = 1) {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        try {
            const receipt = await this.provider.waitForTransaction(txHash, confirmations);
            return {
                hash: receipt.hash,
                blockNumber: receipt.blockNumber,
                gasUsed: ethers.formatUnits(receipt.gasUsed, 'gwei'),
                status: receipt.status === 1 ? 'Success' : 'Failed',
                confirmations: confirmations,
                transactionFee: ethers.formatEther(receipt.gasUsed * receipt.gasPrice)
            };
        } catch (error) {
            throw error;
        }
    }

    // Get transaction receipt
    async getTransactionReceipt(txHash) {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        try {
            const receipt = await this.provider.getTransactionReceipt(txHash);
            
            if (!receipt) {
                return {
                    status: 'Pending',
                    hash: txHash,
                    confirmations: 0
                };
            }

            const tx = await this.provider.getTransaction(txHash);
            
            return {
                hash: receipt.hash,
                blockNumber: receipt.blockNumber,
                from: receipt.from,
                to: receipt.to,
                gasUsed: ethers.formatUnits(receipt.gasUsed, 'gwei'),
                gasPrice: ethers.formatUnits(tx.gasPrice, 'gwei'),
                status: receipt.status === 1 ? 'Confirmed' : 'Failed',
                confirmations: receipt.confirmations || 0,
                transactionFee: ethers.formatEther(receipt.gasUsed * tx.gasPrice),
                timestamp: receipt.timestamp
            };
        } catch (error) {
            throw error;
        }
    }

    // Get Etherscan URL for transaction
    getEtherscanURL(txHash) {
        return this.etherscanURL + txHash;
    }

    // Listen for account changes
    onAccountChanged(callback) {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                this.account = accounts[0] || null;
                this.isConnected = accounts.length > 0;
                callback(accounts[0]);
            });
        }
    }

    // Listen for network changes
    onNetworkChanged(callback) {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', (chainId) => {
                // chainId is in hex format
                if (chainId !== this.SEPOLIA_CHAIN_ID) {
                    this.isConnected = false;
                    callback(false, 'Please switch to Sepolia Testnet');
                } else {
                    callback(true, 'Switched to Sepolia');
                }
            });
        }
    }

    // Switch to Sepolia network
    async switchToSepolia() {
        if (!this.isMetaMaskInstalled()) {
            throw new Error('MetaMask not installed');
        }

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.SEPOLIA_CHAIN_ID }],
            });
            return true;
        } catch (error) {
            if (error.code === 4902) {
                // Network not added, try to add it
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: this.SEPOLIA_CHAIN_ID,
                            chainName: 'Sepolia',
                            nativeCurrency: {
                                name: 'Sepolia ETH',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                            rpcUrls: ['https://sepolia.infura.io/v3/'],
                            blockExplorerUrls: ['https://sepolia.etherscan.io']
                        }],
                    });
                    return true;
                } catch (addError) {
                    throw addError;
                }
            }
            throw error;
        }
    }

    // Validate Ethereum address
    static isValidAddress(address) {
        try {
            return ethers.isAddress(address);
        } catch {
            return false;
        }
    }

    // Format address (short version)
    static formatAddress(address) {
        if (!ethers.isAddress(address)) {
            return 'Invalid';
        }
        return address.substring(0, 6) + '...' + address.substring(-4);
    }

    // Convert Wei to ETH
    static weiToEth(wei) {
        try {
            return ethers.formatEther(wei);
        } catch {
            return '0';
        }
    }

    // Convert ETH to Wei
    static ethToWei(eth) {
        try {
            return ethers.parseEther(eth.toString());
        } catch {
            return '0';
        }
    }

    // Format large numbers
    static formatNumber(num, decimals = 4) {
        return parseFloat(num).toFixed(decimals);
    }
}

// Create global instance
const metamaskManager = new MetaMaskManager();

// Add debug logging in development
if (typeof console !== 'undefined') {
    console.log('MetaMask Manager initialized. Ready to connect wallets.');
}
