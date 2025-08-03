'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'react95';
import { usePrivyAuth } from '../hooks/usePrivyAuth';
import { useSolanaWallet } from '../hooks/useSolanaWallet';
import SolanaWalletInfo from './SolanaWalletInfo';

export default function WalletConnectButton() {
  const { 
    ready, 
    authenticated, 
    user, 
    loading, 
    login, 
    logout, 
    walletAddress, 
    email 
  } = usePrivyAuth();

  const { isConnected: isSolanaConnected, balance, cluster } = useSolanaWallet();
  const [showWalletInfo, setShowWalletInfo] = useState(false);

  // デバッグログを追加
  useEffect(() => {
    console.log('Privy状態:', {
      ready,
      authenticated,
      user,
      loading,
      appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID
    });
    
    console.log('Solana状態:', {
      isSolanaConnected,
      balance,
      cluster
    });
  }, [ready, authenticated, user, loading, isSolanaConnected, balance, cluster]);

  // 認証状態に応じて表示を変更
  const getDisplayText = () => {
    if (!authenticated || !user) return 'Connect Wallet';
    
    if (walletAddress) {
      return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    }
    
    if (email) {
      return email.length > 20 ? `${email.slice(0, 17)}...` : email;
    }
    
    return 'Connected';
  };

  const handleClick = () => {
    console.log('ボタンがクリックされました。現在の状態:', { ready, authenticated, loading });
    
    if (!ready) {
      console.log('Privyの準備が完了していません');
      return;
    }
    
    if (loading) {
      console.log('ローディング中です');
      return;
    }
    
    if (authenticated) {
      console.log('ログアウトを実行します');
      logout();
    } else {
      console.log('ログインを実行します');
      login();
    }
  };

  // 右クリックでウォレット情報を表示
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (authenticated && isSolanaConnected) {
      setShowWalletInfo(true);
    }
  };

  // ボタンの状態を決定
  const isDisabled = !ready || loading;
  const buttonText = loading ? 'Loading...' : getDisplayText();

  return (
    <>
      <Button
        onClick={handleClick}
        onContextMenu={handleRightClick}
        disabled={isDisabled}
        title={authenticated && isSolanaConnected ? '右クリックでウォレット情報を表示' : ''}
        style={{
          width: '150px',
          padding: '2px 4px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '12px' }}>{buttonText}</span>
          {authenticated && isSolanaConnected && (
            <span style={{ fontSize: '10px', opacity: 0.8 }}>
              {balance.toFixed(2)} SOL ({cluster})
            </span>
          )}
        </div>
      </Button>

      {/* Solana ウォレット情報ウィンドウ */}
      {showWalletInfo && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000
        }}>
          <SolanaWalletInfo onClose={() => setShowWalletInfo(false)} />
        </div>
      )}
    </>
  );
} 