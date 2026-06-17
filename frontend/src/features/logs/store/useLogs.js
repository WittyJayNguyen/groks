import { useState } from "react";
import { useAsyncResource } from "../../../shared/store/useAsyncResource";
import { listLogs } from "../services/logService";

export function useLogs() {
  const resource = useAsyncResource(listLogs);
  const [selected, setSelected] = useState(null);

  return { ...resource, selected, setSelected };
}
