import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

if (projectId === 'YOUR_PROJECT_ID') {
  console.warn('⚠️ WalletConnect Project ID not configured. Please:');
  console.warn('1. Go to https://cloud.walletconnect.com/');
  console.warn('2. Create a new project');
  console.warn('3. Copy the Project ID');
  console.warn('4. Create a .env file with: VITE_WALLET_CONNECT_PROJECT_ID=your_project_id');
}

export const config = getDefaultConfig({
  chains: [sepolia],
  projectId: projectId,
  appName: 'Seedora PL Genesis',
  appDescription: 'A decentralized content platform with escrow functionality',
  appUrl: 'https://seedora-pl-genesis.vercel.app',
  appIcon: 'https://seedora-pl-genesis.vercel.app/logo.png',
}); 