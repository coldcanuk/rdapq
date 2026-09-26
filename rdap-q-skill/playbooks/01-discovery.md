phase: DISCOVERY
sources: [local_source, project_config, upstream_docs, upstream_source, experiment, secondary]
per_assumption: [record, materiality, needed_evidence, investigate, status]
block_exit:
  critical_unknown: true
  high_unresolved_if: [architecture, interfaces, security, persistence, compatibility, destructive]
memory: may suggest questions; never replaces evidence; candidates stay unpromoted
out: [questions, repo, architecture, external, experiments, resolved, unresolved, implications, evidence_ids]
next: PLAN
