import { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import { Wallet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Configure FCL
fcl.config({
  "app.detail.title": "Seedora",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "flow.network": "testnet",
  "discovery.wallet.method": "IFRAME/RPC",
  "fcl.walletConnect.projectId": "2a0cd0a4c8e2c7b9c3d4e5f6a7b8c9d0", // Example projectId - you'll need to get your own from WalletConnect
  "fcl.walletConnect.metadata": {
    name: "Seedora",
    description: "IP Registration and Management Platform",
    url: window.location.origin,
    icons: ["https://placekitten.com/g/200/200"]
  }
});

interface WalletConnectProps {
  onWalletConnection: (connected: boolean, address?: string) => void;
}

export function WalletConnect({ onWalletConnection }: WalletConnectProps) {
  const [user, setUser] = useState<{ addr: string | null }>({ addr: null });
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to user login state
    fcl.currentUser().subscribe(setUser);
  }, []);

  useEffect(() => {
    // Update parent component when user state changes
    if (user.addr) {
      onWalletConnection(true, user.addr);
    } else {
      onWalletConnection(false);
    }
  }, [user.addr, onWalletConnection]);

  const connectWallet = async () => {
    try {
      setConnecting(true);
      setError(null);
      await fcl.authenticate();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect Flow wallet. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await fcl.unauthenticate();
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
    }
  };

  if (error) {
    return (
      <div className="flex items-center space-x-2 p-4 bg-error/10 border border-error/20 rounded-xl">
        <AlertCircle size={20} className="text-error flex-shrink-0" />
        <p className="text-error text-sm">{error}</p>
      </div>
    );
  }

  if (user.addr) {
    return (
      <div className="bg-white rounded-xl border border-light-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Wallet Connected</h3>
              <p className="text-text-secondary text-sm">
                {user.addr.slice(0, 6)}...{user.addr.slice(-6)}
              </p>
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 text-sm font-medium text-error hover:text-error bg-error/10 hover:bg-error/20 rounded-lg transition-all duration-300"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-light-border p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Wallet size={32} className="text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">Connect Your Wallet</h3>
        <p className="text-text-secondary mb-6">
          Connect your Flow wallet to register your intellectual property on the blockchain.
        </p>
        <button
          onClick={connectWallet}
          disabled={connecting}
          className="w-full py-3 bg-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
        >
          {connecting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet size={20} />
              <span>Connect Flow Wallet</span>
            </>
          )}
        </button>
        <p className="text-text-muted text-xs mt-3">
          Make sure you have a Flow wallet set up (like Blocto or Lilico)
        </p>
      </div>
    </div>
  );
}