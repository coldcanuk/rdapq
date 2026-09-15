# Verification Playbook

Goal: establish evidence that the implemented system satisfies requirements
without material regression.

Use only verification supported by the real stack:

- unit tests;
- integration tests;
- end-to-end tests;
- build;
- lint;
- formatter/check mode;
- type checking;
- static analysis;
- security/dependency checks;
- race/concurrency checks;
- migration validation;
- performance checks;
- controlled manual/runtime verification.

Do not invent ceremonial commands.

Each important result gets an evidence ID.

If verification fails:

1. record evidence;
2. classify severity;
3. identify root cause;
4. return to implementation;
5. re-run affected verification;
6. do not average failure into a score.

If a required check cannot run:

```text
NOT VERIFIED — ENVIRONMENTAL CONSTRAINT
```

Then evaluate the affected hard gate honestly.
