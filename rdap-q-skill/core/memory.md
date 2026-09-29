scopes:
  global: "$RDAPQ_HOME/memory/{engineering-preferences,tooling,lessons,patterns,constraints}.md"
  project: "$RDAPQ_HOME/projects/<id>/{project,architecture,lessons,decisions}.md"
  task: .rdapq/state
index: "$RDAPQ_HOME/memory/index.md"
load: index_then_hits
promote_if_all: [durable, reusable, material, safe, grounded]
record: {id: M-<id>, scope: "global|project:<id>", status: [ACTIVE, STALE, SUPERSEDED, INVALID], class: [USER_SPECIFIED, OBSERVED, VERIFIED_EXTERNAL, INFERRED], confidence: "0-10", verified: YYYY-MM-DD, supersedes: "id|none", superseded_by: "id|none", fact: str, evidence: str}
index_row: {id: M-<id>, kind: str, scope: "global|project:<id>", status: str, class: str, one_line: str}
secrets: never values; source plus identifier only
on_conflict: trust direct evidence; mark STALE, SUPERSEDED, or INVALID; link ids; do not silent-delete
load_order: relevant index rows, then matching full records, project before global
memory_cmd: relevant ACTIVE entries, status, conflicts; never print secrets; never dump the store
resume: home, index, compact if over cap, load hits, repo state, depth, last phase, inspect drift, continue at first unverified step
caps:
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
refuse:
  - bulk_read of memory/ or projects/
  - diagrams (.mmd)
  - manifest.json
  - playbooks other than current included phase
  - gzip, base64, or one-line tarball encodings
  - rewriting state on every output
write_forbid:
  - secret values
  - command output, diffs, logs, chat
  - INFERRED when verification was possible
  - duplicate of an ACTIVE one_line
  - fact longer than fact_chars
  - evidence longer than evidence_chars
  - promoting .rdapq/state into global memory
  - self-scores stored as measured Q
on_cap:
  stop_append: true
  compact: [STALE, SUPERSEDED, INVALID]
  overflow: archive to memory/archive/YYYY-MM.md
  say: "MEMORY_CAP — compacted, not loaded"
over_cap_without_safe_compact: stop promoting; emit MEMORY_CAP; do not keep appending
