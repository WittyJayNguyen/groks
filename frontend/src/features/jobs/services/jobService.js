import { API_ENDPOINTS } from "../../../core/config";
import { api } from "../../../core/http";

export function listJobs() {
  return api(API_ENDPOINTS.jobs.list);
}

export function createJob(payload) {
  return api(API_ENDPOINTS.jobs.create, { method: "POST", body: JSON.stringify(payload) });
}

export function listJobLogs(jobId) {
  return api(API_ENDPOINTS.jobs.logs(jobId));
}
