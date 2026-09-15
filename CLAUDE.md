# RDAP-Q Protocol for Claude & Claude Code

This repository integrates the **RDAP-Q Agent Engineering Protocol** (`v1.1.0`).

## Activation

Whenever the user invokes `/rdapq` or requests non-trivial engineering tasks:
1. Consult `rdap-q-skill/SKILL.md` for methodology and guidelines.
2. Maintain project execution state in `.rdapq/state/`.
3. Deterministically load playbooks from `rdap-q-skill/playbooks/` based on current phase (Bootstrap -> Discovery -> Planning -> Architecture -> Implementation -> Verification -> Final Audit).
4. Enforce quality gates (`rdap-q-skill/core/gates.md`) and scoring rules (`rdap-q-skill/core/scoring.md`).

## Invariants

- **Evidence First**: Do not assume API signatures, file contents, or test results without verification.
- **Persistent State**: Log milestones and evidence in `.rdapq/state/evidence.md` and `.rdapq/state/scorecard.md`.
- **Zero Secrets in Memory**: Never write API keys or tokens to persistent memory or state.
- **Diminishing Returns**: Stop iterating once quality reaches solid production criteria and marginal gain is < 0.15.
