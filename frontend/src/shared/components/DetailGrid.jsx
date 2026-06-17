import React from "react";

export function DetailGrid({ rows }) {
  return (
    <div className="detailGrid">
      {rows.map(([label, value]) => (
        <React.Fragment key={label}>
          <span>{label}</span>
          <b>{value}</b>
        </React.Fragment>
      ))}
    </div>
  );
}
