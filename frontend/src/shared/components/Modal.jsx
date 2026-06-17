import { X } from "lucide-react";

export function Modal({ title, open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modalHead">
          <h3>{title}</h3>
          <button className="iconOnly" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}
