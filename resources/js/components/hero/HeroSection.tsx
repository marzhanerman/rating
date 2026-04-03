import { ChevronRight, ArrowRight, Calendar, Table, FileText } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

const stats = [
  { label: "Записей", value: "1342" },
  { label: "Группы ОП", value: "305" },
  { label: "Вузов", value: "32" },
  { label: "Баллы", value: "есть" },
];

export default function HeroSection() {
  return (
    <section className="hero-gradient min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Badge */}
        <div className="animate-fade-up mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-[12px] font-semibold text-blue-200/80 uppercase tracking-wider">
            <Calendar size={14} className="text-blue-400" />
            Программный рейтинг 2024
          </span>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Left content */}
          <div className="lg:col-span-3 space-y-8">
            <h2 className="animate-fade-up-delay-1 text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] tracking-tight">
              Рейтинг образовательных
              <br />
              программ и групп
              <br />
              <span className="text-gradient">образовательных программ</span>
            </h2>

            <p className="animate-fade-up-delay-2 text-base sm:text-lg text-blue-200/50 leading-relaxed max-w-xl">
              Страница собирает данные из программного рейтинга IQAA по годам: до
              2019 года ранжирование шло по отдельным образовательным программам, а
              с 2020 года по группам образовательных программ.
            </p>

            {/* Action Buttons */}
            <div className="animate-fade-up-delay-3 flex flex-wrap gap-3 pt-2">
              <button className="btn-orange inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold">
                <Calendar size={16} />
                Выбрать год
                <ChevronRight size={16} />
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-white/80 text-sm font-medium hover:text-white hover:bg-white/10 transition-all duration-300">
                <Table size={16} />
                Смотреть таблицу
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-white/80 text-sm font-medium hover:text-white hover:bg-white/10 transition-all duration-300">
                <FileText size={16} />
                Методология
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right side - Stats & Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  delay={i * 100}
                />
              ))}
            </div>

            {/* Info Card */}
            <div className="glass-card rounded-2xl p-6 stat-card-glow transition-all duration-300">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-300/70 mb-2">
                Формат выбранного года
              </p>
              <h3 className="text-base font-bold text-white mb-2">
                Группы образовательных программ
              </h3>
              <p className="text-[13px] text-blue-200/40 leading-relaxed">
                Начиная с 2020 года рейтинги публикуются по группам
                образовательных программ.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section label */}
        <div className="mt-24 pt-8 border-t border-white/5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300/40">
            Годы публикации
          </p>
        </div>
      </div>
    </section>
  );
}