import { FileText, Lock } from "lucide-react";

export default function SessionButton({ label, sublabel, available, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 w-[80px] scroll-snap-start flex flex-col items-center justify-center gap-1 rounded-[14px] border px-2 py-2.5 text-center transition-all duration-150 active:scale-[0.98] active:opacity-90 ${
        available
          ? "border-[#f6d7d7] bg-[#fff3f3] text-[#d92a2a] hover:bg-[#ffe9e9]"
          : "border-black/5 bg-[#f9f8f6] text-black/50 hover:bg-[#f1efee]"
      }`}
    >
      {available ? <FileText size={14} strokeWidth={2.1} /> : <Lock size={12} />}
      <span className="text-[8.5px] font-bold uppercase tracking-[0.16em] leading-none">{label}</span>
      <span className="text-[6.5px] font-semibold uppercase tracking-[0.16em] opacity-75 leading-none">{sublabel}</span>
    </button>
  );
}
