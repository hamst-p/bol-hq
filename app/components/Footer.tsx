import Link from 'next/link';
import { Bookmark, Computer, Explore } from '@react95/icons';
import FooterMenu from './Footer-menu';

export default function Footer() {
  return (
    <footer>
      <FooterMenu />
      <div className="text-[11px] text-gray-700 text-center py-2">
        © Forever Bolana All rights reserved
      </div>
    </footer>
  );
} 