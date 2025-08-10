'use client';

import React, { useState } from 'react';
import { Frame, Button, List, Divider } from 'react95';
import Image from 'next/image';
import WalletConnectButton from './WalletConnectButton';
import MenuItem from './MenuItem';
import { menuData } from './menuData';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <Frame style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 6px', minHeight: '44px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Button
            onClick={() => setOpen(!open)}
            style={{ 
              fontWeight: 'bold',
              padding: '2px 12px',
              height: '40px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Image
              src="/images/bolana.png"
              alt="Bolana logo"
              width={32}
              height={32}
              style={{ marginRight: 8, marginTop: -4 }}
            />
            Fuck It
          </Button>
          {open && (
            <List
              style={{
                position: 'absolute',
                left: '0',
                top: '100%',
                zIndex: 1000
              }}
              onClick={() => setOpen(false)}
            >
              {menuData.map((item, index) => 
                item === 'divider' ? (
                  <Divider key={`divider-${index}`} />
                ) : (
                  <MenuItem
                    key={`menu-${index}`}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    disabled={item.disabled}
                    external={item.external}
                  />
                )
              )}
            </List>
          )}
        </div>

        <WalletConnectButton />
      </div>
    </Frame>
  );
} 