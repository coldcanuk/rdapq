# RDAP-Q Memory Protocol

RDAP-Q uses durable Markdown memory outside conversational context.

Memory is intentionally separate from repository-local execution state.

## Storage scopes

### Global memory

```text
$RDAPQ_HOME/memory/
```

Use for durable cross-project information such as:

- engineering preferences;
- reusable tooling conventions;
- recurring constraints;
- validated reusable lessons;
- general patterns.

Recommended files:

```text
memory/
├── engineering-preferences.md
├── tooling.md
├── lessons.md
├── patterns.md
└── constraints.md
```

### Project memory

```text
$RDAPQ_HOME/projects/<project-id>/
```

Use for durable project-specific knowledge such as:

- stable architecture facts;
- long-lived project constraints;
- reusable project lessons;
- durable decisions.

Recommended files:

```text
projects/<project-id>/
├── project.md
├── architecture.md
├── lessons.md
└── decisions.md
```

### Repository-local state

```text
<repo>/.rdapq/state/
```

Use for active task/build state:

- current plan;
- current assumptions;
- test evidence;
- current risks;
- score history;
- transient blockers;
- current iteration details.

Do not promote transient state into durable memory without reason.

## Memory promotion test

Persist a fact to durable memory only if all are true:

1. **Durable** — likely to remain useful beyond the current turn/build.
2. **Reusable** — likely to affect future engineering decisions.
3. **Material** — important enough to change behaviour, quality, cost, or risk.
4. **Safe** — does not contain secret values.
5. **Grounded** — status and provenance can be recorded.

If any condition fails, keep it in project state or do not persist it.

## Memory record format

Use:

```markdown
## M-<ID> — <title>

**Scope:** global | project:<project-id>
**Status:** ACTIVE | STALE | SUPERSEDED | INVALID
**Truth class:** USER_SPECIFIED | OBSERVED | VERIFIED_EXTERNAL | INFERRED
**Confidence:** <0-10>
**Last verified:** YYYY-MM-DD
**Supersedes:** <ID or none>
**Superseded by:** <ID or none>

<concise reusable fact>

**Evidence / Origin:** <evidence IDs, source, or explicit user statement>
```

Do not create false precision in confidence. Use integer or 0.5 increments.

## Secret rule

Never persist:

- passwords;
- API keys;
- bearer tokens;
- private keys;
- session cookies;
- recovery codes;
- secret environment values;
- authentication material.

Allowed:

```text
Secret source: pass
Secret identifier: services/foo/api-key
```

Not allowed:

```text
API_KEY=actual-secret-value
```

## Memory invalidation

Memory is not eternal truth.

When current evidence conflicts with memory:

1. trust current direct evidence for actual state;
2. identify the conflicting memory;
3. mark it `STALE`, `SUPERSEDED`, or `INVALID`;
4. create a replacement memory if the new fact is durable/reusable/material;
5. link old/new IDs.

## Status meanings

- `ACTIVE` — current and usable.
- `STALE` — may no longer be true; requires revalidation.
- `SUPERSEDED` — replaced by a newer memory.
- `INVALID` — shown to be false or inappropriate.

Never silently delete contradictory history when supersession is useful.

## Memory loading

Load only memory relevant to the current task.

Recommended order:

1. relevant project memory;
2. relevant global memory;
3. ignore unrelated memory.

Do not bulk-load all memory merely because it exists.

## `/rdapq memory`

This command should:

- show the relevant memory used by the current task;
- show statuses;
- expose conflicts or stale entries;
- avoid printing secret values even if improperly present.

It may also support a harness-specific mechanism to add, revise, supersede, or
invalidate memory.

## `/rdapq resume`

Resume should:

1. resolve RDAPQ_HOME;
2. load relevant project memory;
3. load `<repo>/.rdapq/state/`;
4. identify the last stable phase/milestone;
5. inspect current repository state;
6. detect drift since the last run;
7. update stale assumptions/state;
8. continue from the first unverified or invalidated step.

Never resume blindly from stale conversational context.
