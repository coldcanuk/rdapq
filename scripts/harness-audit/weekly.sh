#!/usr/bin/env bash
# Weekly vendor check. Cron this on a machine that can reach the public docs.
# It does not call a model. On drift it writes reports/harness-audit/review-prompt.md
# and exits non-zero. It does not execute a review command from the environment.
#
# crontab, from the repository root, as the user who owns /opt/repo/rdapq:
#   10 9 * * 1 cd /opt/repo/rdapq && ./scripts/harness-audit/weekly.sh >> /var/log/rdapq-harness-audit.log 2>&1
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
mkdir -p reports/harness-audit

python3_bin="/usr/bin/python3"
if [[ ! -x "$python3_bin" ]]; then
  echo "error: $python3_bin is required" >&2
  exit 2
fi

"$python3_bin" scripts/harness-audit/check.py \
  --report reports/harness-audit/latest.md \
  --prompt reports/harness-audit/review-prompt.md
