phase: IMPLEMENT
loop: [observe, implement, verify]
rounds: max 3, see core/exit-logic.md
observe: [affected_code, interfaces, versions, nearby_tests]
implement: [smallest_change, no_driveby_refactor, preserve_behavior_unless_intended, no_secrets, no_speculative_abstraction]
verify: planned checks only; an unrun test is not a pass and is not a score of 5
review: [status, diff, secrets, unrelated]
state_write: checkpoint only, see SKILL.md persist
close_when: [tasks_done, verification_or_explicit_UNMEASURED, diff_reviewed, gates]
vcs: commit only a coherent milestone
