when: whole_loop_or_ambiguous_next_state
order:
  - resolve depth: user switch, else .rdapq/state/depth.md, else SKILL.md fallback from effort and risk
  - resolve home; if unwritable, record it and use repo state
  - load SKILL.md, repo root, memory index, compact if over cap, then at most 12 hits, then .rdapq/state if present
  - load the current included playbook only; do not load a skipped phase
  - observe before acting
  - update facts and evidence in memory; persist files only on SKILL.md persist.write_when
  - milestone: verify, gate, decide; score only the oracle row
  - invalid plan at depth full -> PLAN; at lean or standard, ask or mark UNCLEAR_TASK
  - gate fail with a new oracle and rounds < 3 -> one fix
  - same oracle twice, or round cap -> STALLED, UNCLEAR_TASK, or MISSING_TEST
  - gates pass and oracle Q meets the risk floor -> COMPLETE
  - else emit the accurate non-complete terminal state
  - append one train.md row at the checkpoint; do not append on an unchanged turn
  - promote only durable lessons that pass write_forbid and caps
precedence: [user_depth_switch, user_intent, direct_evidence, repo_state, project_memory, global_memory, external_for_this_version, inference]
replan_if_changes: [scope, architecture, dependencies, sequencing, risk, verification, success_criteria]
context: targeted reads; do not replay chat or load the whole skill tree; never bulk-read memory/
persist: checkpoint only; never rewrite state to narrate the current output
