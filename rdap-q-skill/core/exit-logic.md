# RDAP-Q Exit Logic

The loop must improve quality without wasting tokens or engineering effort.

## Improvement candidate

For each remaining improvement estimate:

- severity;
- expected weighted score gain (`ΔQ`);
- risk reduction;
- effort units;
- evidence confidence;
- dependency/blocker status.

Relative effort units:

- `1` trivial
- `2` small
- `3` moderate
- `5` substantial
- `8` major

## Iterate when ANY applies

### Resolvable hard-gate failure

A gate fails and a credible corrective action exists.

### Material defect

An in-scope HIGH or CRITICAL defect remains.

### High-value improvement

```text
Expected ΔQ >= 0.20
```

at reasonable effort.

### Material risk reduction

A change materially reduces correctness, security, financial, data-loss,
compatibility, or operational risk even if `ΔQ < 0.20`.

## Diminishing-return exit

Stop optimization when all completion gates pass and either:

### Saturation

Both of the last two completed rounds produced:

```text
ΔQ < 0.15
```

### Forward value

The best remaining credible improvement is:

```text
Expected ΔQ < 0.20
```

and provides no material risk reduction.

## Stall

Declare `STALLED` when:

1. a material deficiency still prevents completion;
2. two consecutive attempts each produced `< 0.10`;
3. no materially different corrective action exists.

## Blocked

Declare `BLOCKED` when progress requires unavailable:

- user decision;
- credentials;
- environment;
- external system;
- authoritative specification;
- permission;
- required hardware/service.

## Constraint limited

Declare `CONSTRAINT_LIMITED` when an external constraint caps attainable quality.

Constraint-limited does not automatically mean complete.

## Attainable Quality Ceiling

Late in the loop estimate:

```text
Current Quality: 8.18
Estimated AQC:   8.30–8.40
```

Support it with remaining improvement candidates.

AQC never excuses a failed hard gate.

## Decision table

| Condition | Decision |
|---|---|
| Gate fails + credible fix | ITERATE |
| HIGH/CRITICAL defect | ITERATE |
| Expected ΔQ >= 0.20 | ITERATE |
| Material risk reduction | ITERATE |
| Completion gates pass + diminishing return | COMPLETE |
| Required input/resource unavailable | BLOCKED |
| Repeated negligible progress + unresolved deficiency | STALLED |
| External constraint caps quality | CONSTRAINT_LIMITED |
