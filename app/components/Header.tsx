'use client';

import React, { useState } from 'react';
import { Frame, Button, List, ListItem, Divider } from 'react95';
import Image from 'next/image';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Button
            onClick={() => setOpen(!open)}
            style={{ fontWeight: 'bold' }}
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
              <ListItem>
                <span role="img" aria-label="👨‍💻">
                  👨‍💻
                </span>
                Profile
              </ListItem>
              <ListItem>
                <span role="img" aria-label="📁">
                  📁
                </span>
                My account
              </ListItem>
              <Divider />
              <ListItem disabled>
                <span role="img" aria-label="🔙">
                  🔙
                </span>
                Logout
              </ListItem>
            </List>
          )}
        </div>

        <Button
          style={{
            width: '150px',
            padding: '4px',
          }}
        >
          Connect Wallet
        </Button>
      </div>
    </Frame>
  );
} 