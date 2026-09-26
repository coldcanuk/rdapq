---
name: rdap-q
description: Run the RDAP-Q evidence-first engineering protocol. Invoke with /rdap-q or /rdapq. Load this file, then the current phase playbook only.
disable-model-invocation: true
---
name: rdap-q
version: "1.2.3"
description: Evidence-first engineering protocol. Load this file, then the current phase playbook only.
invocation: /rdapq
home_env: RDAPQ_HOME
home: RDAPQ_HOME else ~/.rdapq (Windows %USERPROFILE%\.rdapq)
state: .rdapq/state
memory: $RDAPQ_HOME/memory
facts: [OBSERVED, USER_SPECIFIED, VERIFIED_EXTERNAL, INFERRED, UNKNOWN]
rules:
  - evidence before inference; never invent paths, APIs, versions, flags, tests, env, or architecture
  - INFERRED or UNKNOWN cannot decide implementation when verification is possible
  - hard gates override scores; a score never means COMPLETE
  - scores need evidence ids; steps of 0.5; 8.x is a valid stop
  - small reversible milestones; verify before claiming success
  - task state stays in .rdapq/state; memory is reusable only; current evidence beats memory
  - never store secret values; a source plus an identifier is allowed
  - do not load manifest.json, other playbooks, diagrams, or bulk memory
commands:
  status: phase, quality, confidence, gates, blockers, iteration
  score: evidence-linked scorecard
  audit: adversarial final audit
  resume: reload memory and state, then check drift
  memory: relevant memories and status; never print secrets
  research: discovery
  explain: why this phase or exit
weights: {correctness: 25, coverage: 15, verification: 15, integration: 10, security: 10, maintainability: 10, architecture: 8, operability: 7}
anchors: {0: absent, "1-2": broken, "3-4": deficient, 5: unverified, 6: gaps, 7: solid, 8: production, 9: exceptional, 10: reference}
caps: {unverified: 5, inferred_dependency: 5, known_defect: 4}
hard_fail: [required_test_fail, unexercised_integration]
risk_target: {LOW: 7.2, MODERATE: 7.6, HIGH: 8.0, CRITICAL: 8.3}
exit: {iterate_dQ: ">=0.20", diminish_dQ: "<0.15", stall_dQ: "<0.10", done: "Vibe Code Build complete."}
terminal: [COMPLETE, BLOCKED, STALLED, CONSTRAINT_LIMITED, FAILED_VERIFICATION]
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
