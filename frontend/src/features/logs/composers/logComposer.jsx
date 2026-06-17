import { Badge } from "../../../shared/components";
import { formatDateTime, formatTime, shortId } from "../../../shared/helpers/formatters";
import { logLevelTone } from "../helpers/logHelpers";

export function composeLogRows(logs, onSelect) {
  return logs.map((log, index) => ({
    key: `${log.job_id}-${index}`,
    onClick: () => onSelect(log),
    cells: [
      formatTime(log.created_at),
      <Badge tone={logLevelTone(log.level)}>{log.level}</Badge>,
      <code>{shortId(log.job_id)}</code>,
      <span className="truncate">{log.message}</span>,
    ],
  }));
}

export function composeLogDetailRows(log) {
  return [
    ["Job ID", log.job_id],
    ["Time", formatDateTime(log.created_at)],
    ["Level", log.level],
    ["Message", log.message],
  ];
}
