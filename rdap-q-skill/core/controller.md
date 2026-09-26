when: whole_loop_or_ambiguous_next_state
order:
  - resolve home; if unwritable, record it and use repo state
  - load SKILL.md, repo root, relevant memory, then .rdapq/state if present
  - load the current playbook only; observe before acting
  - update facts, assumptions, evidence, risks, decisions
  - milestone: verify, review, score, gate, decide, persist
  - invalid plan -> PLAN; worthwhile fix -> iterate
  - gates pass and diminishing -> audit, then COMPLETE
  - else emit the accurate non-complete terminal state
  - promote only durable lessons
precedence: [user_intent, direct_evidence, repo_state, project_memory, global_memory, external_for_this_version, inference]
replan_if_changes: [scope, architecture, dependencies, sequencing, risk, verification, success_criteria]
context: targeted reads; do not replay chat or load the whole skill tree
