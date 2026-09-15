# RDAP-Q Controller

Read this file when orchestrating the whole loop or when the next state is
ambiguous.

## Lifecycle

```text
BOOTSTRAP
  -> DISCOVERY
  -> PLAN
  -> ARCHITECTURE?      optional when justified
  -> IMPLEMENT
  -> VERIFY
  -> AUDIT
  -> { ITERATE | COMPLETE | BLOCKED | STALLED |
       CONSTRAINT_LIMITED | FAILED_VERIFICATION }
```

## Controller algorithm

```text
1. Resolve RDAPQ_HOME.
2. Load SKILL.md.
3. Resolve repository root.
4. Load relevant global/project memory.
5. Load repository-local .rdapq/state if present.
6. Determine current phase.
7. Load only the current phase playbook.
8. Observe repository/environment before acting.
9. Update material facts, assumptions, evidence, risks, and decisions.
10. Execute the current phase objective.
11. On scoring/gating/exit events, load only the required core references.
12. At milestone close:
      verify -> review -> score -> gate -> decide -> persist.
13. If new evidence invalidates the plan:
      re-enter PLAN.
14. If worthwhile corrective/improvement action exists:
      iterate.
15. If completion gates pass and diminishing returns are reached:
      final audit -> integration/cleanup -> COMPLETE.
16. If progress cannot continue:
      emit the accurate non-complete terminal state.
17. Promote only durable/reusable project lessons to RDAP-Q memory.
```

## RDAPQ_HOME resolution

```text
IF RDAPQ_HOME is explicitly set:
    use it
ELSE IF platform is Windows:
    use %USERPROFILE%\.rdapq
ELSE:
    use ${HOME}/.rdapq
```

If the resolved path is not writable:

1. record the constraint;
2. continue with repository-local state when possible;
3. do not pretend global persistence succeeded.

## Fact precedence

When sources disagree:

1. explicit current user instruction for intended behaviour;
2. current direct repository/runtime evidence for actual behaviour;
3. repository-local RDAP-Q state;
4. current project memory;
5. current global memory;
6. authoritative external source applicable to the installed version;
7. inference.

Important nuance:

- user instruction defines desired behaviour;
- direct observation defines current factual behaviour.

Do not use an old memory to override current observed implementation facts.

## Replanning trigger

Return to Planning when new evidence materially changes:

- scope;
- architecture;
- dependencies;
- sequencing;
- risk;
- verification design;
- success-criteria interpretation.

Do not execute a plan known to be invalid.

## Context budget

Prefer:

- concise state;
- targeted memory;
- targeted file reads;

over:

- replaying historical conversation;
- loading the complete skill;
- loading irrelevant project history.

Governance retrieval is deterministic.

Repository/document retrieval may use semantic retrieval.
