import { Link } from "@inertiajs/react";
import { CheckCircle, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "\u0413\u043b\u0430\u0432\u043d\u0430\u044f", href: "/", active: false },
  { label: "\u0420\u0435\u0439\u0442\u0438\u043d\u0433 \u0432\u0443\u0437\u043e\u0432", href: "/ranking", active: false },
  { label: "\u0420\u0435\u0439\u0442\u0438\u043d\u0433 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c", href: "/program-ranking-v2", active: true },
  { label: "\u0420\u0435\u0439\u0442\u0438\u043d\u0433 \u0441\u0430\u0439\u0442\u043e\u0432", href: "/website-ranking", active: false },
  { label: "\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f", href: "/methodology", active: false },
  { label: "IREG", href: "/ireg", active: false },
];

export default function ProgramRankingV2Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="glass-nav fixed left-0 right-0 top-0 z-50 shadow-lg shadow-black/20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/25">
              <CheckCircle size={16} className="text-white" />
            </div>
            <span className="text-[14px] font-semibold tracking-tight text-white">
              IQAA Ranking
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
                  item.active
                    ? "nav-item-active text-white"
                    : "nav-item-hover text-white/60 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="glass flex h-10 w-10 items-center justify-center rounded-xl text-white/80 hover:text-white md:hidden"
            aria-label={"\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e"}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 top-16 z-40 bg-slate-900/95 backdrop-blur-xl md:hidden">
          <nav className="space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-5 py-3.5 text-[14px] font-medium transition-all duration-300 ${
                  item.active
                    ? "nav-item-active text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
