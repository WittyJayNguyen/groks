import { authHeaders, getAccessToken, setAccessToken } from "../auth";
import { API_BASE } from "../config";

export function token() {
  return getAccessToken();
}

export function setToken(value) {
  setAccessToken(value);
}

export async function api(path, options = {}) {
  const headers = { ...authHeaders(), ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      detail = (await res.json()).detail || detail;
    } catch {
      // Keep the HTTP status text when the body is not JSON.
    }
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export { API_BASE };
