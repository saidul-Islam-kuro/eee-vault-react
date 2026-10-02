import { ArrowLeft, Brain, Heart, UserRound, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppNavigate } from "../hooks/useAppNavigate";

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
    image: "/salmanvai.jpg",
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
    <article className={`group relative overflow-hidden bg-white ${member.featured ? "grid md:grid-cols-[minmax(220px,0.62fr)_1.38fr]" : ""}`}>
      <div className={`relative overflow-hidden ${member.featured ? "min-h-[220px] md:min-h-[280px]" : "aspect-[5/4]"}`}>
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
  const navigate = useAppNavigate();

  return (
    <div className="page-shell mx-auto max-w-5xl text-[#191716]">
      <Link
        to="/"
        onClick={(event) => {
          event.preventDefault();
          navigate("/");
        }}
        className="tactile mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-black/75 shadow-sm hover:text-[#d92a2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d92a2a]"
      >
        <ArrowLeft size={16} /> Home
      </Link>

      <header className="overflow-hidden rounded-[26px] bg-[#211d1b] text-white shadow-[0_24px_58px_-36px_rgba(0,0,0,0.65)]">
        <div
          className="relative flex min-h-[170px] items-center justify-center overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_center,_rgba(217,42,42,0.2),_transparent_48%),linear-gradient(115deg,#141313,#29211f_52%,#151313)] md:min-h-[220px]"
          role="img"
          aria-label="Abstract electrical circuit graphic representing EEE Vault"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 280"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            fill="none"
          >
            <g stroke="#d7bd82" strokeOpacity=".42" strokeWidth="1.5">
              <path d="M0 70h205l42 42h167m-414 98h168l46-46h200M1200 70H995l-42 42H786m414 98h-168l-46-46H786" />
              <path d="M0 140h300m900 0H900" stroke="#ed5149" strokeOpacity=".6" />
              <circle cx="205" cy="70" r="4" fill="#d7bd82" />
              <circle cx="167" cy="210" r="4" fill="#d7bd82" />
              <circle cx="995" cy="70" r="4" fill="#d7bd82" />
              <circle cx="1033" cy="210" r="4" fill="#d7bd82" />
              <circle cx="300" cy="140" r="4" fill="#ed5149" />
              <circle cx="900" cy="140" r="4" fill="#ed5149" />
            </g>
            <circle cx="600" cy="140" r="82" stroke="#d7bd82" strokeOpacity=".22" />
            <circle cx="600" cy="140" r="64" stroke="#d7bd82" strokeOpacity=".65" strokeWidth="1.5" />
            <circle cx="600" cy="140" r="52" fill="#211d1b" stroke="#ed5149" strokeOpacity=".6" />
          </svg>
          <Brain
            aria-hidden="true"
            size={48}
            strokeWidth={1.8}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ed5149]"
          />
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

      <section className="relative mt-10 overflow-hidden rounded-[28px] border border-[#c7a96b]/35 bg-[#211d1b] px-6 py-10 text-center text-white shadow-[0_26px_60px_-34px_rgba(0,0,0,0.7)] md:px-12 md:py-14" aria-labelledby="tribute-heading">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d7bd82] to-transparent" />
          <div className="absolute -left-28 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-[#d7bd82]/40" />
          <div className="absolute -right-28 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-[#d7bd82]/40" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-[#e1c98f]">WITH EARNEST GRATITUDE</p>
          <div className="mx-auto mt-6 h-36 w-36 rounded-full border border-[#d7bd82] p-1.5 shadow-[0_0_0_8px_rgba(215,189,130,0.08)] md:h-40 md:w-40">
            <img
              src="/MD.%20Shizer%20Rahman.jpg"
              alt="MD. Shizer Rahman"
              className="h-full w-full rounded-full object-cover object-center"
            />
          </div>
          <h2 id="tribute-heading" className="mt-7 text-3xl font-black tracking-[-0.045em] md:text-4xl">
            A tribute to our teacher
          </h2>
          <p className="mt-3 text-xl font-semibold text-[#e1c98f]">MD. Shizer Rahman</p>
          <p className="mt-2 text-sm font-medium leading-6 text-white/75">
            Chairman, Department of Electrical and Electronic Engineering
          </p>
          <div className="mx-auto mt-5 h-px w-16 bg-[#d7bd82]/70" />
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/75 md:text-base">
            Our heartfelt thanks to Sir for his guidance and generous support. Without his help, this project would not have been successful.
          </p>
        </div>
      </section>

      

      <section className="mt-10" aria-labelledby="honourable-heading">
        <div className="mb-4 flex items-center gap-3">
          <Heart size={18} className="shrink-0 text-[#b51f1f]" />
          <h2 id="honourable-heading" className="text-2xl font-black tracking-[-0.05em] text-black">Honourable mentions</h2>
        </div>
        <p className="mb-4 text-sm text-black/55">With thanks for being part of the work behind EEE Vault.</p>
        <ul className="divide-y divide-black/10 border-y border-black/10">
          {[ {name: "Mohiuddin Rifat", batch: "EEE · Batch 04", note: "Provided Initial Resources"},
            { name: "Abdullah Al Minhaz", batch: "EEE · Batch 03", note: "Helped Publishing the App"},
            { name: "Tanvir Ahmed", batch: "EEE · Batch 02", note: "Provided valuable feedback"},
            { name: "Sabbir Khandakar Saykat", batch: "EEE · Batch 04", note: "Assisted with Resources"},
            { name: "Dhruvo Acharjee", batch: "EEE · Batch 05", note: "Assisted with resources" },
          ].map((member) => (
            <li key={member.name} className="flex flex-wrap items-center justify-between gap-2 py-4">
              <div>
                <span className="font-bold text-black">{member.name}</span>
                <p className="mt-1 text-sm text-black/55">{member.batch}</p>
                {member.note && <p className="mt-1 text-sm text-black/65">{member.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-8 border-t border-black/10 py-8 text-center text-sm text-black/55">
        Made possible by a team that believes good resources should be shared.
      </footer>
    </div>
  );
}
