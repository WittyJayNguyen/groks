import { Activity, Plus } from "lucide-react";
import { DataTable, DetailGrid, Metric, Modal, TableHeader } from "../../shared/components";
import { composePoolCreatePayload, composePoolDetailRows, composePoolMetrics, composePoolRows } from "./composers/poolComposer";
import { defaultPoolForm } from "./helpers/poolHelpers";
import { createPool } from "./services/poolService";
import { usePools } from "./store/usePools";

export function PoolManager() {
  const { data: items, reload, form, setForm, error, setError, createOpen, setCreateOpen, selected, setSelected } = usePools();

  async function create(event) {
    event.preventDefault();
    setError("");
    try {
      await createPool(composePoolCreatePayload(form));
      setForm({ ...defaultPoolForm, name: form.name });
      setCreateOpen(false);
      reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="stack">
      <div className="metricGrid">
        {composePoolMetrics(items).map(([label, value]) => <Metric key={label} label={label} value={value} />)}
      </div>
      <div className="panel">
        <TableHeader icon={<Activity size={18} />} title="Credential pools" action={<button className="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> Thêm pool</button>} />
        <DataTable
          columns={["Pool", "Load", "Capability", "Status"]}
          empty="Chưa có credential pool."
          rows={composePoolRows(items, setSelected)}
        />
      </div>
      <Modal title="Thêm credential pool" open={createOpen} onClose={() => setCreateOpen(false)}>
        <form className="modalForm" onSubmit={create}>
          <input placeholder="Tên pool" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Grok userId / x-userid" value={form.grok_user_id} onChange={(e) => setForm({ ...form, grok_user_id: e.target.value })} />
          <textarea rows={8} placeholder='Cookies JSON {"sso":"..."} hoặc Cookie-Editor object' value={form.cookies} onChange={(e) => setForm({ ...form, cookies: e.target.value })} />
          <div className="inlineFields">
            <label>Max concurrent <input type="number" min="1" value={form.max_concurrent_jobs} onChange={(e) => setForm({ ...form, max_concurrent_jobs: Number(e.target.value) })} /></label>
            <label><input type="checkbox" checked={form.supports_image} onChange={(e) => setForm({ ...form, supports_image: e.target.checked })} /> Image</label>
            <label><input type="checkbox" checked={form.supports_video} onChange={(e) => setForm({ ...form, supports_video: e.target.checked })} /> Video</label>
          </div>
          <button className="primary"><Plus size={16} /> Tạo pool</button>
          {error && <div className="notice">{error}</div>}
        </form>
      </Modal>
      <Modal title="Pool detail" open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && <DetailGrid rows={composePoolDetailRows(selected)} />}
      </Modal>
    </div>
  );
}
