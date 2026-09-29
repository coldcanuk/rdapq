---
name: rdap-q
description: Run the RDAP-Q evidence-first engineering protocol. Invoke with /rdap-q or /rdapq. Load this file, then the current phase playbook only.
disable-model-invocation: true
---
name: rdap-q
version: "1.3.0"
description: Evidence-first engineering protocol. Load this file, then the current phase playbook only.
invocation: /rdapq
home_env: RDAPQ_HOME
home: RDAPQ_HOME else ~/.rdapq (Windows %USERPROFILE%\.rdapq)
state: .rdapq/state
memory: $RDAPQ_HOME/memory
memory_index: $RDAPQ_HOME/memory/index.md
facts: [OBSERVED, USER_SPECIFIED, VERIFIED_EXTERNAL, INFERRED, UNKNOWN]
depth:
  default: lean
  switch: "/rdapq depth lean|standard|full"
  user_switch_wins: true
  file: .rdapq/state/depth.md
  write_file_only_when: user sets the switch
  values:
    lean: [IMPLEMENT, VERIFY]
    standard: [BOOTSTRAP, DISCOVERY, IMPLEMENT, VERIFY]
    full: [BOOTSTRAP, DISCOVERY, PLAN, ARCHITECTURE, IMPLEMENT, VERIFY, AUDIT]
  fallback_if_unset:
    effort_1_or_2: lean
    effort_3: standard
    effort_5_or_8_or_HIGH_or_CRITICAL: full
  rules:
    - phases 00-03 are not mandatory
    - do not load a skipped phase playbook
    - do not write plan, architecture, or discovery state for a skipped phase
    - without BOOTSTRAP, IMPLEMENT observes repo state itself (git status, branch, diff) before the first edit
    - without BOOTSTRAP, memory is not loaded and nothing is promoted; memory load checks are N/A
memory_caps:
  load_full_records: 12
  load_index_rows: 80
  fact_chars: 240
  evidence_chars: 160
  file_bytes: 24576
  global_active: 80
  project_active: 40
  state_evidence_records: 80
  state_iteration_rounds: 3
  state_file_bytes: 49152
  train_rows: 40
persist:
  every_output: false
  write_when: [first_needed_file, depth_switch, gate_transition, terminal, user_status_or_score_or_audit]
  unchanged: do not rewrite
  training_log: .rdapq/state/train.md
  training_when: same as write_when
  training_row: [depth, effort, round, Q, runtime, repo, external, claims, repro, gates, decision, defect]
  training_forbid: [diffs, logs, chat, secrets, restated_architecture, self_score_as_Q]
rules:
  - evidence before inference; never invent paths, APIs, versions, flags, tests, env, or architecture
  - INFERRED or UNKNOWN cannot decide implementation when verification is possible
  - hard gates override scores; a score never means COMPLETE
  - Q is oracle-only; a self-score is a label, not a measurement, and cannot exit
  - Q is UNMEASURED when no oracle ran; UNMEASURED cannot complete
  - small reversible milestones; verify before claiming success
  - task state stays in .rdapq/state; memory is reusable only; current evidence beats memory
  - never store secret values; a source plus an identifier is allowed
  - do not load manifest.json, other playbooks, diagrams, or bulk memory
  - load memory/index.md first, then at most 12 matching full records; compact before work if over cap
  - never bulk-read memory/ or projects/; never gzip, base64, or one-line-tarball memory
commands:
  status: phase, depth, Q, gates, blockers, round
  score: oracle Q; self-card only when this command is used
  depth: set lean, standard, or full; user switch wins
  audit: adversarial final audit; loads AUDIT even on lean
  resume: compact if over cap, reload index and hits plus state, then check drift
  memory: relevant ACTIVE memories and status; never print secrets; never dump the store
  research: discovery; implies depth standard or full for this task
  explain: why this phase, depth, or exit
weights_annotation_only: {correctness: 25, coverage: 15, verification: 15, integration: 10, security: 10, maintainability: 10, architecture: 8, operability: 7}
anchors: {0: absent, "1-2": broken, "3-4": deficient, 5: unverified, 6: gaps, 7: solid, 8: production, 9: exceptional, 10: reference}
caps: {unverified: 5, inferred_dependency: 5, known_defect: 4}
hard_fail: [required_test_fail, unexercised_integration]
risk_target_oracle_Q: {LOW: 7.2, MODERATE: 7.6, HIGH: 8.0, CRITICAL: 8.3}
exit: {max_rounds: 3, same_oracle_twice: STALLED, round_cap: "UNCLEAR_TASK|MISSING_TEST|STALLED", done: "Vibe Code Build complete."}
terminal: [COMPLETE, BLOCKED, STALLED, CONSTRAINT_LIMITED, FAILED_VERIFICATION, UNCLEAR_TASK, MISSING_TEST]
tools: [SEARCH, FETCH, INSPECT, EXECUTE, EDIT, TEST, VCS]
phases:
  BOOTSTRAP: [playbooks/00-bootstrap.md]
  DISCOVERY: [playbooks/01-discovery.md]
  PLAN: [playbooks/02-planning.md]
  ARCHITECTURE: [playbooks/03-architecture.md]
  IMPLEMENT: [playbooks/04-implementation.md]
  VERIFY: [playbooks/05-verification.md]
  AUDIT: [playbooks/06-final-audit.md, playbooks/07-git-worktree.md]
on:
  memory: core/memory.md
  gates: core/gates.md
  score: core/scoring.md
  milestone_or_exit: [core/scoring.md, core/gates.md, core/exit-logic.md]
  git_mutation: playbooks/07-git-worktree.md
  controller_ambiguity: core/controller.md
  tool_mapping: core/capabilities.md
