import { useState } from "react";
import { useAsyncResource } from "../../../shared/store/useAsyncResource";
import { defaultPoolForm } from "../helpers/poolHelpers";
import { listPools } from "../services/poolService";

export function usePools() {
  const resource = useAsyncResource(listPools);
  const [form, setForm] = useState(defaultPoolForm);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return { ...resource, form, setForm, error, setError, createOpen, setCreateOpen, selected, setSelected };
}
