# RDAP-Q eval — baseline-1.3.1

RDAP-Q 1.3.1. 96 runs, 8 tasks. Hidden tests run with TZ=America/New_York.

## By condition (all agents)

| group | runs | hidden pass | false DONE | claimed DONE | no status | tokens (in+out) | tokens out | cost $ | turns | seconds | errors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | 32 | 100% | 0% | 100% | 0% | 170,741 | 4,687 | 0.08 | 7.1 | 40 | 0 |
| lean | 32 | 91% | 9% | 100% | 0% | 338,049 | 5,303 | 0.12 | 15.2 | 51 | 0 |
| full | 32 | 97% | 3% | 97% | 0% | 419,913 | 5,894 | 0.15 | 17.6 | 53 | 0 |

## By agent and condition

| group | runs | hidden pass | false DONE | claimed DONE | no status | tokens (in+out) | tokens out | cost $ | turns | seconds | errors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| claude:claude-haiku-4-5-20251001 / none | 16 | 100% | 0% | 100% | 0% | 254,688 | 7,391 | 0.09 | 8.8 | 62 | 0 |
| claude:claude-haiku-4-5-20251001 / lean | 16 | 81% | 19% | 100% | 0% | 498,720 | 7,526 | 0.13 | 18.3 | 72 | 0 |
| claude:claude-haiku-4-5-20251001 / full | 16 | 94% | 6% | 100% | 0% | 589,420 | 7,727 | 0.14 | 20.0 | 71 | 0 |
| claude:claude-sonnet-5-5 / none | 16 | 100% | 0% | 100% | 0% | 86,793 | 1,983 | 0.07 | 5.4 | 18 | 0 |
| claude:claude-sonnet-5-5 / lean | 16 | 100% | 0% | 100% | 0% | 177,379 | 3,079 | 0.12 | 12.1 | 29 | 0 |
| claude:claude-sonnet-5-5 / full | 16 | 100% | 0% | 94% | 0% | 250,406 | 4,062 | 0.15 | 15.1 | 34 | 0 |

## Trap tasks only

| group | runs | hidden pass | false DONE | claimed DONE | no status | tokens (in+out) | tokens out | cost $ | turns | seconds | errors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | 8 | 100% | 0% | 100% | 0% | 161,300 | 5,860 | 0.09 | 6.9 | 51 | 0 |
| lean | 8 | 88% | 13% | 100% | 0% | 397,032 | 7,057 | 0.14 | 16.8 | 68 | 0 |
| full | 8 | 100% | 0% | 100% | 0% | 465,406 | 5,987 | 0.15 | 17.8 | 50 | 0 |

## Hidden-test pass by task

| task | kind | none | lean | full |
| --- | --- | --- | --- | --- |
| cli-json | feature | 4/4 | 4/4 | 4/4 |
| csv-trap | trap | 4/4 | 4/4 | 4/4 |
| date-range | bugfix | 4/4 | 3/4 (1 false DONE) | 4/4 |
| duration-trap | trap | 4/4 | 3/4 (1 false DONE) | 4/4 |
| lru-ttl | feature | 4/4 | 4/4 | 3/4 (1 false DONE) |
| money-cents | refactor | 4/4 | 3/4 (1 false DONE) | 4/4 |
| retry-backoff | bugfix | 4/4 | 4/4 | 4/4 |
| slugify | bugfix | 4/4 | 4/4 | 4/4 |

## RDAP-Q terminal states and state footprint

| condition: terminal | runs |
| --- | --- |
| full: COMPLETE | 1 |
| full: none reported | 31 |
| lean: none reported | 32 |

| condition | mean state files | mean state bytes |
| --- | --- | --- |
| lean | 1.0 | 25 |
| full | 1.5 | 574 |

