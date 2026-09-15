# Architecture Playbook

Use when interfaces, boundaries, persistence, security, concurrency, or
integration design materially affect correctness.

Document in `decisions.md`:

- components changed;
- responsibilities;
- interfaces;
- data flow;
- persistence model;
- compatibility;
- error/failure model;
- security boundaries;
- runtime/deployment implications;
- rejected alternatives when material.

Decision record:

```text
Decision:
Evidence:
Alternatives:
Why selected:
Risks:
Verification:
```

Architecture must fit the current system unless the task explicitly changes it.

Avoid unrelated broad refactors.

Promote stable architecture facts to project memory only after they are verified
and clearly durable.
