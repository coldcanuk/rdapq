phase: PLAN
load_if: depth is full
if_skipped: do not execute; do not write plan.md
shape: [milestones, tasks]
task: [id, objective, files_if_known, evidence, action, verification]
block_execute_if: [ambiguous_success, critical_assumption_open, imagined_paths, task_without_verification, destructive_without_safeguard]
out: .rdapq/state/plan.md
write: once, then only if scope changes
