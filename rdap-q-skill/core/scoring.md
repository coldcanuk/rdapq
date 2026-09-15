# RDAP-Q Scoring System

Scores support decisions. They are not awards.

## Default quality dimensions

| Dimension | Weight |
|---|---:|
| Functional correctness | 25% |
| Requirements coverage | 15% |
| Verification strength | 15% |
| Integration & compatibility | 10% |
| Security & failure handling | 10% |
| Maintainability | 10% |
| Architectural fit | 8% |
| Operability & documentation | 7% |

## Score scale

Use 0.5 increments unless objective measurements justify more precision.

| Score | Meaning |
|---:|---|
| 0 | Absent |
| 1–2 | Fundamentally broken |
| 3–4 | Materially deficient |
| 5 | Plausible but insufficiently verified |
| 6 | Functional with meaningful gaps |
| 7 | Solid |
| 8 | Strong production-quality evidence |
| 9 | Exceptional evidence and very low residual uncertainty |
| 10 | Reference quality; rare |

## Weighted quality

```text
QualityScore = Σ(DimensionScore_i × Weight_i)
```

Weights are decimal fractions totaling 1.0.

## Evidence caps

| Condition | Result |
|---|---|
| Material behaviour unverified | relevant dimension <= 5.0 |
| Material dependency still inferred | relevant dimension <= 5.0 |
| Significant known defect | relevant dimension <= 4.0 |
| Required test failing | HARD GATE FAIL |
| Required integration unexercised when reasonably testable | HARD GATE FAIL |

## Risk targets

| Risk | Default target |
|---|---:|
| LOW | 7.2 |
| MODERATE | 7.6 |
| HIGH | 8.0 |
| CRITICAL | 8.3 |

Record risk and target before implementation.

## Confidence score

Track confidence separately.

Suggested dimensions:

| Confidence dimension | Weight |
|---|---:|
| Direct runtime/test evidence | 35% |
| Repository/source evidence | 25% |
| Authoritative external evidence | 15% |
| Material-claim coverage | 15% |
| Reproducibility | 10% |

## Evidence coverage

```text
EvidenceCoverage =
  verified_material_claims / total_material_claims × 100
```

Do not count trivial claims to inflate the percentage.

## Required reporting

Every formal scoring round reports:

- Quality Score;
- Confidence Score;
- Evidence Coverage;
- hard-gate status;
- critical defects;
- high defects;
- material unknowns;
- previous score;
- score delta;
- target;
- best remaining improvement;
- attainable quality ceiling when useful.

## Evidence-linked scorecard

Use:

| Dimension | Weight | Score | Weighted | Evidence IDs | Remaining Gap |
|---|---:|---:|---:|---|---|

No row should rely on "looks good" as evidence.
