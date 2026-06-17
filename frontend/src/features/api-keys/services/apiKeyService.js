import { API_ENDPOINTS } from "../../../core/config";
import { api } from "../../../core/http";

export function listApiKeys() {
  return api(API_ENDPOINTS.apiKeys.list);
}

export function createApiKey(payload) {
  return api(API_ENDPOINTS.apiKeys.create, { method: "POST", body: JSON.stringify(payload) });
}

export function revokeApiKey(keyId) {
  return api(API_ENDPOINTS.apiKeys.revoke(keyId), { method: "DELETE" });
}
