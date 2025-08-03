import { useEffect, useState } from 'react';
import { usePrivy, useSolanaWallets } from '@privy-io/react-auth';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

// Solanaクラスターの型定義
export type SolanaCluster = 'mainnet-beta' | 'devnet' | 'testnet';

export const useSolanaWallet = () => {
  // Privyプロバイダーが利用できない場合のエラーハンドリング
  let privyData;
  let walletsData;
  
  try {
    privyData = usePrivy();
    walletsData = useSolanaWallets();
  } catch (error) {
    console.warn('Privyプロバイダーが利用できません:', error);
    privyData = {
      ready: false,
      authenticated: false,
      user: null
    };
    walletsData = {
      wallets: []
    };
  }

  const { ready, authenticated, user } = privyData;
  const { wallets } = walletsData;
  const [activeWallet, setActiveWallet] = useState<any>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [cluster, setCluster] = useState<SolanaCluster>('mainnet-beta');

  // アクティブなウォレットの設定
  useEffect(() => {
    if (wallets.length > 0) {
      setActiveWallet(wallets[0]);
    } else {
      setActiveWallet(null);
    }
  }, [wallets]);

  // Connection の設定
  useEffect(() => {
    const getRpcUrl = (cluster: SolanaCluster) => {
      switch (cluster) {
        case 'mainnet-beta':
          return process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC || 'https://api.mainnet-beta.solana.com';
        case 'devnet':
          return process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC || 'https://api.devnet.solana.com';
        case 'testnet':
          return process.env.NEXT_PUBLIC_SOLANA_TESTNET_RPC || 'https://api.testnet.solana.com';
        default:
          return 'https://api.mainnet-beta.solana.com';
      }
    };

    const rpcUrl = getRpcUrl(cluster);
    const newConnection = new Connection(rpcUrl, 'confirmed');
    setConnection(newConnection);
  }, [cluster]);

  // 残高の取得
  useEffect(() => {
    const fetchBalance = async () => {
      if (activeWallet?.address && connection) {
        try {
          const publicKey = new PublicKey(activeWallet.address);
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / 1000000000); // lamportsからSOLに変換
        } catch (error) {
          console.error('残高取得エラー:', error);
          setBalance(0);
        }
      }
    };

    fetchBalance();
  }, [activeWallet, connection]);

  // トランザクション送信
  const sendTransaction = async (transaction: Transaction) => {
    if (!activeWallet || !connection) {
      throw new Error('ウォレットまたはコネクションが利用できません');
    }

    try {
      const signature = await activeWallet.sendTransaction(transaction, connection);
      console.log('トランザクション送信成功:', signature);
      return signature;
    } catch (error) {
      console.error('トランザクション送信エラー:', error);
      throw error;
    }
  };

  // サインメッセージ
  const signMessage = async (message: string) => {
    if (!activeWallet) {
      throw new Error('ウォレットが利用できません');
    }

    try {
      const signature = await activeWallet.signMessage(new TextEncoder().encode(message));
      console.log('メッセージサイン成功:', signature);
      return signature;
    } catch (error) {
      console.error('メッセージサインエラー:', error);
      throw error;
    }
  };

  // 残高の更新
  const refreshBalance = async () => {
    if (activeWallet?.address && connection) {
      try {
        const publicKey = new PublicKey(activeWallet.address);
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / 1000000000);
      } catch (error) {
        console.error('残高更新エラー:', error);
      }
    }
  };

  return {
    // 状態
    ready,
    authenticated,
    wallets,
    activeWallet,
    connection,
    balance,
    cluster,
    
    // ウォレット情報
    address: activeWallet?.address || null,
    publicKey: activeWallet?.address ? new PublicKey(activeWallet.address) : null,
    
    // 関数
    setActiveWallet,
    setCluster,
    sendTransaction,
    signMessage,
    refreshBalance,
    
    // ユーティリティ
    isConnected: !!activeWallet,
    hasWallets: wallets.length > 0,
  };
}; 