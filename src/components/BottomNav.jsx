import { NavLink } from "react-router-dom";
import { Home, Library, NotebookText, PlaySquare, Vault as VaultIcon } from "lucide-react";

const TABS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/vault", label: "Vault", icon: VaultIcon, end: false },
  { to: "/videos", label: "Classes", icon: PlaySquare, end: false },
  { to: "/notes", label: "Notes", icon: NotebookText, end: false },
  { to: "/library", label: "Library", icon: Library, end: false },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#191919]/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-6xl items-stretch justify-around px-2">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="group relative flex-1 px-2 py-2.5"
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center justify-center gap-1">
                <span
                  className={`flex items-center justify-center rounded-2xl transition-all duration-300 ease-out ${
                    isActive
                      ? "bg-[#e63939]/15 px-4 py-1.5 shadow-[0_10px_18px_-12px_rgba(230,57,57,0.8)] animate-tab-pop"
                      : "px-4 py-1 text-white/60"
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.4 : 2}
                    className={`transition-all duration-300 ease-out ${
                      isActive ? "text-[#e63939] scale-[1.04]" : "text-white/60"
                    }`}
                  />
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide transition-all duration-300 ease-out ${
                    isActive ? "text-white" : "text-white/60"
                  }`}
                >
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
