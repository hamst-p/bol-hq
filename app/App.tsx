import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

// 0. Set up Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter() as any, new SolflareWalletAdapter() as any]
})

// 1. Get projectId from environment variable
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not defined in .env.local')
}

// 2. Create a metadata object
const metadata = {
  name: 'BOL-HQ-APP',
  description: 'AppKit Example',
  url: 'https://bol-hq.vercel.app/',
  icons: ['https://bol-hq.vercel.app/_next/image?url=%2Fimages%2Fbolana.png&w=256&q=75']
}

// 3. Create modal
createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true
  }
})

export default function App() {
  return <div>BOL HQ App</div>
} 