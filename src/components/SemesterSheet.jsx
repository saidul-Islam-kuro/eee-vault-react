import { CircleCheck } from "lucide-react";
import ModalOverlay from "./ModalOverlay";
import { SEMESTERS } from "../lib/vault";

export default function SemesterSheet({ open, onClose, value, onChange }) {
  return (
    <ModalOverlay open={open} onClose={onClose} align="center">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden animate-pop-in"
      >
        <div className="p-6 text-center border-b border-slate-50">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Select Semester</h3>
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
                  active ? "bg-red-600 text-white shadow-lg" : "hover:bg-slate-50 text-slate-600 font-bold"
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
          className="tactile w-full p-4 bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-widest"
        >
          Close
        </button>
      </div>
    </ModalOverlay>
  );
}
