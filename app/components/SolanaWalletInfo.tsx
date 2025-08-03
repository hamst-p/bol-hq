'use client';

import React from 'react';
import { Window, WindowHeader, WindowContent, Button, Frame } from 'react95';
import { useSolanaWallet } from '../hooks/useSolanaWallet';

interface SolanaWalletInfoProps {
  onClose: () => void;
}

export default function SolanaWalletInfo({ onClose }: SolanaWalletInfoProps) {
  const {
    isConnected,
    address,
    balance,
    cluster,
    setCluster,
    refreshBalance,
    hasWallets,
  } = useSolanaWallet();

  if (!isConnected || !hasWallets) {
    return (
      <Window style={{ width: '320px', height: '200px' }}>
        <WindowHeader>
          <span>Solana Wallet</span>
          <Button onClick={onClose} size="sm" square>
            ×
          </Button>
        </WindowHeader>
        <WindowContent>
          <p>Solana ウォレットが接続されていません。</p>
        </WindowContent>
      </Window>
    );
  }

  const handleNetworkChange = (network: 'mainnet-beta' | 'devnet' | 'testnet') => {
    setCluster(network);
  };

  return (
    <Window style={{ width: '400px', height: '350px' }}>
      <WindowHeader>
        <span>Solana Wallet Info</span>
        <Button onClick={onClose} size="sm" square>
          ×
        </Button>
      </WindowHeader>
      <WindowContent>
        <div style={{ padding: '10px' }}>
          {/* ウォレットアドレス */}
          <Frame variant="field" style={{ marginBottom: '10px', padding: '8px' }}>
            <strong>Address:</strong>
            <div style={{ 
              fontSize: '12px', 
              wordBreak: 'break-all', 
              marginTop: '4px',
              fontFamily: 'monospace' 
            }}>
              {address}
            </div>
          </Frame>

          {/* 残高 */}
          <Frame variant="field" style={{ marginBottom: '10px', padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Balance:</strong>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>
                  {balance.toFixed(4)} SOL
                </div>
              </div>
              <Button size="sm" onClick={refreshBalance}>
                更新
              </Button>
            </div>
          </Frame>

          {/* ネットワーク選択 */}
          <Frame variant="field" style={{ marginBottom: '10px', padding: '8px' }}>
            <strong>Network:</strong>
            <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <Button
                size="sm"
                variant={cluster === 'mainnet-beta' ? 'default' : 'flat'}
                onClick={() => handleNetworkChange('mainnet-beta')}
              >
                Mainnet
              </Button>
              <Button
                size="sm"
                variant={cluster === 'devnet' ? 'default' : 'flat'}
                onClick={() => handleNetworkChange('devnet')}
              >
                Devnet
              </Button>
              <Button
                size="sm"
                variant={cluster === 'testnet' ? 'default' : 'flat'}
                onClick={() => handleNetworkChange('testnet')}
              >
                Testnet
              </Button>
            </div>
          </Frame>

          {/* 現在のネットワーク情報 */}
          <Frame variant="field" style={{ padding: '8px' }}>
            <strong>Current Network:</strong>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              {cluster} ({cluster === 'mainnet-beta' ? 'Production' : 'Test Network'})
            </div>
          </Frame>
        </div>
      </WindowContent>
    </Window>
  );
} 