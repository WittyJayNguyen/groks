import { API_ENDPOINTS } from "../../../core/config";
import { api } from "../../../core/http";

export function login(payload) {
  return api(API_ENDPOINTS.auth.login, { method: "POST", body: JSON.stringify(payload) });
}

export function register(payload) {
  return api(API_ENDPOINTS.auth.register, { method: "POST", body: JSON.stringify(payload) });
}

export function forgotPassword(email) {
  return api(API_ENDPOINTS.auth.forgotPassword, { method: "POST", body: JSON.stringify({ email }) });
}

export function resetPassword(payload) {
  return api(API_ENDPOINTS.auth.resetPassword, { method: "POST", body: JSON.stringify(payload) });
}

export function logout() {
  return api(API_ENDPOINTS.auth.logout, { method: "POST" });
}

export function switchOrganization(organizationId) {
  return api(API_ENDPOINTS.auth.switchOrganization, { method: "POST", body: JSON.stringify({ organization_id: organizationId }) });
}

export function getMe() {
  return api(API_ENDPOINTS.auth.me);
}
