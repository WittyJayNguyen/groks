export function backendBaseFromWindow(location = window.location) {
  return location.origin.replace(/:\d+$/, ":18081");
}

export function methodTone(method) {
  return method === "POST" ? "ok" : "info";
}
