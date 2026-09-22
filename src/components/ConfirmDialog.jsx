import ModalOverlay from "./ModalOverlay";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  icon: Icon,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmTone = "red",
}) {
  const confirmClasses =
    confirmTone === "green"
      ? "bg-emerald-600 text-white"
      : confirmTone === "black"
      ? "bg-zinc-900 text-white"
      : "bg-red-600 text-white";

  return (
    <ModalOverlay open={open} onClose={onClose} align="center">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-[85%] max-w-[320px] p-6 rounded-[28px] text-center animate-pop-in"
      >
        <div className="w-[60px] h-[60px] bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          {Icon ? <Icon size={26} /> : null}
        </div>
        <h3 className="text-slate-900 font-extrabold mb-2">{title}</h3>
        {message ? <p className="text-slate-500 text-xs leading-relaxed">{message}</p> : null}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="tactile flex-1 py-3 rounded-2xl font-bold text-sm bg-slate-100 text-slate-500"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`tactile flex-1 py-3 rounded-2xl font-bold text-sm ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
