phase: ARCHITECTURE
load_if: depth is full
if_skipped: do not execute; do not write an architecture decision
when: [interfaces, boundaries, persistence, security, concurrency, integration]
record: [decision, evidence, why, risks, verification]
rules: [fit_current_system, no_unrelated_refactor, promote_only_if_durable_and_verified]
out: decisions.md
write: once per decision, not per output
