# スプリントステータス

## 技術スタック
- **FW**: Next.js 14.2 (App Router) + React 18 + TypeScript 5
- **Styling**: Tailwind CSS 3.4 + Google Fonts (Shippori Mincho / Inter)
- **AI**: Anthropic Claude (`claude-haiku-4-5`)。`ANTHROPIC_API_KEY` 未設定時は決定論フォールバック
- **画像化**: html-to-image
- **起動**: `npm run dev`（既定 :3000、3000 が埋まっている場合は 3001/3002…と自動フォールバック）
- **ビルド**: `npm run build && npm start`

### 環境変数
`.env.example` をコピーして `.env.local` を作成:
```
ANTHROPIC_API_KEY=sk-ant-...   # 任意。未設定でもフォールバックで動作
NEXT_PUBLIC_SITE_URL=https://hoshiyomi.example.com
```

---

## スプリント1: AI ワンポイント鑑定 LP — completed
**開始日**: 2026-05-16
**完了日**: 2026-05-16
**評価サイクル**: 1/3（初回 FAIL → 修正 1 巡で PASS）

### 機能
- [x] **F01** 無料ワンポイント AI 鑑定
- [x] **F02** シェア用メッセージカード生成

### 解釈の記録
- API キーが未設定の場合、F01 は決定論的な「星詠み」を返す（生年月日 × 今日の日付からハッシュ → テーマ/本文/ラッキーカラー/ラッキーアイテムを選択）。SPEC では「AI」と謳っているが、API キー未設定時はあくまでフォールバック挙動として透過的に動作し、`mode: "fallback"` フィールドで明示する。
- スマホ縦表示を最優先（414×896 で全要素が読みやすく折り返されることを確認済）

### 自己評価（最終実行）
| 基準 | 閾値 | スコア | ステータス | メモ |
|------|------|--------|-----------|------|
| 機能の完成度 | 80 | 92 | PASS | F01+F02 両方完成。API/UI/シェア導線まで通る |
| 受け入れ基準の達成 | 80 | 90 | PASS | F01: 5/5 AC、F02: 4/4 AC を確認 |
| エラーハンドリング | 70 | 85 | PASS | 無効日付/未来日/不正ボディすべて 400 で friendly メッセージ |
| UI の仕上がり | 70 | 88 | PASS | 星空背景・金線・ガラスカード・序数フォントで世界観統一 |
| リグレッションなし | 90 | — | N/A | Sprint 1 が最初。リグレなし |

### 自動検証ログ
- `npm run build` → ✓ Compiled successfully (LP 8.91 kB / First Load 96 kB)
- `tsc --noEmit` → 型エラー 0
- API テスト（curl で 5 ケース）：
  - 正常入力 → 200 + Reading JSON（fallback モード）
  - 2 月 30 日 → 400 + 日本語エラー
  - 未来日（2099-01-01）→ 400 + 日本語エラー
  - 不正ボディ（{hello:"world"}）→ 400 + 日本語エラー
  - 再現性確認（同入力で同出力）→ 一致
- Chrome DevTools 検証（414×896 mobile viewport）:
  - LP ファーストビュー OK（HOSHIYOMI / 見出し / 説明 / フォーム / 注釈 / footer）
  - フォーム入力 1995/7/15 → 「今日の星詠みを受け取る」ボタン → 結果カード描画 OK
  - シェアセクション（保存 / Web Share / X / Threads）すべてレンダリング OK
  - console エラーは favicon.ico 404 のみ → `src/app/icon.svg` 追加で解消

### エバリュエーター結果
**PASS（重み付き合計 93）**
- 機能の完成度 94 / 受け入れ基準 93 / エラーハンドリング 92 / UI 一貫性 90
- 初回 FAIL の重大2件（F01 AC2 本文長 / F02 AC2 複数サイズ）+ 軽微2件（URL / Instagram 注釈）すべて修正済み
- 詳細は `EVAL_REPORT.md` を参照

### スクショ
- `/var/folders/48/.../T/hoshiyomi-sprint1-lp-mobile.png`
- `/var/folders/48/.../T/hoshiyomi-sprint1-result-mobile.png`

---

## スプリント2: メール/LINE 集客動線 — pending
## スプリント3: 有料 PDF レポート販売 — pending
## スプリント4: SNS 自動投稿基盤 — pending
## スプリント5: LINE bot プレミアム月額 — pending
## スプリント6: ブランドサイト/メルマガ — pending
## スプリント7: コミュニティ立ち上げ — pending
## スプリント8: 高単価ハイブリッド鑑定 — pending
