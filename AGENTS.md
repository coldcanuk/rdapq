# RDAP-Q Agent Instructions (AGENTS.md)
<!-- Compatible with OpenAI Codex, xAI Grok, and Universal Agent Frameworks -->

This workspace supports and adheres to the **RDAP-Q Agent Engineering Protocol** (v1.1.0).

## Core Directive

When a user executes `/rdapq <task>` or requests evidence-backed software development, load and follow:
- **Skill Entrypoint**: `rdap-q-skill/SKILL.md`
- **Protocol Manifest**: `manifest.json`

## Invariants

1. **Evidence Before Inference**: Never invent implementation facts. Classify facts as `OBSERVED`, `USER_SPECIFIED`, `VERIFIED_EXTERNAL`, `INFERRED`, or `UNKNOWN`.
2. **Hard Gates Override Numbers**: No task is marked complete without passing required verification gates.
3. **Calibrated Scoring (0–10)**: Score implementation dimensions using calibrated evidence. An `8.x` represents verified production-ready code.
4. **Persistent Project State**: Maintain and update `.rdapq/state/` files (`scope.md`, `evidence.md`, `plan.md`, `scorecard.md`, `iteration-log.md`).
5. **Durable Reusable Memory**: Persist non-sensitive reusable lessons into `$RDAPQ_HOME/memory/`. Never persist secrets.
6. **Diminishing-Return Exit**: Terminate gracefully when completion gates pass and marginal improvement saturates (< 0.15 score delta over two rounds).

## Commands

- `/rdapq <task>`: Launch or advance the RDAP-Q quality loop.
- `/rdapq status`: Show current phase, scorecard, confidence, and blockers.
- `/rdapq score`: Display or recalculate the evidence-weighted scorecard.
- `/rdapq audit`: Execute adversarial final-audit verification checklist.
- `/rdapq resume`: Verify environment drift and resume execution.
- `/rdapq memory`: Inspect active persistent memories.
- `/rdapq research`: Gather evidence before planning or implementation.
- `/rdapq explain`: Explain current phase or exit decision.
