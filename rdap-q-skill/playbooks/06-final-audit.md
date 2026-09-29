phase: AUDIT
load_if: depth is full, or the command is /rdapq audit
if_skipped: do not run this checklist; VERIFY gates are enough
stance: disprove completion
ask: [misread_requirement, unexercised_path, untested_failure, inferred_claim, stale_memory, false_dependency, regression, secrets, diff_matches_scope]
memory: [candidates, promotion_test, write_approved_only, no_secrets, under_cap]
report: [Q, oracles, gates, defects, unknowns, round, depth]
do_not: fold self-scores into Q
complete_only_if: all_applicable_gates_pass AND Q is not UNMEASURED
fail_memory_gate_if: [secrets_stored, over_cap_uncompacted, index_missing_when_records_exist, bulk_memory_loaded, state_promoted_as_global]
say: "Vibe Code Build complete."
