import { CircleCheck } from "lucide-react";
import ModalOverlay from "./ModalOverlay";
import { SEMESTERS } from "../lib/vault";

export default function SemesterSheet({ open, onClose, value, onChange }) {
  return (
    <ModalOverlay open={open} onClose={onClose} align="center">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden animate-pop-in border border-black/5 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.5)]"
      >
        <div className="p-6 text-center border-b border-black/5">
          <h3 className="text-xl font-black text-black uppercase tracking-tighter">Select Semester</h3>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto no-scrollbar">
          {SEMESTERS.map((s) => {
            const active = value === s.value;
            return (
              <button
                key={s.value}
                onClick={() => {
                  onChange(s.value, s.label);
                  onClose();
                }}
                className={`tactile w-full flex items-center justify-between p-4 mb-2 rounded-2xl transition-colors ${
                  active ? "bg-[#d92a2a] text-white shadow-[0_14px_24px_-18px_rgba(217,42,42,0.9)]" : "hover:bg-[#f9f8f6] text-black/70 font-bold"
                }`}
              >
                <span className="text-sm">{s.label}</span>
                {active ? <CircleCheck size={18} /> : null}
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="tactile w-full p-4 bg-[#f9f8f6] text-black/50 font-bold text-xs uppercase tracking-widest"
        >
          Close
        </button>
      </div>
    </ModalOverlay>
  );
}
