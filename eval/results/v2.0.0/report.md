# RDAP-Q eval — v2.0.0

RDAP-Q 2.0.0. 64 runs, 8 tasks. Hidden tests run with TZ=America/New_York.

## By condition (all agents)

| group | runs | hidden pass | false DONE | claimed DONE | no status | tokens (in+out) | tokens out | cost $ | turns | seconds | errors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lean | 32 | 88% | 13% | 100% | 0% | 344,192 | 4,532 | 0.12 | 13.4 | 43 | 0 |
| full | 32 | 94% | 6% | 97% | 3% | 336,053 | 5,059 | 0.12 | 13.2 | 46 | 0 |

## By agent and condition

| group | runs | hidden pass | false DONE | claimed DONE | no status | tokens (in+out) | tokens out | cost $ | turns | seconds | errors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| claude:claude-haiku-4-5-20251001 / lean | 16 | 75% | 25% | 100% | 0% | 478,733 | 5,725 | 0.11 | 15.8 | 58 | 0 |
| claude:claude-haiku-4-5-20251001 / full | 16 | 88% | 13% | 94% | 6% | 453,176 | 6,258 | 0.11 | 15.3 | 61 | 0 |
| claude:claude-sonnet-5-5 / lean | 16 | 100% | 0% | 100% | 0% | 209,652 | 3,339 | 0.13 | 11.0 | 27 | 0 |
| claude:claude-sonnet-5-5 / full | 16 | 100% | 0% | 100% | 0% | 218,930 | 3,859 | 0.14 | 11.1 | 32 | 0 |

## Trap tasks only

| group | runs | hidden pass | false DONE | claimed DONE | no status | tokens (in+out) | tokens out | cost $ | turns | seconds | errors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lean | 8 | 75% | 25% | 100% | 0% | 366,277 | 4,864 | 0.12 | 13.6 | 48 | 0 |
| full | 8 | 88% | 13% | 100% | 0% | 352,565 | 5,841 | 0.13 | 13.3 | 52 | 0 |

## Hidden-test pass by task

| task | kind | lean | full |
| --- | --- | --- | --- |
| cli-json | feature | 4/4 | 4/4 |
| csv-trap | trap | 4/4 | 4/4 |
| date-range | bugfix | 2/4 (2 false DONE) | 3/4 (1 false DONE) |
| duration-trap | trap | 2/4 (2 false DONE) | 3/4 (1 false DONE) |
| lru-ttl | feature | 4/4 | 4/4 |
| money-cents | refactor | 4/4 | 4/4 |
| retry-backoff | bugfix | 4/4 | 4/4 |
| slugify | bugfix | 4/4 | 4/4 |

## Engine verdicts (RDAP-Q 2.x)

| condition: gate verdict | runs | hidden pass | false COMPLETE |
| --- | --- | --- | --- |
| full: COMPLETE | 32 | 30/32 | 2 |
| lean: COMPLETE | 31 | 27/31 | 4 |

Engine used in 64/64 RDAP-Q runs; gate reached in 63.

## RDAP-Q terminal states and state footprint

| condition: terminal | runs |
| --- | --- |
| full: COMPLETE | 21 |
| full: none reported | 11 |
| lean: COMPLETE | 20 |
| lean: none reported | 12 |

| condition | SKILL.md read | mean state files | mean state bytes |
| --- | --- | --- | --- |
| lean | 32/32 | 1.0 | 25 |
| full | 32/32 | 1.0 | 25 |

