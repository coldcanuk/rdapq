# RDAP-Q Guidelines for Google Antigravity & Gemini

This repository implements the **RDAP-Q Agent Engineering Protocol** (`v1.1.0`).

## Rules

- **Skill Entry**: Load `rdap-q-skill/SKILL.md` when running `/rdapq`.
- **Phase Playbooks**: Progressively load `rdap-q-skill/playbooks/` based on current lifecycle step.
- **Persistent State**: Update `.rdapq/state/` throughout the task lifecycle.
- **Quality Gates**: Apply hard gates and calibrated 0–10 scoring before declaring task completion.
