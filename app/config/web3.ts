import { mainnet, sepolia } from 'wagmi/chains';

// WalletConnectのプロジェクトID
// https://cloud.walletconnect.com/
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

// アプリケーションのメタデータ
export const metadata = {
  name: 'BOL HQ',
  description: 'BOL HQ Application',
  url: 'https://bol-hq.vercel.app',
  icons: ['https://bol-hq.vercel.app/favicon.ico']
};

// サポートするチェーン
export const chains = [mainnet, sepolia]; 