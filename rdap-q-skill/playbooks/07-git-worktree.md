# Git / Worktree Playbook

Use Git evidence, not assumptions.

Inspect:

```bash
git status --short
git branch --show-current
git remote -v
git branch -a
git worktree list
```

Determine actual default branch, remote, cleanliness, and unrelated local changes.

Never destroy unrelated user work.

## Worktree example

Only after verifying `main` and `origin` are correct:

```bash
git checkout main
git pull --ff-only origin main
git status --short

FEATURE_SLUG="<short-descriptive-slug>"
BRANCH_NAME="gb/${FEATURE_SLUG}"
WORKTREE_PATH="../gb-${FEATURE_SLUG}-wt"

git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH"
cd "$WORKTREE_PATH"

pwd
git status
git branch --show-current
```

Adapt names to repository evidence.

## Milestone commit

```bash
git status --short
git diff --check
git diff

git add -A
git diff --cached

git commit -m "Milestone X.Y: <concise description>"
```

Do not create empty procedural commits.

## Final push

```bash
git push -u <remote> "$BRANCH_NAME"
```

Prefer PR workflow when repository governance expects it.

## Cleanup

After successful integration:

```bash
git worktree list
git worktree remove "$WORKTREE_PATH"
git branch -d "$BRANCH_NAME"
git status
git worktree list
```

Branch deletion is optional when policy differs.

Do not automatically use:

```text
git reset --hard
git clean -fd
git push --force
```

without explicit justification and authorization.
