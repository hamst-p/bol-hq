# Privy設定ガイド

このプロジェクトではReownのAppKitからPrivyに移行しました。以下の手順でPrivyを設定してください。

## 1. Privy App IDの取得

1. [Privy Dashboard](https://dashboard.privy.io)にアクセス
2. 新しいアプリケーションを作成
3. App IDを取得

## 2. 環境変数の設定

`.env.local`ファイルを更新してください：

```
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
```

## 3. Solanaウォレットの設定

Privyは以下のSolanaウォレットをサポートしています：
- Phantom
- Solflare
- Backpack
- Glow
- その他

## 4. 認証方法

設定可能な認証方法：
- Email（OTP）
- Wallet（外部ウォレット）
- Embedded Wallet（内蔵ウォレット）

## 5. 使用方法

### 基本的な使用方法

```typescript
import { usePrivy } from '@privy-io/react-auth';

function MyComponent() {
  const { login, logout, ready, authenticated, user } = usePrivy();

  if (!ready) return <div>Loading...</div>;

  return (
    <div>
      {authenticated ? (
        <div>
          <p>Welcome, {user?.email?.address || user?.wallet?.address}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
```

### Solanaトランザクション

```typescript
import { useSolanaWallets } from '@privy-io/react-auth/solana';

function SolanaComponent() {
  const { wallets } = useSolanaWallets();
  
  // ウォレットが利用可能な場合
  if (wallets.length > 0) {
    const wallet = wallets[0];
    // トランザクションの送信など
  }
}
```

## 6. 設定オプション

### 外観のカスタマイズ

```typescript
appearance: {
  theme: 'light', // 'light' または 'dark'
  accentColor: '#676FFF',
  logo: '/images/bolana.png',
}
```

### 認証方法の制限

```typescript
loginMethods: ['email', 'wallet'], // 必要な認証方法のみ
```

### 内蔵ウォレットの設定

```typescript
embeddedWallets: {
  createOnLogin: 'users-without-wallets', // ウォレットを持たないユーザーに自動作成
}
```

## 7. 本番環境での設定

本番環境では以下を設定してください：

1. 正しいドメインをPrivy Dashboardに追加
2. HTTPS必須
3. 適切なCSP（Content Security Policy）の設定

## 8. トラブルシューティング

### よくある問題

1. **App IDが無効**: `.env.local`のApp IDが正しいか確認
2. **ドメイン不一致**: Privy Dashboardで正しいドメインが設定されているか確認
3. **ウォレット接続エラー**: ユーザーのウォレットが最新版か確認

### デバッグ方法

```typescript
// デバッグログを有効化
config={{
  // ... その他の設定
  debug: true, // 開発環境でのみ有効にする
}}
```

## 9. 関連リンク

- [Privy Documentation](https://docs.privy.io)
- [Privy Dashboard](https://dashboard.privy.io)
- [Solana Documentation](https://docs.solana.com) 