import { Badge } from "../../../shared/components";
import { formatDateTime, splitLines } from "../../../shared/helpers/formatters";
import { jobResultText, jobStatusTone } from "../helpers/jobHelpers";

export function composeJobCreatePayload(form) {
  return { ...form, reference_images: splitLines(form.reference_images) };
}

export function composeJobMetrics(jobs) {
  return [
    ["Total jobs", jobs.length],
    ["Running", jobs.filter((job) => !["success", "failed"].includes(job.status)).length],
    ["Success", jobs.filter((job) => job.status === "success").length],
  ];
}

export function composeJobRows(jobs, onSelect) {
  return jobs.map((job) => ({
    key: job.task_id,
    onClick: () => onSelect(job),
    cells: [
      <Badge>{job.mode}</Badge>,
      job.target,
      <Badge tone={jobStatusTone(job.status)}>{job.status}</Badge>,
      <span className="truncate">{jobResultText(job)}</span>,
    ],
  }));
}

export function composeJobDetailRows(job) {
  return [
    ["Task ID", job.task_id],
    ["Mode", job.mode],
    ["Target", job.target],
    ["Status", job.status],
    ["Result", job.image_urls?.[0] || job.video_urls?.[0] || "-"],
    ["Error", job.error_message || "-"],
    ["Created", formatDateTime(job.created_at)],
  ];
}
