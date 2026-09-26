phase: PLAN
shape: [phases, milestones, tasks]
task: [id, milestone, objective, files_if_known, evidence, action, commands_or_TBD-EVIDENCE, verification, observable, dependencies]
plan_weights: {coverage: 15, grounding: 15, architecture: 15, completeness: 10, order: 10, verification: 15, risk: 10, repro: 5, git_safety: 5}
block_execute_if: [ambiguous_success, critical_assumption_open, imagined_paths, task_without_verification, destructive_without_safeguard, bad_order]
out: .rdapq/state/plan.md
