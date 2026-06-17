import { KeyRound, Plus } from "lucide-react";
import { DataTable, DetailGrid, Metric, Modal, TableHeader } from "../../shared/components";
import { composeApiKeyDetailRows, composeApiKeyMetrics, composeApiKeyRows } from "./composers/apiKeyComposer";
import { createApiKey } from "./services/apiKeyService";
import { useApiKeys } from "./store/useApiKeys";

export function ApiKeys({ reloadMe }) {
  const { data: items, reload, created, setCreated, name, setName, createOpen, setCreateOpen, selected, setSelected } = useApiKeys();

  async function create() {
    const out = await createApiKey({ name });
    setCreated(out.api_key);
    await reload();
    setCreateOpen(false);
    reloadMe();
  }

  return (
    <div className="stack">
      <div className="metricGrid">
        {composeApiKeyMetrics(items).map(([label, value]) => <Metric key={label} label={label} value={value} />)}
      </div>
      <div className="panel">
        <TableHeader icon={<KeyRound size={18} />} title="API keys" action={<button className="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> Create key</button>} />
        {created && <pre className="secret">{created}</pre>}
        <DataTable
          columns={["Name", "Prefix", "Rate", "Status"]}
          empty="Chưa có API key."
          rows={composeApiKeyRows(items, setSelected)}
        />
      </div>
      <Modal title="Create API key" open={createOpen} onClose={() => setCreateOpen(false)}>
        <div className="modalForm">
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <button className="primary" onClick={create}><Plus size={16} /> Create key</button>
        </div>
      </Modal>
      <Modal title="API key detail" open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && <DetailGrid rows={composeApiKeyDetailRows(selected)} />}
      </Modal>
    </div>
  );
}
