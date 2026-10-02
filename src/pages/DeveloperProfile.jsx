import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/saidul-Islam-kuro", icon: Code2 },
  { label: "Portfolio", href: "https://saidul-islam-portofolio.vercel.app/", icon: BriefcaseBusiness },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/saidul-islam-kuro/?isSelfProfile=true", icon: ArrowUpRight },
];

const CONTACT_LINKS = [
  { label: "Email", value: "saidulkuro@gmail.com", href: "mailto:saidulkuro@gmail.com", icon: Mail },
  { label: "Phone", value: "01647843565", href: "tel:+8801647843565", icon: Phone },
  { label: "WhatsApp", value: "Message me", href: "https://wa.me/8801517816127", icon: Phone },
];

export default function DeveloperProfile() {
  return (
    <div className="page-shell mx-auto max-w-4xl">
      <Link to="/" replace className="tactile mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-black/75 shadow-sm hover:text-[#d92a2a]">
        <ArrowLeft size={16} /> Home
      </Link>

      <section className="relative overflow-hidden rounded-[28px] border border-black/5 bg-[radial-gradient(circle_at_top_left,_rgba(217,42,42,0.12),_transparent_38%),linear-gradient(135deg,#ffffff_0%,#f7f5f2_52%,#f1efe9_100%)] p-6 shadow-[0_22px_60px_-34px_rgba(0,0,0,0.55)] md:p-10">
        <div className="grid items-center gap-8 md:grid-cols-[220px_1fr] md:gap-10">
          <div className="relative mx-auto w-full max-w-[220px]">
            <div className="absolute -inset-2 rotate-3 rounded-[26px] border border-[#d92a2a]/20" />
            <img
              src="/WhatsApp%20Image%202026-04-15%20at%205.51.10%20PM.jpeg"
              alt="Saidul Islam"
              className="relative aspect-[4/5] w-full rounded-[22px] border-4 border-white object-cover shadow-[0_20px_40px_-22px_rgba(0,0,0,0.55)]"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d92a2a]/15 bg-[#fff3f3] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#b51f1f]">
              <UserRound size={13} /> About the developer
            </div>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.05em] text-[#171717] md:text-5xl">
              Saidul Islam
            </h1>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-[#d92a2a]">EEE Student · Session 2024–2025 · Batch 06</p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-black/70 md:text-base">
              I’m Saidul, an Electrical and Electronic Engineering student who enjoys building practical tools that make everyday study a little easier. I created EEE Study Hub to bring class videos, notes, reference books, and past papers together in one simple place, so students can spend less time searching and more time learning. The idea grew from a familiar need among classmates: useful resources are better when they’re easy to find and shared with everyone.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="tactile inline-flex items-center gap-2 rounded-full bg-[#171717] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#d92a2a]"
                >
                  <Icon size={15} /> {label} <ArrowUpRight size={13} className="text-white/65" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[22px] border border-black/5 bg-white p-5 shadow-[0_16px_36px_-30px_rgba(0,0,0,0.45)] md:p-6">
          <h2 className="flex items-center gap-2 text-base font-black text-black"><GraduationCap size={19} className="text-[#d92a2a]" /> Academic details</h2>
          <dl className="mt-4 divide-y divide-black/5">
            <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-black/55">Department</dt><dd className="text-right font-semibold">EEE</dd></div>
            <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-black/55">Session</dt><dd className="text-right font-semibold">2024–2025</dd></div>
            <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-black/55">Batch</dt><dd className="text-right font-semibold">06</dd></div>
            <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-black/55">Student ID</dt><dd className="text-right font-semibold">25010630</dd></div>
          </dl>
        </div>

        <div className="rounded-[22px] border border-black/5 bg-white p-5 shadow-[0_16px_36px_-30px_rgba(0,0,0,0.45)] md:p-6">
          <h2 className="flex items-center gap-2 text-base font-black text-black"><BookOpen size={18} className="text-[#d92a2a]" /> Contact</h2>
          <div className="mt-3">
            {CONTACT_LINKS.map(({ label, value, href, icon: Icon }) => (
              <a key={label} href={href} target={label === "WhatsApp" ? "_blank" : undefined} rel={label === "WhatsApp" ? "noreferrer" : undefined} className="group flex items-center gap-3 border-b border-black/5 py-3 last:border-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f6f4f1] text-[#d92a2a] transition group-hover:bg-[#fff0f0]"><Icon size={16} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-black uppercase tracking-[0.15em] text-black/45">{label}</span>
                  <span className="block truncate text-sm font-semibold text-black group-hover:text-[#b51f1f]">{value}</span>
                </span>
                <ArrowUpRight size={15} className="shrink-0 text-black/35" />
              </a>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-black/5 pt-4 text-sm text-black/65"><MapPin size={16} className="shrink-0 text-[#d92a2a]" /> Home district: Chandpur</div>
        </div>
      </section>
    </div>
  );
}