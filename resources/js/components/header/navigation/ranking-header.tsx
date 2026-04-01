import { Link } from "@inertiajs/react";
import { BookOpenText, Globe, GraduationCap, Home, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";

type RankingHeaderProps = {
  currentPath: "/" | "/ranking" | "/program-ranking" | "/website-ranking" | "/methodology" | "/ireg";
  className?: string;
};

const navItems = [
  {
    href: "/" as const,
    label: "Главная",
    shortLabel: "Главная",
    icon: Home,
  },
  {
    href: "/ranking" as const,
    label: "Рейтинг вузов",
    shortLabel: "Вузы",
    icon: Trophy,
  },
  {
    href: "/program-ranking" as const,
    label: "Программный рейтинг",
    shortLabel: "Программы",
    icon: GraduationCap,
  },
  {
    href: "/website-ranking" as const,
    label: "Рейтинг сайтов",
    shortLabel: "Сайты",
    icon: Globe,
  },
  {
    href: "/methodology" as const,
    label: "Методология",
    shortLabel: "Методология",
    icon: BookOpenText,
  },
  {
    href: "/ireg" as const,
    label: "IREG",
    shortLabel: "IREG",
    icon: Globe,
  },
];

export default function RankingHeader({ currentPath, className }: RankingHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6 rounded-[1.8rem] border border-slate-200/80 bg-white/95 px-5 py-4 text-slate-900 shadow-xl shadow-slate-950/10 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6",
        className,
      )}
    >
      <Link href="/" className="flex items-center gap-4">
        <div className="rounded-2xl bg-white p-2 shadow-lg shadow-slate-950/10 ring-1 ring-slate-200">
          <img src="/images/logos/logo.svg" alt="IQAA" className="h-12 w-auto object-contain" />
        </div>

        <div className="max-w-md leading-tight">
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">IQAA Ranking</div>
          <p className="mt-1 text-sm text-slate-700 md:text-base">
            Независимое агентство по обеспечению качества в образовании
          </p>
        </div>
      </Link>

      <div className="flex flex-col gap-3 md:max-w-3xl md:items-end">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Все страницы рейтинга
        </div>

        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "border-blue-700 bg-blue-700 text-white shadow-lg shadow-blue-950/15"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-950",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
