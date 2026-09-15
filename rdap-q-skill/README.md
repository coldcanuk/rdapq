# RDAP-Q Skill v1.1.0

**Research-Driven Adaptive Planning with Quality Gates**

RDAP-Q is a portable agent-engineering protocol for evidence-first software
development.

It uses:

- deterministic phase loading;
- persistent repository state;
- durable Markdown memory;
- evidence-linked scoring;
- hard quality gates;
- diminishing-return exit logic;
- vendor-neutral capability names;
- a collision-resistant `/rdapq` command namespace.

## Canonical namespace

```text
Protocol:          RDAP-Q Agent Engineering Protocol
Skill:             RDAP-Q Skill
Slash command:     /rdapq
Environment:       RDAPQ_HOME
Unix home:         ~/.rdapq
Windows home:      %USERPROFILE%\.rdapq
Repository state:  <repo>/.rdapq/state/
```

## RDAPQ_HOME

Resolution order:

```text
1. Explicit RDAPQ_HOME
2. Windows: %USERPROFILE%\.rdapq
3. Unix-like: ${HOME}/.rdapq
```

This works cleanly with normal hosts, containers, CI, and bubblewrap sandboxes
because `RDAPQ_HOME` may be redirected explicitly.

## Storage model

Global:

```text
$RDAPQ_HOME/
├── config.md
├── memory/
├── projects/
├── registry/
└── skills/
```

Repository-local:

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

## Memory versus state

**State** is transient project/build working memory.

**Memory** is durable reusable knowledge.

Do not promote something to durable memory unless it is:

- durable;
- reusable;
- material;
- safe;
- grounded.

Never persist secret values.

## Slash commands

```text
/rdapq <task>
/rdapq status
/rdapq score
/rdapq audit
/rdapq resume
/rdapq memory
/rdapq research
/rdapq explain
```

## Package layout

```text
rdap-q-skill/
├── SKILL.md
├── README.md
├── manifest.json
├── core/
│   ├── constitution.md
│   ├── controller.md
│   ├── capabilities.md
│   ├── memory.md
│   ├── scoring.md
│   ├── gates.md
│   └── exit-logic.md
├── playbooks/
│   ├── 00-bootstrap.md
│   ├── 01-discovery.md
│   ├── 02-planning.md
│   ├── 03-architecture.md
│   ├── 04-implementation.md
│   ├── 05-verification.md
│   ├── 06-final-audit.md
│   └── 07-git-worktree.md
├── state/
│   ├── README.md
│   ├── scope.md
│   ├── assumptions.md
│   ├── evidence.md
│   ├── research.md
│   ├── plan.md
│   ├── scorecard.md
│   ├── risks.md
│   ├── decisions.md
│   └── iteration-log.md
├── memory/
│   ├── README.md
│   ├── engineering-preferences.md
│   ├── tooling.md
│   ├── lessons.md
│   ├── patterns.md
│   └── constraints.md
├── projects/
│   ├── project.md
│   ├── architecture.md
│   ├── lessons.md
│   └── decisions.md
├── templates/
│   ├── task.md
│   ├── milestone.md
│   └── final-report.md
└── diagrams/
    ├── rdapq-control-loop.mmd
    ├── rdapq-selective-loading.mmd
    ├── rdapq-score-decision.mmd
    ├── rdapq-evidence-flow.mmd
    ├── rdapq-memory-model.mmd
    └── rdapq-command-flow.mmd
```

## Loader recommendation

Always load only `SKILL.md`.

Load phase playbooks and event references deterministically as needed.

Do not use embeddings as the primary retrieval mechanism for governance rules.

Embeddings remain useful for source code, docs, issues, logs, and semantic
repository knowledge.
