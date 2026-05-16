# hoshiyomi デプロイ手順

公開先は **Vercel** を推奨します（Next.js との相性が最強、無料枠で十分、東京リージョン `hnd1` 設定済み）。

---

## 1. GitHub にプッシュする

リポジトリは未公開。手順:

```bash
# 1) GitHub で新規 private リポジトリを作成（名前: hoshiyomi）
#    https://github.com/new
#    ・README/.gitignore は追加しない（既に存在）

# 2) 自分の GitHub ユーザー名で remote を追加（YOUR_USER は置換）
git remote add origin git@github.com:YOUR_USER/hoshiyomi.git

# 3) push
git push -u origin main
```

> `gh` CLI が入っていれば 1 行で済む:
> ```bash
> gh repo create hoshiyomi --private --source=. --remote=origin --push
> ```

---

## 2. Vercel にデプロイする

### A. ブラウザ（推奨・最速）
1. https://vercel.com/new で GitHub アカウントを連携
2. 「hoshiyomi」リポジトリを Import
3. Framework は **Next.js** が自動検出される
4. Environment Variables に以下を追加（後述）
5. 「Deploy」をクリック → 数分で `https://hoshiyomi-XXX.vercel.app` が払い出される

### B. CLI（ローカルから直接）
```bash
npx vercel
# プロジェクト名、リンク先などを対話で答える
npx vercel --prod  # 本番デプロイ
```

---

## 3. 環境変数（Vercel の Settings → Environment Variables）

| キー | 必須 | 用途 |
|---|---|---|
| `ANTHROPIC_API_KEY` | 任意 | 未設定でも fallback で動作。設定すると AI 鑑定モードに切替 |
| `NEXT_PUBLIC_SITE_URL` | 推奨 | OGP / シェア画像の footer 表示用。デプロイ後の独自ドメイン or `https://hoshiyomi-XXX.vercel.app` |

`ANTHROPIC_API_KEY` 取得: https://console.anthropic.com/ → Settings → API Keys

---

## 4. 独自ドメイン（後日）

候補:
- `hoshiyomi.app`（モダン、海外も OK）
- `hoshiyomi.jp`（国内向け、ブランド感◎）
- `hoshi-yomi.com`

ドメイン取得 → Vercel の Domains 設定で追加 → 自動 SSL。

---

## 5. ローカル開発

```bash
npm install
npm run dev   # http://localhost:3000（埋まっていれば 3001/3002…）
```

### `.env.local` の例
プロジェクトルートに `.env.local` を作成:

```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> `.env.local` は `.gitignore` 済み。コミット対象外。

---

## 6. デプロイ後にやること

- [ ] LP の OGP 画像を確認（X / Threads でリンクプレビュー）
- [ ] スマホ実機で動作確認（特に画像保存 / Web Share）
- [ ] LP の URL を SNS プロフィールに貼る
- [ ] Vercel Analytics を有効化（無料、Core Web Vitals 計測）
