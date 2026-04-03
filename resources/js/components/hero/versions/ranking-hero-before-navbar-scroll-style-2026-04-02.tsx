import { type ComponentProps, type ReactNode } from "react";
import RankingHeader from "@/components/header/navigation/ranking-header";
import { cn } from "@/lib/utils";

type RankingPath = ComponentProps<typeof RankingHeader>["currentPath"];

type RankingHeroProps = {
  currentPath: RankingPath;
  headerClassName?: string;
  content?: ReactNode;
  badge?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  footerLabel?: ReactNode;
  className?: string;
  containerClassName?: string;
  gridClassName?: string;
  contentClassName?: string;
  asideClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export default function RankingHero({
  currentPath,
  headerClassName,
  content,
  badge,
  title,
  description,
  actions,
  aside,
  footerLabel,
  className,
  containerClassName,
  gridClassName,
  contentClassName,
  asideClassName,
  titleClassName,
  descriptionClassName,
}: RankingHeroProps) {
  return (
    <section className={cn("hero-gradient relative overflow-hidden text-white", className)}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className={cn("relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8", containerClassName)}>
        <RankingHeader currentPath={currentPath} className={cn("animate-fade-up", headerClassName)} />

        <div
          className={cn(
            "grid items-start gap-12 pt-10 lg:grid-cols-5 lg:gap-16",
            aside ? undefined : "lg:grid-cols-1",
            gridClassName,
          )}
        >
          <div className={cn("lg:col-span-3 max-w-3xl space-y-8", contentClassName)}>
            {content ? (
              content
            ) : (
              <>
                {badge ? <div className="animate-fade-up">{badge}</div> : null}

                <h1
                  className={cn(
                    "animate-fade-up-delay-1 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]",
                    titleClassName,
                  )}
                >
                  {title}
                </h1>

                {description ? (
                  <p
                    className={cn(
                      "animate-fade-up-delay-2 max-w-2xl text-base leading-relaxed text-blue-100/70 sm:text-lg",
                      descriptionClassName,
                    )}
                  >
                    {description}
                  </p>
                ) : null}

                {actions ? <div className="animate-fade-up-delay-3 flex flex-wrap gap-3 pt-2">{actions}</div> : null}
              </>
            )}
          </div>

          {aside ? <div className={cn("lg:col-span-2 space-y-4", asideClassName)}>{aside}</div> : null}
        </div>

        {footerLabel ? (
          <div className="mt-16 border-t border-white/10 pt-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300/40">{footerLabel}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function RankingHeroBadge({
  icon,
  children,
  className,
}: {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-blue-200/80",
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function RankingHeroPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("glass-card rounded-2xl p-4 stat-card-glow transition-all duration-300", className)}>{children}</div>;
}

export function RankingHeroStat({
  label,
  value,
  helper,
  className,
  valueClassName,
}: {
  label: ReactNode;
  value: ReactNode;
  helper?: ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <RankingHeroPanel className={className}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300/70">{label}</div>
      <div className={cn("mt-2 text-4xl font-semibold text-white", valueClassName)}>{value}</div>
      {helper ? <div className="mt-2 text-sm leading-6 text-blue-100/60">{helper}</div> : null}
    </RankingHeroPanel>
  );
}
