role: task state, not durable memory
path: .rdapq/state
create: on first write
secrets: never
caps: {evidence_records: 80, iteration_rounds: 20, file_bytes: 49152}
store: ids and outcomes, not log bodies
