# Vendor-Neutral Capability Model

RDAP-Q refers to capabilities rather than vendor tool names.

| Capability | Purpose |
|---|---|
| `SEARCH` | Discover external information |
| `FETCH` | Retrieve authoritative documentation/specifications/source |
| `INSPECT` | Inspect repository, environment, logs, history, configuration |
| `EXECUTE` | Run commands, code, scripts, experiments |
| `EDIT` | Modify files |
| `TEST` | Execute verification |
| `VCS` | Inspect/modify version control |

The current harness maps its tools onto these capabilities.

If a capability is unavailable:

1. record the constraint;
2. determine whether a hard gate is affected;
3. use a valid alternative if available;
4. never fabricate missing evidence;
5. mark affected claims appropriately.
