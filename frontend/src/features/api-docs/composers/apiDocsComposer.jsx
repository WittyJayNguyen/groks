import { Badge } from "../../../shared/components";
import { methodTone } from "../helpers/apiDocsHelpers";

export function composeEndpointRows(endpoints) {
  return endpoints.map((item) => ({
    key: item.key,
    cells: [<Badge tone={methodTone(item.method)}>{item.method}</Badge>, <code>{item.endpoint}</code>, item.purpose],
  }));
}

export function composeEndpointList(base) {
  return `GET ${base}/api/client/verify
POST ${base}/api/client/chat
POST ${base}/api/client/generate
GET ${base}/api/client/tasks/{task_id}/status
GET ${base}/api/files/{file_id}`;
}

export function composeGenerateCurl(base) {
  return `curl -X POST ${base}/api/client/generate \\
  -H "X-API-Key: uxpm_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{"target":"image","prompt":"a cat in space","ratio":"1:1"}'`;
}
