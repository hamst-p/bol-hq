'use client';

import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useEffect, useState } from 'react'

// QueryClientの設定
const queryClient = new QueryClient()

// AppKit初期化フラグ
let appKitInitialized = false;

interface AppProps {
  children: ReactNode;
}

export default function App({ children }: AppProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (appKitInitialized) {
      setIsInitialized(true);
      return;
    }

    try {
      console.log('Initializing AppKit on client side...');

      // 0. Set up Solana Adapter with explicit wallet configuration
      const solanaWeb3JsAdapter = new SolanaAdapter({
        wallets: [new PhantomWalletAdapter() as any, new SolflareWalletAdapter() as any]
      })

      // 1. Get projectId from https://cloud.reown.com
      const projectId = process.env.REOWN_PROJECT_ID || 'default_project_id';

      // 2. Create a metadata object with environment-specific URL
      const isDevelopment = process.env.NODE_ENV === 'development'
      const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://bol-hq.vercel.app'

      const metadata = {
        name: 'BOL-HQ-APP',
        description: 'Solana Wallet Connection for BOL',
        url: baseUrl,
        icons: [`${baseUrl}/images/bolana.png`]
      }

      console.log('AppKit initialization:', {
        projectId,
        baseUrl,
        isDevelopment,
        metadata
      });

      // 3. Create modal with Solana-only configuration
      createAppKit({
        adapters: [solanaWeb3JsAdapter],
        networks: [solana, solanaTestnet, solanaDevnet],
        metadata: metadata,
        projectId,
        features: {
          analytics: true,
          email: false, // Disable email login
          socials: [], // Disable social logins (Google, etc.)
          emailShowWallets: false,
          onramp: false, // Disable fiat on-ramp
          swaps: false // Disable swap feature
        },
        themeMode: 'light',
        themeVariables: {
          '--w3m-font-family': 'ms_sans_serif, Arial, sans-serif',
          '--w3m-border-radius-master': '0px'
        }
      });

      appKitInitialized = true;
      setIsInitialized(true);
      console.log('AppKit created successfully on client side');
    } catch (error) {
      console.error('Failed to create AppKit:', error);
      setIsInitialized(true); // Still allow rendering even if AppKit fails
    }
  }, []);

  // AppKitの初期化が完了するまで待機
  if (!isInitialized) {
    return (
      <QueryClientProvider client={queryClient}>
        <div>Loading wallet configuration...</div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 