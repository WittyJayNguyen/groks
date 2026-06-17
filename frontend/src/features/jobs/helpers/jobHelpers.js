export const defaultJobForm = {
  target: "image",
  prompt: "",
  ratio: "1:1",
  count: 1,
  quality: "standard",
  duration: 5,
  reference_images: "",
};

export function jobStatusTone(status) {
  if (status === "success") return "ok";
  if (status === "failed") return "bad";
  return "warn";
}

export function jobResultText(job) {
  return job.error_message || (job.image_urls[0] || job.video_urls[0] || "-");
}
