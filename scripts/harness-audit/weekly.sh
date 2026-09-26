#!/usr/bin/env bash
# Weekly vendor check. Cron this on a machine that can reach the public docs.
# It does not call a model. On drift it writes reports/harness-audit/review-prompt.md.
# Point RDAPQ_AUDIT_REVIEW at a local command if you want that prompt reviewed
# only when the check fails. Example:
#   RDAPQ_AUDIT_REVIEW='ollama run qwen2.5-coder' ./scripts/harness-audit/weekly.sh
#
# crontab -e
#   10 9 * * 1 /opt/repo/rdapq/scripts/harness-audit/weekly.sh >> /var/log/rdapq-harness-audit.log 2>&1
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
mkdir -p reports/harness-audit

set +e
python3 scripts/harness-audit/check.py \
  --report reports/harness-audit/latest.md \
  --prompt reports/harness-audit/review-prompt.md
status=$?
set -e

if [[ "$status" -ne 0 && -n "${RDAPQ_AUDIT_REVIEW:-}" && -f reports/harness-audit/review-prompt.md ]]; then
  # Local review only. The model is not required for the check itself.
  ${RDAPQ_AUDIT_REVIEW} < reports/harness-audit/review-prompt.md || true
fi

exit "$status"
