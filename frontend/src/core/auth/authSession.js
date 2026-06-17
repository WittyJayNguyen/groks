const ACCESS_TOKEN_KEY = "groks_access_token";
const LEGACY_TOKEN_KEY = "groks_token";
const ORGANIZATION_ID_KEY = "groks_organization_id";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY) || "";
}

export function setAccessToken(value) {
  if (value) {
    localStorage.setItem(ACCESS_TOKEN_KEY, value);
    localStorage.setItem(LEGACY_TOKEN_KEY, value);
    return;
  }
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function getOrganizationId() {
  return localStorage.getItem(ORGANIZATION_ID_KEY) || "";
}

export function setOrganizationId(value) {
  if (value) localStorage.setItem(ORGANIZATION_ID_KEY, String(value));
  else localStorage.removeItem(ORGANIZATION_ID_KEY);
}

export function clearAuthSession() {
  setAccessToken("");
  setOrganizationId("");
}

export function saveAuthSession(response) {
  const session = normalizeAuthResponse(response);
  setAccessToken(session.accessToken);
  setOrganizationId(session.currentOrganizationId || "");
  return session;
}

export function normalizeAuthResponse(response = {}) {
  const data = response.data || response;
  return {
    accessToken: data.access_token || response.access_token || response.token || "",
    tokenType: data.token_type || response.token_type || "Bearer",
    user: data.user || response.user || null,
    availableOrganizations: data.available_organizations || [],
    currentOrganizationId: data.current_organization_id || null,
    roles: data.roles || [],
    permissions: data.permissions || [],
    abilities: data.abilities || [],
  };
}

export function authHeaders() {
  const headers = {};
  const accessToken = getAccessToken();
  const organizationId = getOrganizationId();
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (organizationId) headers["X-Organization-Id"] = organizationId;
  return headers;
}
