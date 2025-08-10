import { MenuItemProps } from './MenuItem';

export type MenuDataItem = MenuItemProps | 'divider';

export const menuData: MenuDataItem[] = [
  {
    icon: '🏠',
    label: 'Home',
    href: '/'
  },
  {
    icon: '💰',
    label: 'Swap',
    href: 'https://jup.ag/swap/SOL-JDjprgWYuidVGfExWzMp7Z81K3T6Qsg5aJCnG6srRLGW',
    external: true
  },
  {
    icon: '📈',
    label: 'Chart',
    href: 'https://dexscreener.com/solana/8eqej7m9banvn96ycizj2o8x3cr8ywmrfcxxjpsmwibc',
    external: true
  },
  {
    icon: '🌏',
    label: 'Socials',
    href: '/account'
  },
  'divider',
  {
    icon: '🎨',
    label: 'Meme Bank',
    href: 'https://memedepot.com/d/bol',
    external: true
  },
  {
    icon: '👆',
    label: 'TAP IT WE BOL',
    href: '/tapitwebol',
    disabled: true
  },
  {
    icon: '💣',
    label: 'MINE IT WE BOL',
    href: '/mineabol'
  },
  {
    icon: '👽',
    label: 'Bolana Maker',
    href: '/bolanamaker'
  },
  {
    icon: '🍜',
    label: '3D Bol Experiment',
    href: '/3d'
  },
  'divider',
  {
    icon: '🔙',
    label: 'Logout',
    href: '/'
  }
];
