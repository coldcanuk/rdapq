phase: BOOTSTRAP
do:
  - resolve home from SKILL.md; if unwritable, record that and use repo state only
  - read task-relevant project memory, then global memory; do not bulk-load
  - inspect root, status, branch, remotes, worktrees, languages, manifests, lockfiles, test, CI
  - do not assume main, a remote, or a package manager
  - create .rdapq/state files on first write; do not preload every template
inspect:
  - git status --short
  - git branch --show-current
  - git remote -v
  - git branch -a
  - git worktree list
git_mutation: playbooks/07-git-worktree.md # worktree, commit, push, or audit cleanup only
out: [scope, assumptions, evidence, risks, iteration-log]
next: DISCOVERY
forbid: [imagined_repo, destroying_unrelated_work]
