'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'styled-components';
import { styleReset } from 'react95';
import { createGlobalStyle } from 'styled-components';
import original from 'react95/dist/themes/original';
import StyledComponentsRegistry from './lib/registry';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { chains, projectId, metadata } from './config/web3';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
`;

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient();

const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: chains,
  metadata,
  projectId,
  features: {
    analytics: true,
  }
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <GlobalStyles />
          <ThemeProvider theme={original}>
            <WagmiProvider config={wagmiAdapter.wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </WagmiProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
