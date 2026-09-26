# numeric thresholds: SKILL.md exit
effort: {1: trivial, 2: small, 3: moderate, 5: substantial, 8: major}
candidate: [severity, dQ, risk, effort, confidence, blocker]
iterate_if: [gate_fail_with_fix, high_or_critical_defect, "dQ>=0.20", material_risk_reduction]
diminish_if: gates_pass AND (last_two_dQ<0.15 OR best_remaining_dQ<0.20_and_no_risk_reduction)
stall_if: [deficiency_remains, two_tries_dQ<0.10, no_new_action]
blocked_if_missing: [user_decision, credentials, environment, external_system, spec, permission, hardware]
constraint_limited: external_cap; not automatically complete
aqc: late ceiling estimate; never excuses a failed gate
