# my-new-app — Claude Code マスタールール

このフォルダは Claude Code を最強の開発環境として運用するためのベースです。
Boris Cherny の運用 Tips を「ファイルに落とせる部分」と「習慣として守る部分」に分け、前者は本ディレクトリの設定ファイルに、後者は本 CLAUDE.md に集約しています。

> 詳しい背景・全 30 Tips の説明は `claude-code-boris-30tips.html` を参照。

---

## 🎯 4 つの基本サイクル（Plan → Verify → Persist → Automate）

すべての作業は以下の順番で進めること。

1. **Plan**: 大きい変更はまず Plan Mode で調査・計画。実装にいきなり入らない。（Tip 1）
2. **Verify**: 実装したら Claude 自身にテスト・スクショ・CLI 出力で検証させる。（Tip 2）
3. **Persist**: 同じミスを 2 回したら CLAUDE.md か Skill / Hook に必ず還元する。（Tip 4, 11, 24）
4. **Automate**: 1 日 1 回以上やる作業は skill・command・hook に切り出す。（Tip 5, 10, 28）

---

## ⚙️ 絶対ルール（hooks で強制したいレベル）

- **大規模変更を Plan Mode なしで開始しない。** 200 行以上に影響しそうな場合は必ず Plan Mode から。
- **`.env` / `secrets/**` は読まない・書かない・コミットしない。** `.claude/settings.json` の deny に登録済。
- **テストやスクリプトをモックで終わらせない。** Boris の言う「実際に動くものを作る」原則。
- **同じ指摘を 2 回受けたら CLAUDE.md に追記。** `/learn` コマンドで自動化済。

---

## 🧰 このフォルダで使える Claude Code 装備

### Slash Commands（`.claude/commands/`）
- `/planner` — 製品アイデアを `SPEC.md` に展開
- `/generator` — `SPEC.md` のスプリントを実装
- `/evaluator` — Chrome DevTools MCP で実装を検証
- `/learn <内容>` — 学びを CLAUDE.md の「学習履歴」に追記

### Subagents（`.claude/agents/`）
- `code-reviewer` — 完成したコードのレビュー専用。重複・命名・エラー処理を見る
- `debugger` — エラー再現・原因特定・修正提案。test ログを噛ませる

呼び出し方の例:
```
code-reviewer サブエージェントを使って、最近の変更をレビューして
```

### Skills（`.claude/skills/`）
- `verify` — 実装後に Claude 自身で走らせる検証手順（テスト→スクショ→コンソール確認）

### MCP / 外部ツール
- 既存: Chrome DevTools, Figma, Gmail, Google Calendar, Google Drive, IDE
- 必要に応じて Slack / Jira / DB の MCP 接続を追加（Tip 20）

---

## 🌳 並列 worktree 運用（Tip 3）

独立した作業は worktree を切って並列で進める。推奨は 3〜5 本。

```bash
# 例: 認証機能を別 worktree で
git worktree add ../dev-env-auth -b feat/auth
cd ../dev-env-auth && claude

# 一覧
git worktree list

# 不要になったら削除
git worktree remove ../dev-env-auth
```

> 注: このフォルダは git リポジトリではないので、worktree を使いたい場合は先に `git init` してから。

---

## 📝 コーディング・運用規約

### 共通
- コメントは「なぜそうしたか」だけ書く。何をしているかは識別子で表現する
- 1 PR = 1 関心事。混ぜない
- TODO コメントを残さない。残すぐらいなら issue に切る

### 言語・FW を後で決める場合の指針
- 依存は最小化（バニラで動くなら FW を入れない）
- Web 系はブラウザでテストできる形にする（Evaluator が回せるように）

---

## 🔁 ワークフロー早見表

| やりたいこと | 使うもの | 対応 Tip |
|---|---|---|
| 大きい変更 | Plan Mode → `/generator` → `/evaluator` | 1, 2 |
| 同じミスを繰り返さない | `/learn "学び"` | 4, 11 |
| UI を確認したい | Chrome DevTools MCP（自動で発火） | 13 |
| 仕様が曖昧 | 「まず私に質問して要件を10個に分解して」 | 15 |
| 巨大移行 | `claude -p` を for ループで fan-out | 22 |
| context が重い | `/compact` を実行 | 18 |
| 戻したい | Esc 2 回 or `/rewind` | 19 |

---

## 📚 学習履歴（同じミスを二度しないために）

ここには `/learn` または手動で「同じ指摘を 2 回受けた事項」を追記していきます。
最初は空。育てていくのが目的。

<!-- 追記例:
### 2026-05-16
- [ ] HTML 内 JS の文字列で英語引用を入れるとき、外側のクォートと衝突しないよう日本語の鉤括弧「」を使う。一度 SyntaxError でカード非表示になった。
-->

---

## 🔗 関連ファイル
- `claude-code-boris-30tips.html` — 30 Tips の対話的説明書（ブラウザで開く）
- `EVAL_REPORT.md` — 上記 HTML の評価レポート（Evaluator 出力例）
- `README.md` — このフォルダの全体マップ
