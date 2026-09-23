import { useMemo, useState } from "react";
import { Search, BookOpen, Download, CloudDownload } from "lucide-react";
import { useVaultDataContext } from "../context/VaultDataContext";
import { triggerDownload } from "../lib/vault";
import ConfirmDialog from "../components/ConfirmDialog";
import { useConfirmDialog } from "../hooks/useConfirmDialog";

export default function Library() {
  const { libraryData, status } = useVaultDataContext();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const confirmDialog = useConfirmDialog();

  const categories = useMemo(() => {
    const set = new Set(libraryData.map((b) => b.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [libraryData]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return libraryData.filter(
      (b) =>
        (category === "all" || b.category === category) &&
        (b.title.toLowerCase().includes(q) || (b.author || "").toLowerCase().includes(q))
    );
  }, [libraryData, query, category]);

  function requestDownload(book) {
    confirmDialog.ask({
      icon: CloudDownload,
      title: "Download?",
      message: `${book.title}${book.edition ? ` — ${book.edition}` : ""}`,
      confirmLabel: "Download",
      confirmTone: "red",
      onConfirm: () => {
        confirmDialog.close();
        triggerDownload(book.url, `${book.title}.pdf`);
      },
    });
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-black text-black uppercase tracking-tighter">E-Book Library</h2>
        <p className="text-black/60 text-xs font-bold uppercase">Engineering References</p>
      </div>

      <div className="glass-card p-4 rounded-3xl shadow-[0_18px_40px_-30px_rgba(0,0,0,0.42)] mb-6 border border-black/5 bg-white/90">
        <div className="relative mb-3">
          <Search className="absolute left-4 top-3.5 text-black/45" size={16} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search textbook title or author..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#f9f8f6] border border-black/5 outline-none focus:border-[#d92a2a] text-sm transition-colors text-black"
          />
        </div>
        {categories.length > 2 && (
          <div className="scroll-x-snap no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`tactile shrink-0 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                  category === c
                    ? "bg-[#d92a2a] border-[#d92a2a] text-white"
                    : "bg-white border-black/5 text-black/60"
                }`}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
        )}
      </div>

      {status === "loading" && <div className="text-center text-black/50 text-sm py-16">Loading library…</div>}
      {status === "ready" && filtered.length === 0 && (
        <div className="text-center text-black/50 text-sm py-16">No reference books found.</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((book) => (
          <button
            key={book.id || book.url}
            onClick={() => requestDownload(book)}
            className="tactile-card file-card bg-[#f9f8f6] border border-black/5 rounded-2xl p-4 text-center flex flex-col items-center shadow-[0_10px_25px_-20px_rgba(0,0,0,0.5)]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff3f3] border border-[#f6d7d7] flex items-center justify-center mb-3">
              <BookOpen className="text-[#d92a2a]" size={22} />
            </div>
            <span className="text-[11px] font-bold text-black line-clamp-2">{book.title}</span>
            <span className="text-[9px] text-black/50 mt-1 uppercase font-black tracking-wider truncate max-w-full">
              {book.author || "Reference"}
            </span>
            <span className="mt-3 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#a61414]">
              <Download size={11} /> Download
            </span>
          </button>
        ))}
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.confirm}
        {...(confirmDialog.config || {})}
      />
    </>
  );
}
