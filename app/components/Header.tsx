'use client';

import React, { useState } from 'react';
import { Frame, Button, List, ListItem, Divider } from 'react95';
import Image from 'next/image';
import Link from 'next/link';

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
              padding: '2px 4px',
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
              style={{ marginRight: 4 }}
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
              <ListItem style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span role="img" aria-label="🏠" style={{ marginLeft: '8px' }}>
                  🏠
                </span>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit', marginRight: '8px' }}>
                  Home
                </Link>
              </ListItem>
              <ListItem style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span role="img" aria-label="📁" style={{ marginLeft: '8px' }}>
                  💰
                </span>
                <Link href="https://jup.ag/swap/SOL-JDjprgWYuidVGfExWzMp7Z81K3T6Qsg5aJCnG6srRLGW" style={{ textDecoration: 'none', color: 'inherit', marginRight: '8px' }}>
                  Swap
                </Link>
              </ListItem>
              <ListItem style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span role="img" aria-label="📁" style={{ marginLeft: '8px' }}>
                  📈
                </span>
                <Link href="https://dexscreener.com/solana/8eqej7m9banvn96ycizj2o8x3cr8ywmrfcxxjpsmwibc" style={{ textDecoration: 'none', color: 'inherit', marginRight: '8px' }}>
                  Chart
                </Link>
              </ListItem>
              <ListItem style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span role="img" aria-label="📁" style={{ marginLeft: '8px' }}>
                  🌏
                </span>
                <Link href="/account" style={{ textDecoration: 'none', color: 'inherit', marginRight: '8px' }}>
                  Socials
                </Link>
              </ListItem>
              <Divider />
              <ListItem style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span role="img" aria-label="📁" style={{ marginLeft: '8px' }}>
                  🎨
                </span>
                <Link href="https://memedepot.com/d/bol" style={{ textDecoration: 'none', color: 'inherit', marginRight: '8px' }}>
                  Meme Bank
                </Link>
              </ListItem>
              <ListItem disabled style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span role="img" aria-label="📁" style={{ marginLeft: '8px' }}>
                  👆
                </span>
                <Link href="/account" style={{ textDecoration: 'none', color: 'inherit', marginRight: '8px' }}>
                  TAP IT WE BOL
                </Link>
              </ListItem>
              <ListItem disabled style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span role="img" aria-label="📁" style={{ marginLeft: '8px' }}>
                  👽
                </span>
                <Link href="/account" style={{ textDecoration: 'none', color: 'inherit', marginRight: '8px' }}>
                  Bolana Maker
                </Link>
              </ListItem>
              <ListItem style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span role="img" aria-label="📁" style={{ marginLeft: '8px' }}>
                  🍜
                </span>
                <Link href="/3d" style={{ textDecoration: 'none', color: 'inherit', marginRight: '8px' }}>
                  3D Bol Experiment
                </Link>
              </ListItem>
              <Divider />
              <ListItem disabled style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span role="img" aria-label="🔙" style={{ marginLeft: '8px' }}>
                  🔙
                </span>
                <Link href="/logout" style={{ textDecoration: 'none', color: 'inherit', marginRight: '8px' }}>
                  Logout
                </Link>
              </ListItem>
            </List>
          )}
        </div>

        <Button
          style={{
            width: '150px',
            padding: '2px 4px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Connect Wallet
        </Button>
      </div>
    </Frame>
  );
} 