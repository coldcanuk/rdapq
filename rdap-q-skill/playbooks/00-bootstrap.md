# Bootstrap Playbook

Goal: establish actual repository, environment, RDAP-Q home, memory, and state
before detailed planning.

## Resolve RDAP-Q home

Use:

```text
1. RDAPQ_HOME if set
2. Windows -> %USERPROFILE%\.rdapq
3. Unix-like -> ${HOME}/.rdapq
```

Verify writability when persistence is expected.

## Load relevant durable memory

Read only memory relevant to this project/task:

- `$RDAPQ_HOME/projects/<project-id>/`
- `$RDAPQ_HOME/memory/`

Do not bulk-load unrelated memories.

## Repository inspection

Determine as applicable:

- repository root;
- working-tree status;
- current/default branch;
- remotes;
- worktrees;
- languages;
- runtimes;
- dependency manifests;
- lock files;
- package manager;
- build/test/static-analysis systems;
- CI/deployment/container configuration;
- relevant architecture;
- similar existing implementation.

## Initialize local state

Create if absent:

```text
<repo>/.rdapq/state/
```

using the templates under `state/`.

## Rules

- Do not plan against an imagined repository.
- Do not destroy unrelated user changes.
- Do not assume default branch `main`.
- Do not assume a remote exists.
- Do not assume a package manager by ecosystem.
- Record material findings as evidence.
- Revalidate durable memory when direct evidence conflicts.

## Outputs

Update:

- `scope.md`
- `assumptions.md`
- `evidence.md`
- `risks.md`
- `iteration-log.md`

Then enter Discovery.
