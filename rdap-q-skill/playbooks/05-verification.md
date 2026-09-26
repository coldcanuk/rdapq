phase: VERIFY
use_real_stack_only: [unit, integration, e2e, build, lint, format, types, static_analysis, security, race, migration, perf, manual]
on_fail: [record, severity, cause, return_to_IMPLEMENT, rerun]
if_cannot_run: "NOT VERIFIED — ENVIRONMENTAL CONSTRAINT"
forbid: [invented_commands, averaging_a_failure_into_the_score]
each_result: evidence_id
