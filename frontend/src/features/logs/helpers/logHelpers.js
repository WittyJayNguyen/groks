export function logLevelTone(level) {
  if (level === "error") return "bad";
  if (level === "warning") return "warn";
  return "muted";
}
