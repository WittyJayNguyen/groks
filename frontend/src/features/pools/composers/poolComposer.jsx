import { Badge, LoadBar } from "../../../shared/components";
import { parsePoolCookies, poolStatusTone } from "../helpers/poolHelpers";

export function composePoolCreatePayload(form) {
  return { ...form, cookies: parsePoolCookies(form.cookies) };
}

export function composePoolMetrics(items) {
  return [
    ["Total pools", items.length],
    ["Active pools", items.filter((pool) => pool.active).length],
    ["Running jobs", items.reduce((sum, pool) => sum + pool.running_jobs, 0)],
  ];
}

export function composePoolRows(items, onSelect) {
  return items.map((pool) => ({
    key: pool.id,
    onClick: () => onSelect(pool),
    cells: [
      <><b>{pool.name}</b><br /><span className="muted mono">{pool.grok_user_id}</span></>,
      <LoadBar value={pool.running_jobs} max={pool.max_concurrent_jobs} />,
      <div className="badgeRow"><Badge>image {pool.supports_image ? "on" : "off"}</Badge><Badge>video {pool.supports_video ? "on" : "off"}</Badge></div>,
      <Badge tone={poolStatusTone(pool)}>{pool.active ? "active" : "off"}</Badge>,
    ],
  }));
}

export function composePoolDetailRows(pool) {
  return [
    ["ID", pool.id],
    ["Name", pool.name],
    ["Grok userId", pool.grok_user_id],
    ["Running", `${pool.running_jobs}/${pool.max_concurrent_jobs}`],
    ["Image", pool.supports_image ? "enabled" : "disabled"],
    ["Video", pool.supports_video ? "enabled" : "disabled"],
    ["Status", pool.active ? "active" : "off"],
    ["Last error", pool.last_error || "-"],
  ];
}
