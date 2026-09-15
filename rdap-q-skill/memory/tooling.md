# Tooling Memory

Use records in this format:

```markdown
## M-<ID> — <title>

**Scope:** global
**Status:** ACTIVE | STALE | SUPERSEDED | INVALID
**Truth class:** USER_SPECIFIED | OBSERVED | VERIFIED_EXTERNAL | INFERRED
**Confidence:** <0-10>
**Last verified:** YYYY-MM-DD
**Supersedes:** none
**Superseded by:** none

<concise durable reusable fact>

**Evidence / Origin:** <source or evidence IDs>
```

Never store secret values.
