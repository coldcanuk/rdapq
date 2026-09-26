phase: IMPLEMENT
loop: [observe, implement, verify, review]
observe: [affected_code, interfaces, versions, nearby_tests, memory_if_it_affects_the_edit]
implement: [smallest_change, no_driveby_refactor, preserve_behavior_unless_intended, no_secrets, no_speculative_abstraction]
verify: planned checks only; an unrun test is not a pass
review: [status, diff, whitespace, generated, debug, secrets, unrelated, todos]
close_when: [tasks_done, definition_of_done, verification, diff_reviewed, state_updated, gates]
vcs: commit only a coherent milestone
