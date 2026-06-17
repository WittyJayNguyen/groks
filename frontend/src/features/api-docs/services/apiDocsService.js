import { API_ENDPOINTS } from "../../../core/config";

export function listPartnerEndpoints() {
  return [
    { key: "verify", method: "GET", endpoint: API_ENDPOINTS.client.verify, purpose: "Verify API key" },
    { key: "chat", method: "POST", endpoint: API_ENDPOINTS.client.chat, purpose: "Sync chat" },
    { key: "generate", method: "POST", endpoint: API_ENDPOINTS.client.generate, purpose: "T2I / I2I / T2V / I2V" },
    { key: "status", method: "GET", endpoint: "/api/client/tasks/{task_id}/status", purpose: "Poll job status" },
    { key: "file", method: "GET", endpoint: "/api/files/{file_id}", purpose: "Download result" },
  ];
}
