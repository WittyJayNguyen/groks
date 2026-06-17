export function DataTable({ columns = [], rows = [], empty = "No data" }) {
  return (
    <div className="tableWrap">
      <table className="dataTable">
        {columns.length > 0 && <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>}
        <tbody>
          {rows.length === 0 && <tr><td colSpan={Math.max(1, columns.length)} className="emptyCell">{empty}</td></tr>}
          {rows.map((row) => (
            <tr key={row.key} onClick={row.onClick} className={row.onClick ? "clickable" : ""}>
              {row.cells.map((cell, index) => <td key={index}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
