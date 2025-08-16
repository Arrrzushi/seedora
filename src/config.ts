// Ethereum Configuration
export const AUCTION_HOUSE_ADDRESS = process.env.VITE_AUCTION_HOUSE_ADDRESS || '0xd0963316d56da678';
export const ETH_RPC_URL = process.env.VITE_ETH_RPC_URL || 'https://mainnet.infura.io/v3/your-project-id';
export const BRIDGE_PRIVATE_KEY = process.env.VITE_BRIDGE_PRIVATE_KEY || '';

// Flow Configuration
export const FLOW_ACCESS_NODE = process.env.VITE_FLOW_ACCESS_NODE || 'https://rest-testnet.onflow.org';
export const FLOW_CONTRACT_ADDRESS = process.env.VITE_FLOW_CONTRACT_ADDRESS || '0xd0963316d56da678';

// Bridge Configuration
export const FLOW_TO_ETH_RATE = process.env.VITE_FLOW_TO_ETH_RATE || '0.01';

// Validate required environment variables
if (!AUCTION_HOUSE_ADDRESS) {
  console.warn('Warning: VITE_AUCTION_HOUSE_ADDRESS not set');
}

// Optional: Bridge private key for advanced features
if (!BRIDGE_PRIVATE_KEY) {
  console.log('Info: VITE_BRIDGE_PRIVATE_KEY not set - bridge features will be limited');
} 