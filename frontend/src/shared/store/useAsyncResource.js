import { useCallback, useEffect, useState } from "react";

export function useAsyncResource(loader, { auto = true, interval = 0 } = {}) {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(auto));

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await loader());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    if (!auto) return undefined;
    reload();
    if (!interval) return undefined;
    const id = setInterval(reload, interval);
    return () => clearInterval(id);
  }, [auto, interval, reload]);

  return { data, setData, error, loading, reload };
}
