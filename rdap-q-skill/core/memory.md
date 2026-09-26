scopes:
  global: "$RDAPQ_HOME/memory/{engineering-preferences,tooling,lessons,patterns,constraints}.md"
  project: "$RDAPQ_HOME/projects/<id>/{project,architecture,lessons,decisions}.md"
  task: .rdapq/state
promote_if_all: [durable, reusable, material, safe, grounded]
record: {id: M-<id>, scope: "global|project:<id>", status: [ACTIVE, STALE, SUPERSEDED, INVALID], class: [USER_SPECIFIED, OBSERVED, VERIFIED_EXTERNAL, INFERRED], confidence: "0-10", verified: YYYY-MM-DD, supersedes: "id|none", superseded_by: "id|none", fact: str, evidence: str}
secrets: never values; source plus identifier only
on_conflict: trust direct evidence; mark STALE, SUPERSEDED, or INVALID; link ids; do not silent-delete
load: relevant project, then relevant global
memory_cmd: relevant entries, status, conflicts; never print secrets
resume: home, project memory, repo state, last phase, inspect drift, continue at first unverified step
