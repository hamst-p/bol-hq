import React from 'react';
import { ListItem } from 'react95';
import Link from 'next/link';

export interface MenuItemProps {
  icon: string;
  label: string;
  href: string;
  disabled?: boolean;
  external?: boolean; // 外部リンクかどうか
}

export default function MenuItem({ icon, label, href, disabled = false, external = false }: MenuItemProps) {
  const itemStyle = {
    textAlign: 'right' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const linkProps = external 
    ? { target: "_blank", rel: "noopener noreferrer" } 
    : {};

  return (
    <ListItem disabled={disabled} style={itemStyle}>
      <span role="img" style={{ marginLeft: '8px' }}>
        {icon}
      </span>
      <Link 
        href={href} 
        style={{ textDecoration: 'none', color: 'inherit', marginRight: '8px' }}
        {...linkProps}
      >
        {label}
      </Link>
    </ListItem>
  );
}
