import { Brain, Plus } from "lucide-react";

export default function TopBar({ onAddPaper }) {
  return (
    <header
      className="bg-black text-white shadow-xl border-b border-red-900/30 sticky top-0 z-40 px-4"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)", paddingBottom: "1rem" }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Brain className="text-red-600" size={24} strokeWidth={2.2} />
            <h1 className="font-black text-xl tracking-tighter uppercase leading-none">
              EEE <span className="text-red-600">VAULT</span>
            </h1>
          </div>
          <p className="text-[9px] font-bold tracking-[0.4em] text-slate-400 uppercase mt-1 text-center w-full">
            JSTU
          </p>
        </div>
        <button
          onClick={onAddPaper}
          className="tactile bg-red-600 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center gap-1"
        >
          <Plus size={15} strokeWidth={3} /> Add Paper
        </button>
      </div>
    </header>
  );
}
