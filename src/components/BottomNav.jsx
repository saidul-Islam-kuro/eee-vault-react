import { NavLink } from "react-router-dom";
import { Home, NotebookText, Library } from "lucide-react";

const TABS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/notes", label: "Notes", icon: NotebookText, end: false },
  { to: "/library", label: "Library", icon: Library, end: false },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur border-t border-red-900/30"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-6xl mx-auto flex items-stretch justify-around px-2">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="group relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 px-2"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex items-center justify-center rounded-2xl transition-all duration-300 ease-out ${
                    isActive
                      ? "bg-red-600/15 px-4 py-1.5 shadow-[0_8px_18px_-12px_rgba(239,68,68,0.8)] animate-tab-pop"
                      : "px-4 py-1 text-slate-500"
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.4 : 2}
                    className={`transition-all duration-300 ease-out ${
                      isActive ? "text-red-500 scale-[1.04]" : "text-slate-500"
                    }`}
                  />
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide transition-all duration-300 ease-out ${
                    isActive ? "text-red-500 translate-y-0" : "text-slate-500 translate-y-0.5"
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
