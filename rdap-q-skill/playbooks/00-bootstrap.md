phase: BOOTSTRAP
load_if: depth is standard or full
if_skipped: do not execute; do not write state
do:
  - resolve home from SKILL.md; if unwritable, record that and use repo state only
  - read memory/index.md; do not bulk-load memory/ or projects/
  - if any memory or state file exceeds SKILL.md memory_caps, compact first: archive overflow, mark STALE/SUPERSEDED out of the load set, rewrite the index
  - if compact would require guessing, emit MEMORY_CAP, stop promoting, continue with repo state only
  - load at most 12 matching full records (project before global, ACTIVE only)
  - inspect root, status, branch, remotes, worktrees, languages, manifests, lockfiles, test, CI
  - do not assume main, a remote, or a package manager
  - create .rdapq/state files on first write only; do not preload every template; do not rewrite unchanged files
inspect:
  - git status --short
  - git branch --show-current
  - git remote -v
  - git branch -a
  - git worktree list
git_mutation: playbooks/07-git-worktree.md # worktree, commit, push, or audit cleanup only
out: [scope, assumptions, evidence, risks]
next: DISCOVERY if included, else IMPLEMENT
forbid: [imagined_repo, destroying_unrelated_work, bulk_memory, diagrams, gzip_memory, narration_writes]
