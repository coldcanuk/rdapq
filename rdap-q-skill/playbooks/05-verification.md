phase: VERIFY
use_real_stack_only: [unit, integration, e2e, build, lint, format, types, static_analysis, security, race, migration, perf, manual]
on_fail: [record evidence_id, severity, cause, return_to_IMPLEMENT if rounds remain and the oracle is new]
if_cannot_run: "NOT VERIFIED — ENVIRONMENTAL CONSTRAINT"
if_unrun: Q stays UNMEASURED; do not invent a pass; do not write a self-score
score: oracle row only, see core/scoring.md
forbid: [invented_commands, averaging_a_failure_into_the_score, self_score_as_Q]
each_result: evidence_id
persist: on gate transition or terminal, not on a repeated identical result
