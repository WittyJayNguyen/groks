export function TableHeader({ icon, title, action }) {
  return <div className="tableHeader"><div className="panelTitle">{icon}<h3>{title}</h3></div>{action}</div>;
}
