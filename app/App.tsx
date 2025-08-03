'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';

// QueryClientの設定
const queryClient = new QueryClient();

interface AppProps {
  children: ReactNode;
}

export default function App({ children }: AppProps) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  // HTTPS接続かどうかを判定
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  
  useEffect(() => {
    console.log('App初期化 - Privy App ID:', privyAppId);
    console.log('HTTPS接続:', isHttps);
  }, [privyAppId, isHttps]);

  // Privy App IDが設定されていない場合は、プロバイダーなしでchildrenを返す
  if (!privyAppId) {
    console.warn('NEXT_PUBLIC_PRIVY_APP_ID環境変数が設定されていません');
    return <div>{children}</div>;
  }

  // Solana RPC URLの設定（環境変数からカスタムRPCを使用可能）
  const getSolanaRpcUrl = (network: string) => {
    switch (network) {
      case 'mainnet-beta':
        return process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC || 'https://api.mainnet-beta.solana.com';
      case 'devnet':
        return process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC || 'https://api.devnet.solana.com';
      case 'testnet':
        return process.env.NEXT_PUBLIC_SOLANA_TESTNET_RPC || 'https://api.testnet.solana.com';
      default:
        return 'https://api.mainnet-beta.solana.com';
    }
  };

  // HTTPSでない場合はPrivyプロバイダーを完全に無効化
  if (!isHttps) {
    console.log('HTTP接続のため、Privyプロバイダーを無効化します');
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={privyAppId}
        config={{
          // ウォレットの設定
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
          // 認証設定
          loginMethods: ['email', 'wallet'],
          // Solanaクラスターの設定（Privyのドキュメントに基づく）
          solanaClusters: [
            {
              name: 'mainnet-beta',
              rpcUrl: getSolanaRpcUrl('mainnet-beta'),
            },
            {
              name: 'devnet',
              rpcUrl: getSolanaRpcUrl('devnet'),
            },
            {
              name: 'testnet',
              rpcUrl: getSolanaRpcUrl('testnet'),
            },
          ],
          // アピアランス設定
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: '/images/bolana.png',
          },
        }}
      >
        {children}
      </PrivyProvider>
    </QueryClientProvider>
  );
} 