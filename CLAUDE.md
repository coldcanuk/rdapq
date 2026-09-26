protocol: RDAP-Q
version: "1.2.3"
on: [/rdapq, /rdap-q]
load: .agents/skills/rdap-q/SKILL.md
fallback: rdap-q-skill/SKILL.md
then: current phase playbook only
state: .rdapq/state
skip: [manifest.json, other playbooks, bulk memory]
