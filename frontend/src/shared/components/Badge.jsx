export function Badge({ children, tone = "info" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
