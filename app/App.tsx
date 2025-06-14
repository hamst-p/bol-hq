import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { mainnet, arbitrum, solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { cookieStorage, createStorage } from 'wagmi'

// QueryClientの設定
const queryClient = new QueryClient()

// 1. Get projectId from environment variable
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
if (!projectId) {
  console.warn('NEXT_PUBLIC_REOWN_PROJECT_ID is not defined in .env.local')
}

// 2. Create a metadata object
const metadata = {
  name: 'BOL-HQ-APP',
  description: 'AppKit Example',
  url: 'https://bol-hq.vercel.app/',
  icons: ['https://bol-hq.vercel.app/_next/image?url=%2Fimages%2Fbolana.png&w=256&q=75']
}

// ネットワークの設定
const networks = [mainnet, arbitrum, solana, solanaTestnet, solanaDevnet] as any

// Wagmi Adapterの作成
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, arbitrum],
  projectId: projectId || '',
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
})

// Solana Adapterの作成
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter() as any, new SolflareWalletAdapter() as any]
})

// 3. Create AppKit instance only if projectId exists
if (projectId) {
  createAppKit({
    adapters: [wagmiAdapter, solanaWeb3JsAdapter],
    networks,
    metadata: metadata,
    projectId,
    features: {
      analytics: true
    }
  })
}

interface AppProps {
  children: ReactNode;
}

export default function App({ children }: AppProps) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
} 