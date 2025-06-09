import Link from 'next/link';
import { Bookmark, Computer, Explore } from '@react95/icons';
import { usePathname } from 'next/navigation';

export default function FooterMenu() {
  const pathname = usePathname();

  // Only show on top page
  if (pathname !== '/') {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-4">
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href=""
        target="_blank"
        rel="noopener noreferrer"
      >
        <Bookmark variant="32x32_4" className="w-6 h-6" />
        CA
      </Link>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://x.com/fuckitwebol"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Computer className="w-6 h-6" />
        X
      </Link>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://dexscreener.com/solana/8eqej7m9banvn96ycizj2o8x3cr8ywmrfcxxjpsmwibc"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Explore className="w-6 h-6" />
        Dexscreener (Solana) →
      </Link>
    </div>
  );
} 