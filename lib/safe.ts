export function invariant(cond: any, msg = "Invariant failed"): asserts cond {
  if (!cond) throw new Error(msg);
}

