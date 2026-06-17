import { useState } from "react";

export function useAuthForm() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return { mode, setMode, form, setForm, updateField, error, setError };
}
