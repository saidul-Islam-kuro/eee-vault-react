import { ArrowLeft, Camera, Heart, UserRound, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const CORE_TEAM = [
  {
    name: "Saiful Islam",
    role: "Main director",
    batch: "EEE · Batch 02",
    image: "saiful islam irfan.jpeg",
    bio: "Guided the vision for EEE Vault and helped bring the team together around one shared goal: making study resources easier to reach.",
    note: "A shared resource can make the path through engineering a little easier for every student.",
    featured: true,
  },
  {
    name: "Alim Hossain Salman",
    role: "Team lead",
    batch: "EEE · Batch 03",
    bio: "Helped lead the team and keep the work moving toward a resource students can use in their everyday studies.",
    note: "The best part is knowing these resources can help the next student who needs them.",
  },
  {
    name: "Saidul Islam",
    role: "Developer & UI/UX designer",
    batch: "EEE · Batch 06",
    image: "/WhatsApp%20Image%202026-04-15%20at%205.51.10%20PM.jpeg",
    bio: "Designed and developed EEE Vault to bring papers, notes, classes, and references together in one approachable place.",
    note: "I made EEE Vault so we can spend less time searching for resources and more time learning from them.",
  },
];

function Portrait({ member, className = "" }) {
  return (
    <div className={`relative overflow-hidden bg-[#e8e4dd] ${className}`}>
      {member.image ? (
        <img
          src={member.image}
          alt={`Portrait of ${member.name}`}
          className="h-full w-full object-cover object-center"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,#eeeae4,#dedbd5)] text-[#726c64]"
          role="img"
          aria-label={`Photo placeholder for ${member.name}`}
        >
          <UserRound size={40} strokeWidth={1.3} aria-hidden="true" />
          <span className="text-[11px] font-semibold">Portrait coming soon</span>
        </div>
      )}
    </div>
  );
}

function Profile({ member }) {
  return (
    <article className={`group relative overflow-hidden bg-white ${member.featured ? "grid md:grid-cols-[0.92fr_1.08fr]" : ""}`}>
      <div className={`relative overflow-hidden ${member.featured ? "min-h-[280px] md:min-h-[360px]" : "aspect-[5/4]"}`}>
        <Portrait member={member} className="h-full w-full transition duration-500 group-hover:scale-[1.025]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className={`relative flex flex-col p-5 md:p-7 ${member.featured ? "md:justify-center md:p-9" : ""}`}>
        <span className="absolute left-5 top-0 h-1 w-12 bg-[#d92a2a] md:left-7" />
        <p className="pt-2 text-sm font-bold text-[#b51f1f]">{member.role}</p>
        <h3 className="mt-2 text-2xl font-black leading-tight tracking-[-0.045em] text-black">{member.name}</h3>
        <p className="mt-1 text-sm font-medium text-black/55">{member.batch}</p>
        <p className="mt-5 text-sm leading-6 text-black/70">{member.bio}</p>
        <blockquote className="mt-5 border-l-2 border-[#d92a2a] bg-[#faf7f4] py-3 pl-4 pr-3 text-sm italic leading-6 text-black/70">
          “{member.note}”
        </blockquote>
      </div>
    </article>
  );
}

function SectionTitle({ children, note }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-black/10 pb-3">
      <h2 className="text-2xl font-black tracking-[-0.05em] text-[#191716]">{children}</h2>
      {note && <p className="text-sm text-black/50">{note}</p>}
    </div>
  );
}

export default function BehindTheApp() {
  return (
    <div className="page-shell mx-auto max-w-5xl text-[#191716]">
      <Link
        to="/"
        className="tactile mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-black/75 shadow-sm hover:text-[#d92a2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d92a2a]"
      >
        <ArrowLeft size={16} /> Home
      </Link>

      <header className="overflow-hidden rounded-[26px] bg-[#211d1b] text-white shadow-[0_24px_58px_-36px_rgba(0,0,0,0.65)]">
        <div
          className="relative flex min-h-[190px] items-center justify-center overflow-hidden border-b border-white/10 px-5 py-10 text-center md:min-h-[250px]"
          role="img"
          aria-label="Placeholder for a group photo of the EEE Vault team"
        >
          <div className="absolute inset-0 opacity-25" aria-hidden="true">
            <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-white/35" />
            <div className="absolute -left-10 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full border border-white/35" />
            <div className="absolute right-0 top-0 h-full w-1/2 bg-[linear-gradient(135deg,transparent_45%,rgba(217,42,42,0.72)_45%,rgba(217,42,42,0.72)_62%,transparent_62%)]" />
          </div>
          <div className="relative flex flex-col items-center">
            <Camera size={26} strokeWidth={1.5} className="text-white/80" />
            <p className="mt-3 text-sm font-semibold">Team portrait</p>
            <p className="mt-1 text-xs text-white/55">Group photo placeholder</p>
          </div>
        </div>
        <div className="grid gap-5 px-6 py-7 md:grid-cols-[1fr_auto] md:items-end md:px-10 md:py-9">
          <div>
            <div className="flex items-center gap-2 text-[#ff8a81]">
              <UsersRound size={16} />
              <span className="text-sm font-semibold">EEE Vault · JSTU</span>
            </div>
            <h1 className="mt-3 text-4xl font-black leading-none tracking-[-0.06em] md:text-6xl">Behind the app</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 md:text-base">
              Meet the people who helped bring a shared study resource to life.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-white/65">
            <span className="h-2 w-2 rounded-full bg-[#ed5149]" />
            Built by EEE students
          </div>
        </div>
      </header>

      <section className="mt-10" aria-labelledby="core-team-heading">
        <SectionTitle note="Vision, leadership, design & development">The core team</SectionTitle>
        <div className="overflow-hidden rounded-[26px] border border-black/[0.08] bg-white shadow-[0_24px_54px_-34px_rgba(0,0,0,0.42)] ring-1 ring-white">
          <Profile member={CORE_TEAM[0]} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {CORE_TEAM.slice(1).map((member) => (
            <div key={member.name} className="overflow-hidden rounded-[24px] border border-black/[0.08] bg-white shadow-[0_20px_48px_-34px_rgba(0,0,0,0.48)] ring-1 ring-white">
              <Profile member={member} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="production-heading">
        <SectionTitle note="EEE · 3rd batch">Production aid</SectionTitle>
        <div className="grid max-w-2xl overflow-hidden rounded-[22px] border border-black/[0.08] bg-white shadow-[0_18px_44px_-36px_rgba(0,0,0,0.55)] sm:grid-cols-[200px_1fr]">
          <Portrait member={{ name: "Abdullah Al Minhaz" }} className="aspect-[5/3] sm:aspect-auto sm:min-h-[170px]" />
          <div className="flex items-center p-5 md:p-7">
            <div>
              <p className="text-sm font-bold text-[#b51f1f]">Production aid</p>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.045em]">Abdullah Al Minhaz</h3>
              <p className="mt-1 text-sm text-black/55">EEE · 3rd batch</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="resources-heading">
        <div className="overflow-hidden rounded-[24px] bg-[#b51f1f] p-1 shadow-[0_20px_46px_-30px_rgba(130,20,20,0.55)]">
          <div className="rounded-t-[21px] bg-[#211d1b] px-6 py-6 text-white md:px-8">
            <div className="flex items-center gap-2 text-[#ff8a81]">
              <UsersRound size={18} />
              <span className="text-sm font-semibold">Collecting and organizing study materials</span>
            </div>
            <h2 id="resources-heading" className="mt-3 text-2xl font-black tracking-[-0.05em]">Resource management</h2>
          </div>
          <div className="grid gap-3 bg-[#b51f1f] p-3 sm:grid-cols-2 md:p-4">
            {[
              { name: "Mohiuddin Rifat", batch: "EEE · Batch 04" },
              { name: "Dhruvo Acharjee", batch: "EEE · Batch 05" },
            ].map((member) => (
              <div key={member.name} className="rounded-[16px] bg-white px-5 py-5 shadow-[0_8px_20px_-16px_rgba(0,0,0,0.55)]">
                <p className="text-lg font-bold text-black">{member.name}</p>
                <p className="mt-1 text-sm text-black/55">{member.batch}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="honourable-heading">
        <div className="mb-4 flex items-center gap-3">
          <Heart size={18} className="shrink-0 text-[#b51f1f]" />
          <h2 id="honourable-heading" className="text-2xl font-black tracking-[-0.05em] text-black">Honourable mentions</h2>
        </div>
        <p className="mb-4 text-sm text-black/55">With thanks for being part of the work behind EEE Vault.</p>
        <ul className="divide-y divide-black/10 border-y border-black/10">
          <li className="flex flex-wrap items-center justify-between gap-2 py-4">
            <div>
              <span className="font-bold text-black">Tanvir Ahmed</span>
              <p className="mt-1 text-sm text-black/55">EEE · Batch 02</p>
            </div>
          </li>
          <li className="flex flex-wrap items-center justify-between gap-2 py-4">
            <span className="font-bold text-black">Sabbir Khandakar Saykat</span>
            <span className="text-sm text-black/55">EEE · Batch 04</span>
          </li>
        </ul>
      </section>

      <footer className="mt-8 border-t border-black/10 py-8 text-center text-sm text-black/55">
        Made possible by a team that believes good resources should be shared.
      </footer>
    </div>
  );
}
