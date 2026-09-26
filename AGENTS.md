protocol: RDAP-Q
version: "1.2.0"
on: /rdapq
load: rdap-q-skill/SKILL.md
then: current phase playbook only
state: .rdapq/state
skip: [manifest.json, other playbooks, bulk memory]
