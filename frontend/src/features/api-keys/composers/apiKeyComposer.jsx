import { Badge } from "../../../shared/components";
import { formatDateTime } from "../../../shared/helpers/formatters";
import { apiKeyStatusTone } from "../helpers/apiKeyHelpers";

export function composeApiKeyMetrics(items) {
  return [
    ["Total keys", items.length],
    ["Active keys", items.filter((key) => key.active).length],
    ["Revoked", items.filter((key) => !key.active).length],
  ];
}

export function composeApiKeyRows(items, onSelect) {
  return items.map((key) => ({
    key: key.id,
    onClick: () => onSelect(key),
    cells: [
      <b>{key.name}</b>,
      <span className="mono">{key.key_prefix}</span>,
      `${key.rate_limit_per_minute}/min`,
      <Badge tone={apiKeyStatusTone(key)}>{key.active ? "active" : "revoked"}</Badge>,
    ],
  }));
}

export function composeApiKeyDetailRows(key) {
  return [
    ["ID", key.id],
    ["Name", key.name],
    ["Prefix", key.key_prefix],
    ["Rate limit", `${key.rate_limit_per_minute}/min`],
    ["Status", key.active ? "active" : "revoked"],
    ["Created", formatDateTime(key.created_at)],
  ];
}
