import { useState } from "react";
import { useAsyncResource } from "../../../shared/store/useAsyncResource";
import { defaultApiKeyName } from "../helpers/apiKeyHelpers";
import { listApiKeys } from "../services/apiKeyService";

export function useApiKeys() {
  const resource = useAsyncResource(listApiKeys);
  const [created, setCreated] = useState("");
  const [name, setName] = useState(defaultApiKeyName());
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return { ...resource, created, setCreated, name, setName, createOpen, setCreateOpen, selected, setSelected };
}
