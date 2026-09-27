phase: DISCOVERY
load_if: depth is standard or full
if_skipped: do not execute; do not write research.md
sources: [local_source, project_config, upstream_docs, upstream_source, experiment, secondary]
scope: only unknowns that can change the diff
per_assumption: [record, materiality, needed_evidence, investigate, status]
block_exit:
  critical_unknown: true
  high_unresolved_if: [architecture, interfaces, security, persistence, compatibility, destructive]
memory: may suggest questions; never replaces evidence; candidates stay unpromoted
out: [questions, resolved, unresolved, evidence_ids]
next: PLAN if depth is full, else IMPLEMENT
