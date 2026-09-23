import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import CourseCard from "../components/CourseCard";
import SemesterSheet from "../components/SemesterSheet";
import { useVaultDataContext } from "../context/VaultDataContext";
import { slugify } from "../lib/vault";

const getStoredVaultState = () => ({
  query: sessionStorage.getItem("vault.query") || "",
  semValue: sessionStorage.getItem("vault.semValue") || "all",
  semLabel: sessionStorage.getItem("vault.semLabel") || "All Semesters",
});

export default function Vault() {
  const { courseData, status } = useVaultDataContext();
  const { openUpload } = useOutletContext();
  const navigate = useNavigate();

  const initialState = getStoredVaultState();
  const [query, setQuery] = useState(initialState.query);
  const [semValue, setSemValue] = useState(initialState.semValue);
  const [semLabel, setSemLabel] = useState(initialState.semLabel);
  const [semSheetOpen, setSemSheetOpen] = useState(false);

  const saveVaultScroll = () => {
    sessionStorage.setItem("vaultScroll", String(window.scrollY || 0));
  };

  useEffect(() => {
    sessionStorage.setItem("vault.query", query);
  }, [query]);

  useEffect(() => {
    sessionStorage.setItem("vault.semValue", semValue);
    sessionStorage.setItem("vault.semLabel", semLabel);
  }, [semValue, semLabel]);

  useEffect(() => {
    if (status !== "ready") return;

    const savedScroll = Number(sessionStorage.getItem("vaultScroll") || 0);

    if (!Number.isFinite(savedScroll) || savedScroll <= 0) return;

    const restoreScroll = () => {
      window.scrollTo({ top: savedScroll, left: 0, behavior: "auto" });
    };

    requestAnimationFrame(restoreScroll);
    const timeoutId = window.setTimeout(restoreScroll, 150);

    return () => window.clearTimeout(timeoutId);
  }, [status]);

  useEffect(() => {
    const handleScroll = () => {
      saveVaultScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-black/65">
          Question Bank
        </div>
        <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-black">Vault</h2>
        <p className="mt-1 text-sm text-black/65">Browse papers by course, semester, and batch.</p>
      </div>

      <div className="glass-card mb-8 rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.42)]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-black/45" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or course code..."
              className="w-full rounded-2xl border border-black/5 bg-[#f9f8f6] py-3 pl-12 pr-4 text-sm text-black outline-none transition focus:border-[#d92a2a]"
            />
          </div>
          <button
            onClick={() => setSemSheetOpen(true)}
            className="tactile flex items-center justify-between rounded-2xl border border-black/5 bg-[#f9f8f6] p-4"
          >
            <span className="truncate text-sm font-bold text-black">{semLabel}</span>
            <ChevronDown className="ml-1 shrink-0 text-black/70" size={18} />
          </button>
        </div>
      </div>

      {status === "loading" && (
        <div className="py-16 text-center text-sm text-black/55">Loading course archive…</div>
      )}
      {status === "error" && (
        <div className="py-16 text-center text-sm text-[#d92a2a]">Couldn't load the vault data. Pull to refresh.</div>
      )}
      {status === "ready" && filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-black/55">No courses match that search.</div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {filtered.map((course, index) => (
          <CourseCard
            key={course.code}
            course={course}
            index={index}
            onMissing={openUpload}
            onOpenPaper={(c, batch) => {
              saveVaultScroll();
              sessionStorage.setItem("vault.query", query);
              sessionStorage.setItem("vault.semValue", semValue);
              sessionStorage.setItem("vault.semLabel", semLabel);
              navigate(`/viewer/${slugify(c.code)}/${slugify(batch)}`);
            }}
          />
        ))}
      </div>

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
