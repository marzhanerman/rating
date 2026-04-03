import { ChevronRight, Calendar, Table } from "lucide-react";

type HeroStat = {
  label: string;
  value: string;
};

type ProgramRankingV2HeroProps = {
  selectedLevel: string;
  selectedYear: number;
  onLevelChange: (level: string) => void;
  stats: HeroStat[];
  formatTitle: string;
  formatDescription: string;
};

const levels = [
  { id: "bachelor", label: "\u0411\u0430\u043a\u0430\u043b\u0430\u0432\u0440\u0438\u0430\u0442" },
  { id: "master", label: "\u041c\u0430\u0433\u0438\u0441\u0442\u0440\u0430\u0442\u0443\u0440\u0430" },
  { id: "phd", label: "\u0414\u043e\u043a\u0442\u043e\u0440\u0430\u043d\u0442\u0443\u0440\u0430" },
];

export default function ProgramRankingV2Hero({
  selectedLevel,
  selectedYear,
  onLevelChange,
  stats,
  formatTitle,
  formatDescription,
}: ProgramRankingV2HeroProps) {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="animate-fade-up mb-8">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-blue-200/80">
            <Calendar size={14} className="text-blue-400" />
            {`\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u043d\u044b\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433 ${selectedYear}`}
          </span>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="space-y-8 lg:col-span-3">
            <h2 className="animate-fade-up-delay-1 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              {"\u0420\u0435\u0439\u0442\u0438\u043d\u0433 \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0445"}
              <br />
              {"\u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c \u0438 \u0433\u0440\u0443\u043f\u043f"}
              <br />
              <span className="text-gradient">
                {"\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c"}
              </span>
            </h2>

            <p className="animate-fade-up-delay-2 max-w-xl text-base leading-relaxed text-blue-200/50 sm:text-lg">
              {"\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u0441\u043e\u0431\u0438\u0440\u0430\u0435\u0442 \u0434\u0430\u043d\u043d\u044b\u0435 \u0438\u0437 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u043d\u043e\u0433\u043e \u0440\u0435\u0439\u0442\u0438\u043d\u0433\u0430 IQAA \u043f\u043e \u0433\u043e\u0434\u0430\u043c: \u0434\u043e 2019 \u0433\u043e\u0434\u0430 \u0440\u0430\u043d\u0436\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0448\u043b\u043e \u043f\u043e \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u043c \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u043c \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430\u043c, \u0430 \u0441 2020 \u0433\u043e\u0434\u0430 \u043f\u043e \u0433\u0440\u0443\u043f\u043f\u0430\u043c \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c."}
            </p>

            <div className="animate-fade-up-delay-2 flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => onLevelChange(level.id)}
                  className={`rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                    selectedLevel === level.id
                      ? "border-white/40 bg-white/20 text-white shadow-lg shadow-white/10"
                      : "glass text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>

            <div className="animate-fade-up-delay-3 flex flex-wrap gap-3 pt-2">
              <a
                href="#ranking-section"
                className="btn-orange inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
              >
                <Table size={16} />
                {"\u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0440\u0435\u0439\u0442\u0438\u043d\u0433"}
                <ChevronRight size={16} />
              </a>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="glass-card stat-card-glow group cursor-default rounded-2xl p-5 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-300/70">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-blue-200">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="glass-card stat-card-glow rounded-2xl p-6 transition-all duration-300">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-300/70">
                {"\u0424\u043e\u0440\u043c\u0430\u0442 \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0433\u043e \u0433\u043e\u0434\u0430"}
              </p>
              <h3 className="mb-2 text-base font-bold text-white">{formatTitle}</h3>
              <p className="text-[13px] leading-relaxed text-blue-200/40">
                {formatDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
