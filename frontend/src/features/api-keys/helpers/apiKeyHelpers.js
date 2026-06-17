export function apiKeyStatusTone(apiKey) {
  return apiKey.active ? "ok" : "bad";
}

export function defaultApiKeyName() {
  return "production-key";
}
