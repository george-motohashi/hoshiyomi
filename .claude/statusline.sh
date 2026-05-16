#!/bin/bash
# Claude Code status line — model + branch + context% + time
# Tip 12「status line で今の状態を常に把握する」
# サブスクユーザー向け: コスト表示は外し、context% と時刻を中心に表示

input=$(cat)

if command -v jq >/dev/null 2>&1; then
  model=$(echo "$input" | jq -r '.model.display_name // "Claude"')
  cwd=$(echo "$input" | jq -r '.workspace.current_dir // ""')
  ctx_used=$(echo "$input" | jq -r '.context.used // 0')
  ctx_total=$(echo "$input" | jq -r '.context.total // 200000')
else
  model="Claude"
  cwd="$PWD"
  ctx_used=0
  ctx_total=200000
fi

# context 使用率
if [ "$ctx_total" -gt 0 ]; then
  ctx_pct=$(( ctx_used * 100 / ctx_total ))
else
  ctx_pct=0
fi

# git branch
branch=""
if [ -d "$cwd/.git" ] || git -C "$cwd" rev-parse --git-dir >/dev/null 2>&1; then
  branch=$(git -C "$cwd" branch --show-current 2>/dev/null)
fi

# ディレクトリ末端
dir_basename=$(basename "$cwd")

# 現在時刻
now=$(date +%H:%M)

# ANSI 色
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
MAGENTA='\033[0;35m'
RESET='\033[0m'

# context% を 3 段階で色分け
if [ "$ctx_pct" -ge 80 ]; then
  ctx_color="$RED"
  ctx_hint=" ⚠ /compact 推奨"
elif [ "$ctx_pct" -ge 60 ]; then
  ctx_color="$YELLOW"
  ctx_hint=""
else
  ctx_color="$GREEN"
  ctx_hint=""
fi

# 表示組み立て
printf "${CYAN}%s${RESET}" "$model"
printf " ${GRAY}|${RESET} ${MAGENTA}📁 %s${RESET}" "$dir_basename"
[ -n "$branch" ] && printf " ${GRAY}|${RESET} ${GREEN}⎇ %s${RESET}" "$branch"
printf " ${GRAY}|${RESET} ${ctx_color}ctx %d%%${ctx_hint}${RESET}" "$ctx_pct"
printf " ${GRAY}|${RESET} ${GRAY}%s${RESET}" "$now"
