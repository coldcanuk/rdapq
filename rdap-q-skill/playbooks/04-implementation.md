# Implementation Playbook

Execute milestone by milestone using:

`OBSERVE -> IMPLEMENT -> VERIFY -> REVIEW`

## Observe

Immediately before editing:

- inspect affected code;
- confirm interfaces;
- confirm dependency/version behaviour;
- inspect nearby tests/conventions;
- revalidate memory if it influences implementation.

## Implement

- make the smallest coherent change;
- avoid unrelated refactors;
- preserve behaviour unless intentionally changed;
- never expose or persist secret values;
- avoid speculative abstraction.

## Existing files

Do not blindly overwrite.

Inspect context first, apply the smallest coherent edit, then review the diff.

## Verify

Run planned verification.

Do not report unexecuted tests as passing.

## Review

Inspect:

- repository status;
- working diff;
- whitespace/error checks;
- generated/untracked files;
- debug output;
- secrets;
- unrelated edits;
- unfinished TODOs.

## Milestone closure

Close only when:

- all tasks complete;
- Definition of Done passes;
- verification passes;
- diff reviewed;
- state updated;
- score/gates evaluated.

Commit when version control is used and the milestone is coherent.
