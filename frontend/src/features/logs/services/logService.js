import { API_ENDPOINTS } from "../../../core/config";
import { api } from "../../../core/http";

export function listLogs() {
  return api(API_ENDPOINTS.logs.list);
}
