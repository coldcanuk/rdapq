# numeric thresholds: SKILL.md exit
effort: {1: trivial, 2: small, 3: moderate, 5: substantial, 8: major}
max_rounds: 3
round_1: implement and verify
round_2: one fix only if a gate failed with a new oracle evidence_id
round_3: only if round 2 produced a different failing oracle
same_oracle_twice: STALLED
do_not_iterate: [self_score_gap, prose_polish, dQ_of_self_scores, same_failure_repeated]
iterate_if: [gate_fail_with_new_oracle, high_or_critical_with_repro]
round_cap:
  ambiguous_success: UNCLEAR_TASK
  no_command_ran: MISSING_TEST
  else: STALLED
Q_unmeasured_does_not_complete: true
oracle_Q_floor: SKILL.md risk_target_oracle_Q
blocked_if_missing: [user_decision, credentials, environment, external_system, spec, permission, hardware]
constraint_limited: external_cap; not automatically complete
self_score: never an exit input
