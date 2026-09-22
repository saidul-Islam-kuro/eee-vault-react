import { useEffect } from "react";

export default function ModalOverlay({ open, onClose, children, align = "center", zIndex = 200 }) {
  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex animate-fade-in ${
        align === "center" ? "items-center justify-center p-4" : "items-end justify-center"
      }`}
      style={{ zIndex }}
    >
      {children}
    </div>
  );
}
