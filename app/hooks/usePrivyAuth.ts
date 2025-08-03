import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export const usePrivyAuth = () => {
  const [loading, setLoading] = useState(true);
  
  // Privyプロバイダーが利用できない場合のエラーハンドリング
  let privyData;
  try {
    privyData = usePrivy();
  } catch (error) {
    console.warn('Privyプロバイダーが利用できません:', error);
    // Privyが利用できない場合のデフォルト値
    privyData = {
      ready: false,
      authenticated: false,
      user: null,
      login: async () => {
        console.warn('Privyが利用できないためログインできません');
      },
      logout: async () => {
        console.warn('Privyが利用できないためログアウトできません');
      }
    };
  }

  const { ready, authenticated, user, login, logout } = privyData;

  useEffect(() => {
    if (ready) {
      setLoading(false);
    }
  }, [ready]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return {
    // Privy の状態
    ready,
    authenticated,
    user,
    
    // カスタム状態
    loading: !ready,
    
    // 認証関数
    login: handleLogin,
    logout: handleLogout,
    
    // ユーザー情報
    walletAddress: user?.wallet?.address || null,
    email: user?.email?.address || null,
  };
}; 