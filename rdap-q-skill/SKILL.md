---
name: rdap-q
version: 1.1.0
title: RDAP-Q
description: >
  Vendor-neutral Research-Driven Adaptive Planning with Quality Gates for
  evidence-first software engineering, persistent memory, calibrated scoring,
  iterative improvement, and diminishing-return exit decisions.
invocation: /rdapq
home_env: RDAPQ_HOME
---

# RDAP-Q — Agent Engineering Protocol

RDAP-Q is a vendor-neutral engineering protocol for non-trivial software work.

Its purpose is to produce the best **verified** result justified by the value of
further work.

Do not optimize for a perfect score.

Optimize for:

`evidence -> correctness -> measured quality -> worthwhile improvement -> stop`

## Canonical namespace

- Protocol: **RDAP-Q Agent Engineering Protocol**
- Skill: **RDAP-Q Skill**
- Invocation: **`/rdapq`**
- Environment override: **`RDAPQ_HOME`**
- Global home:
  - Unix/Linux/macOS/bubblewrap: `${HOME}/.rdapq` or `~/.rdapq`
  - Windows: `%USERPROFILE%\.rdapq`
- Repository-local state: `<repo>/.rdapq/state/`
- Global memory: `$RDAPQ_HOME/memory/`
- Project memory: `$RDAPQ_HOME/projects/<project-id>/`

If `RDAPQ_HOME` is set, it overrides the platform default.

## Canonical slash command

Use:

```text
/rdapq <task>
```

Semantic meaning:

> Execute the task using RDAP-Q. Load relevant persistent memory and project
> state, establish evidence, determine the correct phase, execute the adaptive
> quality loop, persist state as work progresses, and terminate according to
> hard gates and diminishing-return logic.

Supported conceptual subcommands:

```text
/rdapq status
/rdapq score
/rdapq audit
/rdapq resume
/rdapq memory
/rdapq research
/rdapq explain
```

Harnesses may implement command transport differently, but the namespace and
semantics remain `/rdapq`.

## Core invariants

1. **Evidence before inference.**
2. **Never invent implementation facts.**
3. Track material facts as:
   `OBSERVED`, `USER_SPECIFIED`, `VERIFIED_EXTERNAL`, `INFERRED`, or `UNKNOWN`.
4. Material implementation decisions must not depend solely on `INFERRED` or
   `UNKNOWN` facts when reasonable verification is available.
5. **Hard gates override numerical scores.**
6. **Scores require evidence.**
7. Work through small verified milestones.
8. Persist project state instead of relying on conversational memory.
9. Persist durable memory only when it is reusable and materially useful.
10. Never persist secret values.
11. Current direct evidence overrides stale memory.
12. Continue while material improvement or risk reduction is worthwhile.
13. Stop when completion gates pass and marginal value has saturated.

Read `core/constitution.md` when resolving methodology ambiguity or drift.

## Quality scale

Score dimensions in 0.5-point increments unless objective measurements justify
finer precision.

| Score | Calibration |
|---:|---|
| 0 | Absent |
| 1–2 | Fundamentally broken |
| 3–4 | Materially deficient |
| 5 | Plausible but insufficiently verified |
| 6 | Functional with meaningful gaps |
| 7 | Solid |
| 8 | Strong production-quality evidence |
| 9 | Exceptional evidence with very low residual uncertainty |
| 10 | Reference quality; rare |

`8.x` is a valid excellent endpoint.

Read `core/scoring.md` whenever calculating or revising a score.

## Default implementation dimensions

| Dimension | Weight |
|---|---:|
| Functional correctness | 25% |
| Requirements coverage | 15% |
| Verification strength | 15% |
| Integration & compatibility | 10% |
| Security & failure handling | 10% |
| Maintainability | 10% |
| Architectural fit | 8% |
| Operability & documentation | 7% |

Weights may change before implementation when justified and recorded. Never
change them later merely to manufacture a passing score.

## Evidence caps

- Material unverified behaviour -> relevant dimension `<= 5.0`.
- Material inferred implementation dependency -> relevant dimension `<= 5.0`.
- Significant known defect -> relevant dimension `<= 4.0`.
- Required verification failure -> hard gate `FAIL`.
- Required testable integration not exercised -> hard gate `FAIL`.

## Risk targets

| Risk | Starting target |
|---|---:|
| LOW | 7.2 |
| MODERATE | 7.6 |
| HIGH | 8.0 |
| CRITICAL | 8.3 |

## Persistent storage model

RDAP-Q uses two different persistence scopes.

### Global RDAP-Q Home

Durable reusable memory and skill configuration:

```text
$RDAPQ_HOME/
├── config.md
├── memory/
├── projects/
├── registry/
└── skills/
```

Default resolution:

```text
1. RDAPQ_HOME
2. platform home directory + /.rdapq
```

### Repository-local RDAP-Q State

Task/build state specific to the current repository:

```text
<repo>/.rdapq/state/
├── scope.md
├── assumptions.md
├── evidence.md
├── research.md
├── plan.md
├── scorecard.md
├── risks.md
├── decisions.md
└── iteration-log.md
```

Do not confuse global memory with project execution state.

Read `core/memory.md` before creating, updating, invalidating, or consuming
durable memory.

## Memory rule

Write global or project memory only when information is:

- durable;
- reusable;
- materially useful.

Never persist:

- passwords;
- API keys;
- access tokens;
- private keys;
- session cookies;
- authentication material;
- raw secret environment values.

Store secret references, never secret values.

Example:

```text
Secret source: pass
Secret identifier: services/foo/api-key
```

## Memory status

Durable memories must support:

- `ACTIVE`
- `STALE`
- `SUPERSEDED`
- `INVALID`

Current repository/runtime evidence always overrides conflicting memory.

## Phase routing

Load only the files needed for the current phase.

| Phase | Read |
|---|---|
| Bootstrap | `playbooks/00-bootstrap.md`, `playbooks/07-git-worktree.md` |
| Discovery | `playbooks/01-discovery.md` |
| Planning | `playbooks/02-planning.md` |
| Architecture | `playbooks/03-architecture.md` |
| Implementation | `playbooks/04-implementation.md` |
| Verification | `playbooks/05-verification.md` |
| Final Audit | `playbooks/06-final-audit.md`, `playbooks/07-git-worktree.md` |

Event-driven references:

| Event | Read |
|---|---|
| Need tool/vendor mapping | `core/capabilities.md` |
| Need memory read/write decision | `core/memory.md` |
| Plan/phase/completion gate | `core/gates.md` |
| Score calculation | `core/scoring.md` |
| Milestone quality decision | `core/scoring.md`, `core/gates.md`, `core/exit-logic.md` |
| Final exit decision | `core/scoring.md`, `core/gates.md`, `core/exit-logic.md` |
| Loop/control ambiguity | `core/controller.md` |

Governance loading must be deterministic by phase/event.

Do not use semantic embeddings as the primary loader for governance rules.
Embeddings may be used for repository/document knowledge.

## Vendor-neutral capability names

Use:

- `SEARCH`
- `FETCH`
- `INSPECT`
- `EXECUTE`
- `EDIT`
- `TEST`
- `VCS`

Map them to the tools available in the current harness.

## Core exit thresholds

**ITERATE** when:

- a resolvable hard gate fails; or
- an in-scope HIGH/CRITICAL defect remains; or
- best credible expected weighted improvement is `>= 0.20`; or
- material risk reduction remains.

**DIMINISHING-RETURN CANDIDATE** when completion gates pass and:

- the last two completed rounds each produced `< 0.15`; or
- best remaining credible improvement is `< 0.20` with no material risk
  reduction.

**STALLED** when a blocking deficiency remains, two consecutive attempts each
produce `< 0.10`, and no materially different corrective action exists.

Read `core/exit-logic.md` before making a terminal decision.

## Terminal states

- `COMPLETE`
- `BLOCKED`
- `STALLED`
- `CONSTRAINT_LIMITED`
- `FAILED_VERIFICATION`

Only after all applicable completion gates pass may the agent state:

**Vibe Code Build complete.**
