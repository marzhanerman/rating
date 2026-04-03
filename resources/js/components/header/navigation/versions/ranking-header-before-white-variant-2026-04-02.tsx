import { Link } from "@inertiajs/react";
import {
  Award,
  BookOpenText,
  ChevronRight,
  Globe,
  GraduationCap,
  Home,
  Menu,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type RankingPath = "/" | "/ranking" | "/program-ranking" | "/website-ranking" | "/methodology" | "/ireg";

type RankingHeaderProps = {
  currentPath: RankingPath;
  className?: string;
};

type NavItem = {
  href: RankingPath;
  label: string;
  icon: typeof Home;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Главная",
    icon: Home,
  },
  {
    href: "/ranking",
    label: "Рейтинг вузов",
    icon: Trophy,
  },
  {
    href: "/program-ranking",
    label: "Программный рейтинг",
    icon: GraduationCap,
  },
  {
    href: "/website-ranking",
    label: "Рейтинг сайтов",
    icon: Globe,
  },
  {
    href: "/methodology",
    label: "Методология",
    icon: BookOpenText,
  },
  {
    href: "/ireg",
    label: "IREG",
    icon: Award,
  },
];

export default function RankingHeader({ currentPath, className }: RankingHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = useMemo(
    () => navItems.find((item) => item.href === currentPath) ?? navItems[0],
    [currentPath],
  );
  const ActiveIcon = activeItem.icon;

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  return (
    <>
      <header
        className={cn(
          "glass-nav rounded-[1.8rem] px-4 py-3 text-white shadow-2xl shadow-black/20 md:px-5",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3 shrink-0">
            <div className="rounded-2xl bg-white p-2.5 shadow-lg shadow-blue-500/25">
              <img src="/images/logos/logo.svg" alt="IQAA" className="h-11 w-auto object-contain" />
            </div>

            <div className="hidden min-w-0 sm:block">
              <div className="text-sm font-bold uppercase tracking-[0.28em] text-white">IQAA Ranking</div>
              <p className="mt-1 max-w-[240px] text-[11px] leading-4 text-blue-100/70 md:max-w-[280px]">
                Независимое агентство по обеспечению качества в образовании - Рейтинг
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center">
            <div className="glass flex items-center gap-1 rounded-2xl px-2 py-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium transition-all duration-300 whitespace-nowrap",
                      isActive
                        ? "nav-item-active text-white"
                        : "nav-item-hover text-blue-100/70 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="flex items-center gap-3">           

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="glass flex h-10 w-10 items-center justify-center rounded-xl text-white transition-all duration-300 hover:bg-white/10 lg:hidden"
              aria-label="Открыть меню рейтингов"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] transition-all duration-300 lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[320px] max-w-[88vw] flex-col bg-gradient-to-b from-[#0f172a] to-[#1e293b] shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="border-b border-white/10 px-6 pb-6 pt-16">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 shadow-lg shadow-blue-500/25">
                <img src="/images/logos/logo.svg" alt="IQAA" className="h-10 w-auto object-contain" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold uppercase tracking-[0.28em] text-white">IQAA Ranking</div>
                <p className="mt-1 text-[11px] leading-4 text-blue-100/60">Навигация по рейтинговым страницам</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3.5 text-[14px] font-medium transition-all duration-300",
                    isActive
                      ? "nav-item-active text-white"
                      : "text-blue-100/65 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 px-6 py-5">
            <div className="text-xs uppercase tracking-[0.18em] text-blue-100/45">Текущая страница</div>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-white">
              <ActiveIcon className="h-4 w-4 text-orange-400" />
              {activeItem.label}
            </div>

            <Link
              href={activeItem.href}
              onClick={() => setMobileOpen(false)}
              className="btn-orange mt-5 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
            >
              Открыть раздел
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
