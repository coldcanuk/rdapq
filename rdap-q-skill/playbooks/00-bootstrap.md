phase: BOOTSTRAP
do:
  - resolve home from SKILL.md; if unwritable, record that and use repo state only
  - read task-relevant project memory, then global memory; do not bulk-load
  - inspect root, status, branch, remotes, worktrees, languages, manifests, lockfiles, test, CI
  - do not assume main, a remote, or a package manager
  - create .rdapq/state files on first write; do not preload every template
out: [scope, assumptions, evidence, risks, iteration-log]
next: DISCOVERY
forbid: [imagined_repo, destroying_unrelated_work]
