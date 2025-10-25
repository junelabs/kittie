export function slugFile(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9_.-]+/g, "-");
}

