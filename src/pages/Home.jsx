import { ArrowRight, BookOpen, FileText, Library, NotebookPen } from "lucide-react";
import { Link } from "react-router-dom";

const DIRECTORY_ITEMS = [
  {
    to: "/vault",
    label: "Vault",
    caption: "Course papers & question banks",
    icon: FileText,
    accent: "from-[#d92a2a] to-[#a61414]",
  },
  {
    to: "/notes",
    label: "Notes",
    caption: "Lecture notes & study guides",
    icon: NotebookPen,
    accent: "from-[#2f2f2f] to-[#171717]",
  },
  {
    to: "/library",
    label: "Library",
    caption: "Reference books & e-resources",
    icon: Library,
    accent: "from-[#4b4b4b] to-[#212121]",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden rounded-[32px] border border-black/5 bg-[radial-gradient(circle_at_top_left,_rgba(217,42,42,0.10),_transparent_36%),linear-gradient(135deg,#ffffff_0%,#f7f5f2_45%,#f1efe9_100%)] p-6 shadow-[0_22px_60px_-34px_rgba(0,0,0,0.6)] md:p-8">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(217,42,42,0.06),_transparent_50%)] md:block" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-black/65">
            EEE Study Hub
          </div>

          <h1 className="mt-5 text-4xl font-black leading-none tracking-[-0.06em] text-black md:text-6xl">
            Learn smarter.<br />
            <span className="text-[#d92a2a]">Find faster.</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-black/70 md:text-lg">
            A focused academic directory for engineering students — from past exam papers to notes, references, and everything in between.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/vault"
              className="tactile inline-flex items-center gap-2 rounded-full bg-[#171717] px-5 py-3 text-sm font-bold text-white shadow-[0_16px_32px_-18px_rgba(0,0,0,0.7)]"
            >
              Open Vault <ArrowRight size={16} />
            </Link>
            <div className="rounded-full border border-black/5 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black/65">
              JSTU • EEE
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-[-0.04em] text-black">Explore</h2>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/50">Directory</span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {DIRECTORY_ITEMS.map(({ to, label, caption, icon: Icon, accent }) => (
            <Link
              key={to}
              to={to}
              className="group relative overflow-hidden rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-28px_rgba(0,0,0,0.6)]"
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`} />
              <div className="flex h-full flex-col">
                <div className={`mb-4 inline-flex w-fit rounded-2xl bg-gradient-to-br ${accent} p-3 text-white`}>
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-black tracking-[-0.04em] text-black">{label}</h3>
                  <ArrowRight size={18} className="text-black/60 transition group-hover:translate-x-1" />
                </div>
                <p className="mt-2 text-sm leading-6 text-black/65">{caption}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-10 border-t border-black/5 py-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 h-[2px] w-10 rounded-full bg-[#d92a2a]" />
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/60">Built for Study</p>
          <div className="mt-2 flex items-center gap-3">
            <BookOpen size={16} className="text-[#d92a2a]" />
            <p className="text-sm font-semibold text-black">EEE Vault JSTU</p>
          </div>
        </div>
      </footer>
    </>
  );
}
