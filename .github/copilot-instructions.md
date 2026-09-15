# GitHub Copilot Instructions — RDAP-Q Protocol

This repository uses the **RDAP-Q Agent Engineering Protocol** (v1.1.0).

## Directives for GitHub Copilot

1. **Protocol Entrypoint**: Refer to `rdap-q-skill/SKILL.md` for methodology, quality gates, and phase routing.
2. **Deterministic Process**:
   - Collect concrete evidence before generating code or making architectural suggestions.
   - Respect project state stored in `.rdapq/state/`.
   - Adhere to the calibrated quality scorecard in `rdap-q-skill/core/scoring.md`.
3. **Execution Quality**:
   - Do not claim tests or builds pass without running them.
   - Enforce hard quality gates before declaring any milestone complete.
4. **Command Handling**:
   - When the user types `/rdapq`, adopt the RDAP-Q controller loop and guide the user through Discovery, Planning, Implementation, Verification, and Audit.
