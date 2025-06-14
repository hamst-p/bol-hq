'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import StyledComponentsRegistry from './lib/registry';
import { ThemeProvider } from 'styled-components';
import { styleReset } from 'react95';
import { createGlobalStyle } from 'styled-components';
import original from 'react95/dist/themes/original';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
`;

const inter = Inter({ subsets: ['latin'] });

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
            <Providers>
              {children}
            </Providers>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
