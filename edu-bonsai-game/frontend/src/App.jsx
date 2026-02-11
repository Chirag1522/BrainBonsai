import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';

const SEPOLIA_ETHERSCAN = 'https://sepolia.etherscan.io';

export default function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // BONSAI balance: set VITE_BONSAI_TOKEN_ADDRESS after deployment
  const tokenAddress = import.meta.env.VITE_BONSAI_TOKEN_ADDRESS;
  const { data: bonsaiBalance } = useBalance({
    address,
    token: tokenAddress || undefined,
  });

  if (!isConnected) {
    return (
      <div style={styles.container}>
        <h1>Edu BONSAI — Level 1: Wallet & Ownership</h1>
        <p>Connect your wallet (Sepolia) to see your address and BONSAI balance.</p>
        {connectors.map((c) => (
          <button
            key={c.uid}
            onClick={() => connect({ connector: c })}
            disabled={isPending}
            style={styles.button}
          >
            {isPending ? 'Connecting…' : `Connect ${c.name}`}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Edu BONSAI</h1>
      <p><strong>Wallet:</strong> {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '—'}</p>
      <p><strong>BONSAI balance:</strong> {bonsaiBalance ? bonsaiBalance.formatted : '—'} BONSAI</p>
      <p>
        <a href={`${SEPOLIA_ETHERSCAN}/address/${address}`} target="_blank" rel="noopener noreferrer">
          View on Etherscan →
        </a>
      </p>
      <button onClick={() => disconnect()} style={styles.buttonSecondary}>Disconnect</button>
      <hr />
      <p style={styles.small}>Level 2–8: See FRONTEND_FLOW.md. Configure Faucet, Staking, GameLogic addresses and implement each level with real txs + Etherscan links.</p>
    </div>
  );
}

const styles = {
  container: { maxWidth: 560, margin: '40px auto', padding: 24, fontFamily: 'system-ui' },
  button: { padding: '12px 24px', marginRight: 8, cursor: 'pointer' },
  buttonSecondary: { padding: '8px 16px', marginTop: 8, cursor: 'pointer' },
  small: { fontSize: 12, color: '#666' },
};
