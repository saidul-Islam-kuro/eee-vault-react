import { useMemo, useState } from "react";
import { Search, ChevronDown, FileText, Download, CloudDownload, Inbox } from "lucide-react";
import { useVaultDataContext } from "../context/VaultDataContext";
import { SEMESTERS, triggerDownload } from "../lib/vault";
import SemesterSheet from "../components/SemesterSheet";
import ConfirmDialog from "../components/ConfirmDialog";
import { useConfirmDialog } from "../hooks/useConfirmDialog";

export default function Notes() {
  const { courseData, status } = useVaultDataContext();
  const [query, setQuery] = useState("");
  const [semValue, setSemValue] = useState("all");
  const [semLabel, setSemLabel] = useState("All Semesters");
  const [semSheetOpen, setSemSheetOpen] = useState(false);
  const confirmDialog = useConfirmDialog();

  const groups = useMemo(() => {
    const q = query.toLowerCase();
    const matches = (course) => {
      const inTitle = course.title.toLowerCase().includes(q) || course.code.toLowerCase().includes(q);
      const inNotes = (course.notes || []).some((n) => n.name.toLowerCase().includes(q));
      return q === "" || inTitle || inNotes;
    };

    const semesterOrder = SEMESTERS.filter((s) => s.value !== "all" && (semValue === "all" || s.value === semValue));

    return semesterOrder
      .map((s) => ({
        ...s,
        courses: courseData.filter((c) => c.semester === s.value && matches(c)),
      }))
      .filter((g) => g.courses.length > 0);
  }, [courseData, query, semValue]);

  function requestDownload(note) {
    confirmDialog.ask({
      icon: CloudDownload,
      title: "Download?",
      message: note.name,
      confirmLabel: "Download",
      confirmTone: "red",
      onConfirm: () => triggerDownload(note.url, `${note.name}.pdf`),
    });
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Notes &amp; Materials</h2>
        <p className="text-slate-500 text-xs font-bold uppercase">Slides &amp; Hand Notes per Course</p>
      </div>

      <div className="glass-card p-6 rounded-3xl shadow-sm mb-6 border border-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search course or note name..."
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

      {status === "loading" && <div className="text-center text-slate-400 text-sm py-16">Loading notes…</div>}
      {status === "ready" && groups.length === 0 && (
        <div className="text-center text-slate-400 text-sm py-16">No notes match that search.</div>
      )}

      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <section key={group.value}>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[2px] w-4 bg-red-600 rounded-full" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{group.label}</h3>
            </div>
            <div className="flex flex-col gap-4">
              {group.courses.map((course) => {
                const hasNotes = course.notes && course.notes.length > 0;
                return (
                  <div key={course.code} className="glass-card p-5 rounded-3xl shadow-sm border border-white">
                    <div className="mb-3">
                      <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase border border-red-100">
                        {course.code}
                      </span>
                      <h4 className="text-base font-bold text-slate-800 leading-tight mt-1">{course.title}</h4>
                    </div>
                    {hasNotes ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {course.notes.map((note) => (
                          <button
                            key={note.url}
                            onClick={() => requestDownload(note)}
                            className="tactile-card bg-amber-50/60 border border-amber-200 rounded-2xl p-3 text-center flex flex-col items-center"
                          >
                            <FileText className="text-amber-600 mb-2" size={22} />
                            <span className="text-[10px] font-bold text-slate-700 line-clamp-2">{note.name}</span>
                            <span className="mt-2 inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-amber-700">
                              <Download size={10} /> Download
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-50 border border-slate-100 rounded-2xl p-3">
                        <Inbox size={16} />
                        No notes uploaded for this course yet.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
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

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.confirm}
        {...(confirmDialog.config || {})}
      />
    </>
  );
}
