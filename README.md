# my-new-app

Claude Code 用に最適化された開発環境です。
このプロジェクトは `development-environment` マスターから生成されました。

## はじめ方

```bash
cd ~/Desktop/dev/development-environment/my-new-app
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
