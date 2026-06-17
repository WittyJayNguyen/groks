import { API_ENDPOINTS } from "../../../core/config";
import { api } from "../../../core/http";

export function listPools() {
  return api(API_ENDPOINTS.pools.list);
}

export function createPool(payload) {
  return api(API_ENDPOINTS.pools.create, { method: "POST", body: JSON.stringify(payload) });
}

export function updatePool(poolId, payload) {
  return api(API_ENDPOINTS.pools.update(poolId), { method: "PATCH", body: JSON.stringify(payload) });
}

export function deletePool(poolId) {
  return api(API_ENDPOINTS.pools.delete(poolId), { method: "DELETE" });
}
