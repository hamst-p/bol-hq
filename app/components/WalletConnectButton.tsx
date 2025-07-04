'use client';

import React, { useEffect } from 'react';
import { Button } from 'react95';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

export default function WalletConnectButton() {
  const appKit = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  // デバッグ情報をコンソールに出力
  useEffect(() => {
    console.log('WalletConnectButton - Full AppKit object:', appKit);
    console.log('WalletConnectButton - AppKit hooks:', {
      appKit: !!appKit,
      open: !!appKit?.open,
      address,
      isConnected
    });

    // グローバルなAppKitインスタンスも確認
    console.log('Global window objects:', {
      appKit: (window as any).appKit,
      w3m: (window as any).w3m
    });
  }, [appKit, address, isConnected]);

  const displayAddress = isConnected && address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : 'Connect Wallet';

  const handleClick = () => {
    console.log('Button clicked, attempting to open AppKit...');
    console.log('AppKit object:', appKit);
    
    try {
      if (appKit?.open) {
        console.log('Calling appKit.open()...');
        appKit.open();
        console.log('appKit.open() called successfully');
      } else if ((window as any).appKit?.open) {
        console.log('Using global appKit.open()...');
        (window as any).appKit.open();
        console.log('Global appKit.open() called successfully');
      } else if ((window as any).w3m?.open) {
        console.log('Using global w3m.open()...');
        (window as any).w3m.open();
        console.log('Global w3m.open() called successfully');
      } else {
        console.error('No AppKit open method available');
        console.log('Available AppKit methods:', Object.keys(appKit || {}));
      }
    } catch (error) {
      console.error('Failed to open AppKit modal:', error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={true}
      style={{
        width: '150px',
        padding: '2px 4px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {displayAddress}
    </Button>
  );
} 