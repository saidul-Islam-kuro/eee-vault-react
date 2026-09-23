import { Brain, Plus } from "lucide-react";

export default function TopBar({ onAddPaper }) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-white/10 bg-[#191919] px-4 text-white shadow-[0_18px_40px_-22px_rgba(0,0,0,0.7)]"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)", paddingBottom: "1rem" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Brain className="text-[#e63939]" size={24} strokeWidth={2.2} />
            <h1 className="text-xl font-black uppercase leading-none tracking-tighter text-white">
              EEE <span className="text-[#e63939]">VAULT</span>
            </h1>
          </div>
          <p className="mt-1 w-full text-center text-[9px] font-bold uppercase tracking-[0.4em] text-white/60">
            JSTU
          </p>
        </div>
        <button
          onClick={onAddPaper}
          className="tactile flex items-center gap-1 rounded-full bg-[#e63939] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_22px_-12px_rgba(230,57,57,0.8)]"
        >
          <Plus size={15} strokeWidth={3} /> Add Paper
        </button>
      </div>
    </header>
  );
}
