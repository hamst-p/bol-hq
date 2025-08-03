# 🔧 プロジェクトセットアップガイド

このプロジェクトは、Privyを使用してSolanaウォレット認証を実装しています。

## 📋 必要なサービス

1. **Privy**: ウォレット認証

## 🚀 セットアップ手順

### 1. Privy の設定

#### 1.1 Privy Dashboard でプロジェクト作成
1. [Privy Dashboard](https://dashboard.privy.io)にアクセス
2. 「Create App」をクリック
3. アプリ名とドメインを設定
4. App ID をコピー

#### 1.2 ドメインの設定
- 開発環境: `localhost:3000`
- 本番環境: あなたのドメイン

#### 1.3 ウォレット設定
Privy Dashboardで以下を有効化：
- Solana ウォレット
- Email認証
- 内蔵ウォレット（必要に応じて）

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定：

```env
# Privy設定
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

## 🎯 機能概要

### 認証機能
- **Email認証**: OTPによる認証
- **ウォレット認証**: Phantom、Solflare等の外部ウォレット
- **内蔵ウォレット**: Privy が提供する内蔵ウォレット

## 🔍 デバッグ情報

### ブラウザコンソールで確認できる情報
- Privy の初期化状態
- ユーザー認証状態

### よくある問題と解決策

#### Connect Walletボタンが「Loading...」で固まる
1. **Privy App ID** が正しく設定されているか確認
2. **ドメイン設定** がPrivy Dashboardで正しく設定されているか確認
3. ブラウザのコンソールでエラーログを確認

## 🛠️ 使用方法

### 基本的な認証
```typescript
import { usePrivyAuth } from './hooks/usePrivyAuth';

function MyComponent() {
  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout, 
    walletAddress 
  } = usePrivyAuth();

  if (!ready) return <div>Loading...</div>;

  return (
    <div>
      {authenticated ? (
        <div>
          <p>Welcome: {walletAddress}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
```

## 📚 参考リンク

- [Privy Documentation](https://docs.privy.io)
- [Solana Documentation](https://docs.solana.com)

## 🆘 サポート

問題が発生した場合：
1. ブラウザのコンソールでエラーログを確認
2. 環境変数の設定を再確認
3. Privy Dashboardの設定を確認

---

**注意**: 本番環境では、環境変数を適切に設定し、セキュリティに注意してください。 