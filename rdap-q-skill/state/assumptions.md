# Assumption Ledger

Status values:

- `OBSERVED`
- `USER_SPECIFIED`
- `VERIFIED_EXTERNAL`
- `INFERRED`
- `UNKNOWN`
- `RESOLVED`

| ID | Statement | Status | Materiality | Evidence IDs | Resolution / Next Action |
|---|---|---|---|---|---|
| A-001 | TBD | UNKNOWN | HIGH | — | Inspect / research |

No CRITICAL assumption may remain UNKNOWN before implementation.

HIGH assumptions affecting architecture, interfaces, security, persistence,
compatibility, or destructive behaviour must be resolved before dependent work.
