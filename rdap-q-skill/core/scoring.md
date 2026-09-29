# Q is oracle-only. Self-scores do not enter Q and do not exit.
# weights, anchors, caps, risk floors: SKILL.md
formula_Q: UNMEASURED if every oracle is null; else sum(weight_i * observed_i) / sum(weight_i) over non-null oracles
observed: {fail: 0, partial: 5, pass: 10, not_run: null}
oracles:
  runtime: {weight: 35, pass: every required command exit 0 with evidence_id, fail: any required command failed}
  repo: {weight: 25, pass: inspected diff matches stated files, fail: extra or missing files}
  external: {weight: 15, pass: material external claim is VERIFIED_EXTERNAL, fail: material external claim still INFERRED}
  claims: {weight: 15, value: round(10 * verified_material_claims / total_material_claims), null_if: total is 0}
  repro: {weight: 10, pass: reported failure reproduced or regression command passed, fail: repro required and missing, null_if: no defect in scope}
null_oracle_excluded: true
if_all_null: UNMEASURED
self_card:
  enters_Q: false
  enters_exit: false
  label_source: model
  write: only on /rdapq score, never on each output
  dimensions: [correctness, coverage, verification, integration, security, maintainability, architecture, operability]
report: [Q, oracles, gates, critical, high, unknowns, round, depth, decision]
row: [oracle, weight, observed, evidence_ids, gap]
forbid: [looks_good, self_score_as_gate, inventing_a_pass, unrun_command_as_pass]
