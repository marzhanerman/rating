import { Head, Link, router } from "@inertiajs/react";
import { useMemo } from "react";
import { ArrowLeft, Calendar, MapPin, Trophy, TrendingUp } from "lucide-react";

import RankingHeader from "@/components/header/navigation/ranking-header";

type Metric = {
  key: string;
  title: string;
  shortLabel: string;
  score: number;
  rawValue: number | null;
  valueLabel: string;
  comparisonDirection: "higher" | "lower";
};

type University = {
  id: number | null;
  name: string;
  city: string;
  place: number;
  score: number;
  metrics: Metric[];
  analysisHref: string | null;
};

type HistoryPoint = {
  year: number;
  rank: number;
  totalScore: number;
};

type Category = {
  id: string;
  name: string;
  icon: string;
  averageScore: number;
  universities: University[];
};

type Props = {
  selectedYear: number;
  availableYears: number[];
  university: University;
  history: HistoryPoint[];
  category: Category;
  backHref: string;
};

const indicatorColors = [
  { bar: "from-blue-600 to-blue-400", bg: "bg-blue-50", text: "text-blue-700" },
  { bar: "from-indigo-600 to-indigo-400", bg: "bg-indigo-50", text: "text-indigo-700" },
  { bar: "from-violet-600 to-violet-400", bg: "bg-violet-50", text: "text-violet-700" },
  { bar: "from-cyan-600 to-cyan-400", bg: "bg-cyan-50", text: "text-cyan-700" },
  { bar: "from-emerald-600 to-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700" },
  { bar: "from-amber-600 to-amber-400", bg: "bg-amber-50", text: "text-amber-700" },
];

const formatAverage = (metric: Metric, average: number | null) => {
  if (average === null) {
    return "Недостаточно данных для среднего";
  }

  switch (metric.key) {
    case "overall":
      return `Среднее по категории: ${average.toFixed(2)}`;
    case "position":
      return `Среднее место: ${average.toFixed(1)}`;
    case "best_rank":
      return `Средший лучший результат: #${average.toFixed(1)}`;
    case "stability":
      return `Средняя стабильность: ${Math.round(average)}%`;
    case "momentum":
      return `Средняя динамика: ${average >= 0 ? "+" : ""}${average.toFixed(2)}`;
    case "coverage":
      return `Средняя глубина архива: ${average.toFixed(1)} г.`;
    default:
      return `Среднее: ${average.toFixed(2)}`;
  }
};

const formatDifference = (metric: Metric, average: number | null) => {
  if (average === null || metric.rawValue === null) {
    return null;
  }

  const difference =
    metric.comparisonDirection === "lower"
      ? average - metric.rawValue
      : metric.rawValue - average;

  if (Math.abs(difference) < 0.05) {
    return {
      label: "на уровне среднего",
      className: "text-gray-400",
    };
  }

  return difference > 0
    ? {
        label: "выше среднего",
        className: "text-emerald-500",
      }
    : {
        label: "ниже среднего",
        className: "text-red-400",
      };
};

const handleYearRedirect = (universityId: number | null, year: number) => {
  if (!universityId) {
    return;
  }

  router.get(
    `/ranking-v2/university/${universityId}`,
    { year },
    { preserveScroll: true, preserveState: false },
  );
};

export default function InstitutionalAnalysisV2({
  selectedYear,
  availableYears = [],
  university,
  history = [],
  category,
  backHref,
}: Props) {
  const categoryMetricStats = useMemo(() => {
    return university.metrics.map((metric, index) => {
      const rawValues = category.universities
        .map((peer) => peer.metrics[index]?.rawValue)
        .filter((value): value is number => typeof value === "number");
      const scoreValues = category.universities
        .map((peer) => peer.metrics[index]?.score)
        .filter((value): value is number => typeof value === "number");

      return {
        rawAverage: rawValues.length > 0
          ? rawValues.reduce((sum, value) => sum + value, 0) / rawValues.length
          : null,
        scoreAverage: scoreValues.length > 0
          ? scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length
          : null,
      };
    });
  }, [category.universities, university.metrics]);

  const sortedHistory = useMemo(
    () => [...history].sort((left, right) => right.year - left.year),
    [history],
  );

  return (
    <>
      <Head title={`${university.name} — Институциональный рейтинг v2`} />

      <div className="min-h-screen bg-[#0a1530]">
        <RankingHeader currentPath="/ranking" />

        <section className="hero-gradient relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-3xl" />
            <div className="absolute -left-40 top-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <Link
                  href={backHref}
                  className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-[13px] font-semibold text-blue-200/80 transition-colors hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Назад к рейтингу
                </Link>

                {availableYears.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 rounded-xl glass p-1.5">
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearRedirect(university.id, year)}
                        className={`rounded-lg px-4 py-2 text-[13px] font-bold transition-all duration-300 ${
                          selectedYear === year
                            ? "bg-white/20 text-white shadow-lg shadow-white/10"
                            : "text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-8 lg:flex-row lg:items-end">
                <div className="flex-1">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="rounded-lg bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-200">
                      {category.name}
                    </span>
                    <span className="rounded-lg bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-200">
                      {selectedYear}
                    </span>
                  </div>

                  <h1 className="mb-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                    {university.name}
                  </h1>

                  <div className="flex items-center gap-2 text-blue-200/50">
                    <MapPin size={16} />
                    <span className="text-sm font-medium">{university.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative h-32 w-32">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${(university.score / 100) * 327} 327`}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-white">{university.score.toFixed(2)}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-200/50">Балл</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-yellow-400" />
                      <span className="text-lg font-bold text-white">{university.place}-е место</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-blue-400" />
                      <span className="text-sm text-blue-200/60">
                        Среднее по категории: {category.averageScore.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="relative overflow-hidden bg-white">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
            <div className="absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-100/40 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Аналитические индикаторы профиля</h2>
              <p className="text-sm text-gray-400">
                Детальная раскладка строится на доступных данных IQAA: итоговом балле, позиции,
                исторической устойчивости, динамике и глубине архива.
              </p>
            </div>

            <div className="space-y-4">
              {university.metrics.map((metric, index) => {
                const color = indicatorColors[index % indicatorColors.length];
                const metricStats = categoryMetricStats[index] ?? { rawAverage: null, scoreAverage: null };
                const average = metricStats.rawAverage;
                const difference = formatDifference(metric, average);

                return (
                  <div
                    key={metric.key}
                    className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-lg shadow-gray-200/30 transition-shadow duration-300 hover:shadow-xl"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${color.bg} ${color.text}`}
                        >
                          {index + 1}
                        </span>

                        <div>
                          <h3 className="text-[14px] font-bold text-gray-800">{metric.title}</h3>
                          <p className="mt-0.5 text-[11px] text-gray-400">
                            {formatAverage(metric, average)}
                            {difference ? (
                              <span className={`ml-2 font-semibold ${difference.className}`}>{difference.label}</span>
                            ) : null}
                          </p>
                        </div>
                      </div>

                      <span className={`text-2xl font-black ${color.text}`}>{metric.valueLabel}</span>
                    </div>

                    <div className="relative h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color.bar} transition-all duration-700`}
                        style={{ width: `${metric.score}%` }}
                      />

                      {average !== null ? (
                        <div
                          className="absolute bottom-0 top-0 w-0.5 bg-gray-400/60"
                          style={{
                            left: `${Math.max(0, Math.min(100, metricStats.scoreAverage ?? 0))}%`,
                          }}
                        />
                      ) : null}
                    </div>

                    <div className="mt-1.5 flex justify-between">
                      <span className="text-[10px] text-gray-400">0%</span>
                      <span className="text-[10px] text-gray-400">100%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {sortedHistory.length > 0 ? (
              <div className="mt-10">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">История по годам</h3>
                  <p className="text-sm text-gray-400">Архив позиции и итогового балла университета в рейтинге IQAA</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedHistory.map((item) => (
                    <div
                      key={item.year}
                      className={`rounded-2xl border p-5 ${
                        item.year === selectedYear
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200/60 bg-white"
                      }`}
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                        {item.year}
                      </div>
                      <div className="mt-3 text-2xl font-black text-gray-900">#{item.rank}</div>
                      <div className="mt-2 text-sm text-gray-500">Балл: {item.totalScore.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-8 text-center">
              <h3 className="mb-2 text-xl font-bold text-white">Итоговый балл</h3>
              <p className="mb-2 text-5xl font-black text-white">{university.score.toFixed(2)}</p>
              <p className="text-sm text-blue-200/60">
                {university.place}-е место в категории «{category.name}» · {selectedYear} год
              </p>

              <Link
                href={backHref}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/25"
              >
                <ArrowLeft size={16} />
                Вернуться к рейтингу
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
