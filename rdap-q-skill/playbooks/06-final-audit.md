# Final Audit Playbook

The final audit is adversarial.

Attempt to disprove that the work is complete.

Ask:

- Which requirement may be misunderstood?
- Which path was never exercised?
- Which failure path is untested?
- Which claim still depends on inference?
- Which memory could now be stale?
- Which dependency assumption may be false?
- What could regress?
- What happens with malformed/boundary input?
- What happens when dependencies fail?
- Are errors observable?
- Are secrets protected?
- Was any secret accidentally written to RDAP-Q state/memory?
- Could concurrency introduce races?
- Did interfaces change unintentionally?
- Was an unnecessary dependency added?
- Is unused/debug/generated code present?
- Does documentation match reality?
- Is the full diff consistent with scope?

## Memory finalization

Before completion:

1. identify durable reusable memory candidates;
2. apply the memory promotion test;
3. write only approved candidates;
4. invalidate/supersede stale memories;
5. never persist secret values.

## Final measurements

Produce:

- Quality Score;
- Confidence Score;
- Evidence Coverage;
- hard-gate results;
- unresolved defects;
- material unknowns;
- score history;
- best remaining improvement;
- AQC.

Use `core/exit-logic.md`.

Only `COMPLETE` permits:

**Vibe Code Build complete.**
