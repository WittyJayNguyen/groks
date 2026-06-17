import { Activity, KeyRound, Plus } from "lucide-react";
import { DataTable, DetailGrid, Metric, Modal, TableHeader } from "../../shared/components";
import { composeJobCreatePayload, composeJobDetailRows, composeJobMetrics, composeJobRows } from "./composers/jobComposer";
import { createJob } from "./services/jobService";
import { useJobs } from "./store/useJobs";

export function Jobs({ me }) {
  const { data: jobs, reload, form, setForm, createOpen, setCreateOpen, selected, setSelected } = useJobs();

  async function create(event) {
    event.preventDefault();
    await createJob(composeJobCreatePayload(form));
    setForm({ ...form, prompt: "", reference_images: "" });
    setCreateOpen(false);
    reload();
  }

  if (!me.has_api_key) return <div className="panel locked"><KeyRound size={20} /> Bạn cần tạo API Key trước khi vào Job.</div>;

  return (
    <div className="stack">
      <div className="metricGrid">
        {composeJobMetrics(jobs).map(([label, value]) => <Metric key={label} label={label} value={value} />)}
      </div>
      <div className="panel">
        <TableHeader icon={<Activity size={18} />} title="Job queue" action={<button className="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> Tạo job</button>} />
        <DataTable
          columns={["Mode", "Target", "Status", "Result / Error"]}
          empty="Chưa có job."
          rows={composeJobRows(jobs, setSelected)}
        />
      </div>
      <Modal title="Tạo job" open={createOpen} onClose={() => setCreateOpen(false)}>
        <form className="modalForm" onSubmit={create}>
          <select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })}><option value="image">image</option><option value="video">video</option></select>
          <textarea rows={5} placeholder="Prompt" value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} />
          <div className="inlineFields">
            <input placeholder="ratio" value={form.ratio} onChange={(e) => setForm({ ...form, ratio: e.target.value })} />
            <input type="number" min="1" max="10" value={form.count} onChange={(e) => setForm({ ...form, count: Number(e.target.value) })} />
            <input placeholder="quality" value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })} />
          </div>
          <textarea rows={3} placeholder="reference_images, mỗi dòng 1 URL" value={form.reference_images} onChange={(e) => setForm({ ...form, reference_images: e.target.value })} />
          <button className="primary">Tạo job</button>
        </form>
      </Modal>
      <Modal title="Job detail" open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && <DetailGrid rows={composeJobDetailRows(selected)} />}
      </Modal>
    </div>
  );
}
