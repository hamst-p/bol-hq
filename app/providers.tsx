'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { mainnet, arbitrum } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// QueryClientの設定
const queryClient = new QueryClient();

// プロジェクトIDの設定（https://cloud.reown.comから取得）
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

// メタデータの設定
const metadata = {
  name: 'BOL HQ',
  description: 'BOL HQ Application',
  url: 'https://bol-hq.vercel.app',
  icons: ['https://bol-hq.vercel.app/favicon.ico']
};

// ネットワークの設定
const networks = [mainnet, arbitrum] as any;

// Wagmi Adapterの作成
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

// AppKitの作成
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  }
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
} 