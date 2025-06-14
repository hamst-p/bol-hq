# 環境変数設定

このプロジェクトで使用する環境変数の設定方法について説明します。

## セットアップ手順

1. プロジェクトのルートディレクトリに `.env.local` ファイルを作成します
2. 以下の環境変数を設定します

## 必要な環境変数

```env
# WalletConnect Project ID
# 取得方法: https://cloud.walletconnect.com/ でアカウントを作成し、
# 新しいプロジェクトを作成してProject IDを取得してください
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

## 注意事項

- `.env.local` ファイルは決してGitにコミットしないでください
- このファイルには機密情報が含まれるため、必ず `.gitignore` に追加してください
- 開発チームメンバーとは安全な方法で環境変数を共有してください

## 開発環境でのテスト用サンプル値

```env
# これはテスト用のダミー値です。実際の開発では正しいProject IDに置き換えてください
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=abc123def456ghi789jkl012mno345pqr678stu
``` 