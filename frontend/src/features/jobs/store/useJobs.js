import { useState } from "react";
import { useAsyncResource } from "../../../shared/store/useAsyncResource";
import { defaultJobForm } from "../helpers/jobHelpers";
import { listJobs } from "../services/jobService";

export function useJobs() {
  const resource = useAsyncResource(listJobs, { interval: 3000 });
  const [form, setForm] = useState(defaultJobForm);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return { ...resource, form, setForm, createOpen, setCreateOpen, selected, setSelected };
}
