import { ListTree } from "lucide-react";
import { DataTable, DetailGrid, Modal, TableHeader } from "../../shared/components";
import { composeLogDetailRows, composeLogRows } from "./composers/logComposer";
import { useLogs } from "./store/useLogs";

export function Logs() {
  const { data: logs, selected, setSelected } = useLogs();

  return (
    <div className="panel">
      <TableHeader icon={<ListTree size={18} />} title="System logs" />
      <DataTable
        columns={["Time", "Level", "Job", "Message"]}
        empty="Chưa có log."
        rows={composeLogRows(logs, setSelected)}
      />
      <Modal title="Log detail" open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && <DetailGrid rows={composeLogDetailRows(selected)} />}
      </Modal>
    </div>
  );
}
