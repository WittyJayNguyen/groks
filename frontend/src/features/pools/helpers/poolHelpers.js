export const defaultPoolForm = {
  name: "Grok Pool 1",
  grok_user_id: "",
  cookies: "{}",
  max_concurrent_jobs: 2,
  supports_image: true,
  supports_video: true,
  active: true,
};

export function parsePoolCookies(value) {
  return JSON.parse(value || "{}");
}

export function poolStatusTone(pool) {
  return pool.active ? "ok" : "muted";
}
