# Planning Playbook

Goal: produce an evidence-grounded executable plan without forcing speculative
details.

Structure:

`Phases -> Milestones -> Tasks`

## Every task records

- Task ID;
- Milestone ID;
- objective;
- affected files/components when known;
- prerequisite evidence;
- action;
- commands/code when established;
- verification;
- expected observable outcome;
- dependencies.

## Exact command rule

Provide exact commands only after environment evidence establishes them.

Otherwise use:

```text
TBD-EVIDENCE: <fact required before command can be specified>
```

Never hallucinate commands to satisfy the template.

## Plan quality dimensions

| Dimension | Weight |
|---|---:|
| Requirements coverage | 15% |
| Repository/evidence grounding | 15% |
| Architecture correctness | 15% |
| Task completeness | 10% |
| Dependency/order correctness | 10% |
| Verification design | 15% |
| Risk coverage | 10% |
| Reproducibility | 5% |
| Git/execution safety | 5% |

## Plan hard gates

Do not execute while:

- success criteria are materially ambiguous;
- a CRITICAL assumption remains unresolved;
- plan depends on imagined repository structure;
- a material task lacks verification;
- destructive action lacks safeguards;
- known dependency ordering is wrong.

Write the approved plan to `<repo>/.rdapq/state/plan.md`.
