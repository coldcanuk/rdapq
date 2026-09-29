# Q is oracle-only. Self-scores do not enter Q and do not exit.
# required oracles per risk: SKILL.md required_oracles
formula_Q: UNMEASURED if every oracle is null; else sum(weight_i * observed_i) / sum(weight_i) over non-null oracles
Q_role: reported number only; completion uses required_oracles, not a Q threshold
observed: {fail: 0, partial: 5, pass: 10, not_run: null}
oracles:
  runtime:
    weight: 35
    pass: every required command exits 0 with an evidence_id, and touches_change holds
    partial: every required command exits 0, but no executed check touches the change
    fail: any required command failed
  repo:
    weight: 25
    pass: inspected diff touches exactly the stated files
    partial: extra files are only generated or lockfile output named in the diff review
    fail: unexplained extra files, or a stated file is missing from the diff
  external:
    weight: 15
    pass: every material external claim is VERIFIED_EXTERNAL
    partial: some verified; the rest are INFERRED and off the changed path
    fail: a material external claim on the changed path is still INFERRED
    null_if: no material external claim
  claims:
    weight: 15
    value: round(10 * verified_material_claims / total_material_claims)
    null_if: total is 0
  repro:
    weight: 10
    pass: the failure reproduced before the fix and the same command passes after it
    partial: only one of before or after was run
    fail: a defect is in scope and neither was run
    null_if: no defect in scope
touches_change: at least one executed check names a changed file, or a test that imports or calls changed code
oracle_id: command plus first failing test id or assertion; exit code when the command names none
same_oracle: equal oracle_id on two rounds
required_pass: each required oracle is pass, or null by its own null_if; partial does not satisfy a requirement
any_fail_blocks: a non-null oracle at fail blocks COMPLETE even when not required
null_oracle_excluded: true
if_all_null: UNMEASURED
self_card:
  enters_Q: false
  enters_exit: false
  label_source: model
  write: only on /rdapq score, never on each output
  dimensions: [correctness, coverage, verification, integration, security, maintainability, architecture, operability]
report: [Q, oracles, required, gates, critical, high, unknowns, round, depth, decision]
row: [oracle, weight, observed, evidence_ids, gap]
forbid: [looks_good, self_score_as_gate, inventing_a_pass, unrun_command_as_pass]
