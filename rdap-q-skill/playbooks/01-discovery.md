# Discovery Playbook

Goal: resolve material uncertainty before it becomes implementation debt.

Research must be question-driven.

## Source preference

1. local source/tests;
2. project configuration/history;
3. authoritative upstream documentation/specification;
4. upstream source;
5. controlled experiment;
6. secondary sources if necessary.

## Assumption handling

For every material uncertainty:

1. record assumption;
2. assign materiality;
3. identify needed evidence;
4. investigate;
5. update status.

No CRITICAL assumption may remain unknown at Discovery exit.

HIGH assumptions affecting architecture, interfaces, security, persistence,
compatibility, or destructive behaviour must be resolved before dependent work.

## Durable-memory check

During discovery, existing project/global memories may help generate questions,
but they never replace current evidence.

When discovery produces a durable reusable fact, mark it as a **memory candidate**.
Do not promote it yet unless its durability is established.

## Output

Update `research.md` with:

- questions;
- repository findings;
- architecture findings;
- external findings;
- experiments;
- resolved/unresolved questions;
- implications;
- evidence IDs.

Proceed when material uncertainty is sufficiently resolved for planning.
