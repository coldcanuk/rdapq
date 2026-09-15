# RDAP-Q Hard Gates

Hard gates are Boolean and cannot be averaged.

## Scope Gate

PASS only if:

- primary goal achieved;
- applicable success criteria satisfied;
- non-goals respected;
- no material requirement silently dropped.

## Evidence Gate

PASS only if:

- no material correctness claim depends on unsupported inference;
- CRITICAL assumptions are resolved;
- HIGH assumptions affecting architecture, interfaces, security, persistence,
  destructive behaviour, or compatibility are resolved or explicitly accepted.

## Correctness Gate

PASS only if:

- no known in-scope CRITICAL/HIGH defect remains;
- required functional verification passes.

## Integration Gate

PASS only if:

- material integration paths are exercised when reasonably testable;
- compatibility constraints are verified where material.

## Regression Gate

PASS only if:

- relevant existing tests continue to pass;
- no known material regression is introduced.

## Security Gate

PASS only if:

- no known material security issue was introduced;
- secret values were not committed or persisted into RDAP-Q memory/state;
- destructive operations have safeguards;
- security-sensitive requirements were verified proportionally to risk.

## Repository Gate

PASS only if:

- final diff reviewed;
- no unintended files;
- no unresolved merge conflicts;
- repository state understood;
- unrelated user work preserved.

## Memory Gate

PASS only if:

- no secret value was written to memory/state;
- durable memory created by the task meets the promotion test;
- stale/superseded conflicting memory was handled;
- repository-local state was not incorrectly promoted as global truth.

## Quality Gate

PASS when either:

1. target quality is reached and all other gates pass; or
2. documented diminishing-return analysis shows quality has saturated near the
   target, residual risk is acceptable, all other gates pass, and no material
   improvement is economically justified.

## Completion

`COMPLETE = all applicable hard gates PASS`

A numerical score alone never produces COMPLETE.
