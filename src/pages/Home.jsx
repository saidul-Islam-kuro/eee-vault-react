import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import CourseCard from "../components/CourseCard";
import SemesterSheet from "../components/SemesterSheet";
import { useVaultDataContext } from "../context/VaultDataContext";
import { slugify } from "../lib/vault";

export default function Home() {
  const { courseData, status } = useVaultDataContext();
  const { openUpload } = useOutletContext();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [semValue, setSemValue] = useState("all");
  const [semLabel, setSemLabel] = useState("All Semesters");
  const [semSheetOpen, setSemSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return courseData.filter(
      (c) =>
        (c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) &&
        (semValue === "all" || c.semester === semValue)
    );
  }, [courseData, query, semValue]);

  return (
    <>
      <div className="glass-card p-6 rounded-3xl shadow-sm mb-8 border border-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Title or Code..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-slate-100 outline-none text-sm"
            />
          </div>
          <button
            onClick={() => setSemSheetOpen(true)}
            className="tactile flex items-center justify-between bg-slate-100 p-4 rounded-2xl"
          >
            <span className="font-bold text-slate-800 text-sm truncate">{semLabel}</span>
            <ChevronDown className="text-slate-400 shrink-0 ml-1" size={18} />
          </button>
        </div>
      </div>

      {status === "loading" && (
        <div className="text-center text-slate-400 text-sm py-16">Loading course archive…</div>
      )}
      {status === "error" && (
        <div className="text-center text-red-500 text-sm py-16">Couldn't load the vault data. Pull to refresh.</div>
      )}
      {status === "ready" && filtered.length === 0 && (
        <div className="text-center text-slate-400 text-sm py-16">No courses match that search.</div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {filtered.map((course) => (
          <CourseCard
            key={course.code}
            course={course}
            onMissing={openUpload}
            onOpenPaper={(c, batch) => navigate(`/viewer/${slugify(c.code)}/${slugify(batch)}`)}
          />
        ))}
      </div>

      <footer className="w-full py-12 mt-10 border-t border-slate-200">
        <div className="flex flex-col items-center justify-center">
          <div className="w-8 h-[2px] bg-red-600 rounded-full mb-4" />
          <p className="text-[10px] tracking-[0.3em] text-slate-400 font-black uppercase mb-1">
            Developed &amp; Maintained by
          </p>
          <h4 className="text-lg font-black tracking-tighter text-slate-800">
            SAIDUL ISLAM <span className="text-red-600">KURO</span>
          </h4>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-[1px] w-4 bg-slate-300" />
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">JSTU • EEE BATCH 06</p>
            <span className="h-[1px] w-4 bg-slate-300" />
          </div>
          <p className="text-[10px] text-slate-400 mt-6 italic">© 2026 EEE Vault JSTU</p>
        </div>
      </footer>

      <SemesterSheet
        open={semSheetOpen}
        onClose={() => setSemSheetOpen(false)}
        value={semValue}
        onChange={(val, label) => {
          setSemValue(val);
          setSemLabel(label);
        }}
      />
    </>
  );
}
