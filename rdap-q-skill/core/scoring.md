# weights, anchors, caps, risk_target: SKILL.md
formula: sum(score_i * weight_i) / 100
confidence_weights: {runtime: 35, repo: 25, external: 15, claims: 15, repro: 10}
coverage: verified_material_claims / total_material_claims
report: [quality, confidence, coverage, gates, critical, high, unknowns, previous, delta, target, remaining, aqc]
row: [dimension, weight, score, weighted, evidence_ids, gap]
forbid: looks_good
