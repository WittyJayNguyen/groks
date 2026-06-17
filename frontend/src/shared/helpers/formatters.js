export function shortId(value = "", length = 8) {
  return String(value).slice(0, length);
}

export function splitLines(value = "") {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

export function formatDateTime(value) {
  return value ? new Date(value).toLocaleString() : "-";
}

export function formatTime(value) {
  return value ? new Date(value).toLocaleTimeString() : "-";
}
