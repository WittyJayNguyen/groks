import { BookOpen } from "lucide-react";
import { DataTable } from "../../shared/components";
import { composeEndpointList, composeEndpointRows, composeGenerateCurl } from "./composers/apiDocsComposer";
import { useApiDocs } from "./store/useApiDocs";

export function ApiDocs() {
  const { base, endpoints } = useApiDocs();
  return (
    <div className="panel docs">
      <div className="panelTitle"><BookOpen size={18} /><h3>Partner API - Pure HTTP</h3></div>
      <p>Mọi request dùng <code>X-API-Key</code> hoặc <code>Authorization: Bearer</code>.</p>
      <DataTable
        columns={["Method", "Endpoint", "Purpose"]}
        rows={composeEndpointRows(endpoints)}
      />
      <pre>{composeEndpointList(base)}</pre>
      <pre>{composeGenerateCurl(base)}</pre>
    </div>
  );
}
