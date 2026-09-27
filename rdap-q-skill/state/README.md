role: task state, not durable memory
path: .rdapq/state
create: on first write of a file that this checkpoint needs
rewrite: only on depth switch, gate transition, terminal, or an explicit status/score/audit command
secrets: never
caps: {evidence_records: 80, iteration_rounds: 3, train_rows: 40, file_bytes: 49152}
store: ids and outcomes, not log bodies
training: train.md is the model-training log; one compact row per checkpoint
