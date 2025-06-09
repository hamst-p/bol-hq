'use client';

import { ThemeProvider } from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { styleReset } from 'react95';
import original from 'react95/dist/themes/original';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('/fonts/ms_sans_serif.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('/fonts/ms_sans_serif_bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
  }
  body {
    font-family: 'ms_sans_serif';
  }
  * {
    font-family: 'ms_sans_serif' !important;
  }
`;

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={original}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
} 