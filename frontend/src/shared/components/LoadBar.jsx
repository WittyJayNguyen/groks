export function LoadBar({ value, max }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return <div className="load"><span>{value}/{max}</span><i style={{ width: `${pct}%` }} /></div>;
}
