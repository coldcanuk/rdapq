phase: GIT
inspect: ["git status --short", "git branch --show-current", "git remote -v", "git branch -a", "git worktree list"]
never_without_explicit_authorization: ["git reset --hard", "git clean -fd", "git push --force"]
forbid: destroying_unrelated_work
worktree_when_requested:
  - use the inspected default branch and remote; do not assume main
  - "git checkout <default> && git pull --ff-only <remote> <default>"
  - "git worktree add -b gb/<slug> ../gb-<slug>-wt"
commit_when_milestone: ["git diff --check", "git add -A", "git diff --cached", "git commit -m 'Milestone X.Y: <summary>'"]
empty_commits: false
push: "git push -u <remote> <branch>"
cleanup_after_merge: ["git worktree remove <path>", "git branch -d <branch>"]
