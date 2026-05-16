# hoshiyomi（星詠み）

**AI × スピリチュアル**のスモールビジネス hoshiyomi の運営リポジトリです。
四柱推命・西洋占星術・タロットを核に、顔出しせず自動化された仕組みで「毎日のお守り体験」を届け、コアファンを育てます。

- 📜 事業仕様: `SPEC.md`
- 🛠 運用ルール: `CLAUDE.md`
- 🎯 Phase 1 目標: 月5万円（PDF レポート + LINE 月額 + AI Web アプリ）

このリポジトリは Claude Code 用に最適化された開発環境ベースから生成されました。

## はじめ方

```bash
cd ~/Desktop/dev/hoshiyomi
claude
```

起動するだけで以下が自動有効化されます:

- 📜 **CLAUDE.md** — Boris 流のマスタールール（Plan → Verify → Persist → Automate）
- 🔒 **permissions** — `.env`, `secrets/**`, `sudo`, `git push --force` 等を完全拒否
- 📊 **statusline** — モデル / ディレクトリ / ブランチ / ctx% / 時刻
- 🪝 **PostToolUse hook** — ファイル編集を `.claude/audit.log` に記録

## スラッシュコマンド

| コマンド | 用途 |
|---|---|
| `/planner` | アイデアを `SPEC.md` に展開 |
| `/generator` | `SPEC.md` のスプリントを実装 |
| `/evaluator` | Chrome DevTools MCP で実装をテスト |
| `/learn <学び>` | CLAUDE.md の学習履歴に追記 |

## Subagents

| 名前 | 用途 |
|---|---|
| `code-reviewer` | 完成コードのレビュー専用 |
| `debugger` | エラー再現・原因特定専用 |

## まず試すワンライナー

```
/planner 作りたいものを1〜2行で
```

詳しい運用ルールは `CLAUDE.md` を参照。
