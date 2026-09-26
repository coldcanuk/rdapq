phase: AUDIT
stance: disprove completion
ask: [misread_requirement, unexercised_path, untested_failure, inferred_claim, stale_memory, false_dependency, regression, malformed_input, dependency_down, observable_errors, secrets, races, unintended_interface_change, extra_dependency, debug_or_unused, docs_match, diff_matches_scope, memory_over_cap, index_stale]
memory: [candidates, promotion_test, write_approved_only, invalidate_stale, no_secrets, under_cap, index_current]
report: [quality, confidence, coverage, gates, defects, unknowns, history, best_remaining, aqc]
complete_only_if: all_applicable_gates_pass
fail_memory_gate_if: [secrets_stored, over_cap_uncompacted, index_missing_when_records_exist, bulk_memory_loaded, state_promoted_as_global]
say: "Vibe Code Build complete."
