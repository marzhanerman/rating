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
  const classTokens = className?.split(/\s+/).filter(Boolean) ?? [];
  const isDarkVariant = classTokens.includes("ranking-header--dark");

  const activeItem = useMemo(
    () => navItems.find((item) => item.href === currentPath) ?? navItems[0],
    [currentPath],
  );
  const ActiveIcon = activeItem.icon;

  const tone = isDarkVariant
    ? {
        header: "glass-nav text-white shadow-2xl shadow-black/20",
        logoFrame: "bg-white shadow-lg shadow-blue-500/25",
        brand: "text-white",
        brandCopy: "text-blue-100/70",
        desktopShell: "glass",
        inactiveDesktop: "text-blue-100/70 hover:text-white",
        menuButton: "glass text-white hover:bg-white/10",
        backdrop: "bg-slate-950/45 backdrop-blur-sm",
        drawer: "bg-gradient-to-b from-[#0f172a] to-[#1e293b]",
        drawerDivider: "border-white/10",
        drawerBrand: "text-white",
        drawerCopy: "text-blue-100/60",
        inactiveMobile: "text-blue-100/65 hover:bg-white/5 hover:text-white",
        currentLabel: "text-blue-100/45",
        currentText: "text-white",
        currentIcon: "text-orange-400",
      }
    : {
        header: "bg-white/95 text-slate-900 shadow-xl shadow-slate-200/80 ring-1 ring-slate-200/80 backdrop-blur-xl",
        logoFrame: "border border-slate-200 bg-slate-50 shadow-sm shadow-slate-200/70",
        brand: "text-slate-950",
        brandCopy: "text-slate-500",
        desktopShell: "border border-slate-200 bg-slate-50 shadow-sm shadow-slate-200/70",
        inactiveDesktop: "text-slate-600 hover:bg-white hover:text-slate-950",
        menuButton: "border border-slate-200 bg-white text-slate-900 shadow-sm shadow-slate-200/80 hover:bg-slate-50",
        backdrop: "bg-slate-950/35 backdrop-blur-sm",
        drawer: "border-l border-slate-200 bg-white",
        drawerDivider: "border-slate-200",
        drawerBrand: "text-slate-950",
        drawerCopy: "text-slate-500",
        inactiveMobile: "text-slate-700 hover:bg-slate-50 hover:text-slate-950",
        currentLabel: "text-slate-400",
        currentText: "text-slate-950",
        currentIcon: "text-orange-500",
      };

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
          "rounded-[1.8rem] px-4 py-3 md:px-5",
          tone.header,
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0 flex min-w-0 items-center gap-3">
            <div className={cn("rounded-2xl p-2.5", tone.logoFrame)}>
              <img src="/images/logos/logo.svg" alt="IQAA" className="h-11 w-auto object-contain" />
            </div>

            <div className="hidden min-w-0 sm:block">
              <div className={cn("text-sm font-bold uppercase tracking-[0.28em]", tone.brand)}>IQAA Ranking</div>
              <p className={cn("mt-1 max-w-[240px] text-[11px] leading-4 md:max-w-[280px]", tone.brandCopy)}>
                Независимое агентство по обеспечению качества в образовании - Рейтинг
              </p>
            </div>
          </Link>

          <nav className="hidden items-center lg:flex">
            <div className={cn("flex items-center gap-1 rounded-2xl px-2 py-1.5", tone.desktopShell)}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium whitespace-nowrap transition-all duration-300",
                      isActive ? "nav-item-active text-white" : cn("nav-item-hover", tone.inactiveDesktop),
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 lg:hidden",
              tone.menuButton,
            )}
            aria-label="Открыть меню рейтингов"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] transition-all duration-300 lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className={cn("absolute inset-0", tone.backdrop)} onClick={() => setMobileOpen(false)} />

        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[320px] max-w-[88vw] flex-col shadow-2xl transition-transform duration-300 ease-out",
            tone.drawer,
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className={cn("border-b px-6 pb-6 pt-16", tone.drawerDivider)}>
            <div className="flex items-center gap-3">
              <div className={cn("rounded-2xl p-2.5", tone.logoFrame)}>
                <img src="/images/logos/logo.svg" alt="IQAA" className="h-10 w-auto object-contain" />
              </div>
              <div className="min-w-0">
                <div className={cn("text-sm font-bold uppercase tracking-[0.28em]", tone.drawerBrand)}>IQAA Ranking</div>
                <p className={cn("mt-1 text-[11px] leading-4", tone.drawerCopy)}>Навигация по рейтинговым страницам</p>
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
                    isActive ? "nav-item-active text-white" : tone.inactiveMobile,
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={cn("border-t px-6 py-5", tone.drawerDivider)}>
            <div className={cn("text-xs uppercase tracking-[0.18em]", tone.currentLabel)}>Текущая страница</div>
            <div className={cn("mt-2 flex items-center gap-2 text-sm font-semibold", tone.currentText)}>
              <ActiveIcon className={cn("h-4 w-4", tone.currentIcon)} />
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
