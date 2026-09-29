complete: all_applicable_pass AND Q is not UNMEASURED AND every required oracle passes
score_never_completes: true
self_score_never_completes: true
gates:
  scope: [goal, success_criteria, non_goals, no_silent_drop]
  evidence: [no_unsupported_inference, critical_assumptions_resolved, high_assumptions_resolved_or_accepted]
  correctness: [no_open_critical_or_high, required_verification_pass]
  integration: [material_paths_exercised, compatibility_checked]
  regression: [existing_tests_pass, no_known_material_regression]
  security: [no_new_material_issue, no_secrets_stored, destructive_safeguards, risk_proportional_checks]
  repository: [diff_reviewed, no_unintended_files, no_conflicts, state_understood, unrelated_work_kept]
  memory: [no_secrets, promotion_test, stale_handled, state_not_promoted_as_global, under_cap, index_current]
  quality: required_oracles_pass_and_no_oracle_fails
not_applicable:
  memory_not_loaded: [promotion_test, stale_handled, under_cap, index_current] # BOOTSTRAP skipped and nothing promoted
