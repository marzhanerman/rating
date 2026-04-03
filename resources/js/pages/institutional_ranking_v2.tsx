import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Calendar,
  ChevronRight,
  MapPin,
  Medal,
  Search,
  Star,
  Trophy,
} from "lucide-react";

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

type Category = {
  id: string;
  name: string;
  icon: string;
  order: number;
  universities: University[];
};

type Props = {
  selectedYear: number;
  availableYears: number[];
  categories: Category[];
  totalUniversities: number;
  indicatorCount: number;
};

function PlaceBadgeLarge({ place }: { place: number }) {
  if (place === 1) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-xl shadow-yellow-400/30">
        <Trophy size={28} className="text-white" />
      </div>
    );
  }

  if (place === 2) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-300 to-gray-500 shadow-xl shadow-gray-400/20">
        <Medal size={28} className="text-white" />
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 shadow-xl shadow-orange-400/20">
      <Medal size={28} className="text-white" />
    </div>
  );
}

function TopCard({
  university,
  rank,
}: {
  university: University;
  rank: 1 | 2 | 3;
}) {
  const borderColors = {
    1: "ring-yellow-400/50 shadow-yellow-200/30",
    2: "ring-gray-400/40 shadow-gray-200/20",
    3: "ring-orange-400/40 shadow-orange-200/20",
  };

  const labelColors = {
    1: "from-yellow-400 to-amber-500",
    2: "from-gray-300 to-gray-500",
    3: "from-orange-400 to-amber-600",
  };

  const labels = {
    1: "1-е место",
    2: "2-е место",
    3: "3-е место",
  };

  const content = (
    <>
      <div className="p-6">
        <div className="mb-4 flex items-start gap-4">
          <PlaceBadgeLarge place={rank} />

          <div className="min-w-0 flex-1">
            <span
              className={`mb-2 inline-block rounded-lg bg-gradient-to-r px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${labelColors[rank]}`}
            >
              {labels[rank]}
            </span>

            <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-700">
              {university.name}
            </h3>

            <div className="mt-1.5 flex items-center gap-1.5">
              <MapPin size={12} className="text-gray-400" />
              <span className="text-[11px] font-medium text-gray-400">{university.city}</span>
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700"
              style={{ width: `${university.score}%` }}
            />
          </div>
          <span className="text-xl font-black text-blue-700">{university.score.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {university.metrics.slice(0, 3).map((metric) => (
            <div key={metric.key} className="text-center">
              <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-400/60"
                  style={{ width: `${metric.score}%` }}
                />
              </div>
              <span className="text-[9px] font-medium leading-none text-gray-400">{metric.shortLabel}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3">
        <span className="text-[11px] font-semibold text-blue-600">Анализ рейтинга</span>
        <ChevronRight size={14} className="text-blue-400 transition-transform group-hover:translate-x-1" />
      </div>
    </>
  );

  const baseClassName = `group relative overflow-hidden rounded-2xl bg-white ring-2 ${borderColors[rank]} shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`;

  if (!university.analysisHref) {
    return <article className={baseClassName}>{content}</article>;
  }

  return (
    <Link href={university.analysisHref} className={baseClassName}>
      {content}
    </Link>
  );
}

export default function InstitutionalRankingV2({
  selectedYear,
  availableYears = [],
  categories = [],
  totalUniversities,
  indicatorCount,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id ?? "");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!categories.some((category) => category.id === selectedCategory)) {
      setSelectedCategory(categories[0]?.id ?? "");
    }
  }, [categories, selectedCategory]);

  const currentCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategory) ?? categories[0] ?? null,
    [categories, selectedCategory],
  );

  const filteredUniversities = useMemo(() => {
    if (!currentCategory) {
      return [];
    }

    if (!searchQuery.trim()) {
      return currentCategory.universities;
    }

    const normalizedQuery = searchQuery.toLocaleLowerCase("ru-RU");

    return currentCategory.universities.filter((university) =>
      [university.name, university.city]
        .join(" ")
        .toLocaleLowerCase("ru-RU")
        .includes(normalizedQuery),
    );
  }, [currentCategory, searchQuery]);

  const top3 = filteredUniversities.slice(0, 3);

  return (
    <>
      <Head title="Институциональный рейтинг — v2" />

      <div className="min-h-screen bg-[#0a1530]">
        <RankingHeader currentPath="/ranking" />

        <section className="hero-gradient relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-3xl" />
            <div className="absolute -left-40 top-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-3xl" />
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
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-blue-200/80">
                <Calendar size={14} className="text-blue-400" />
                Институциональный рейтинг {selectedYear}
              </span>
            </div>

            <div className="grid items-start gap-12 lg:grid-cols-5">
              <div className="space-y-6 lg:col-span-3">
                <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                  Рейтинг вузов
                  <br />
                  <span className="text-gradient">Казахстана</span>
                </h1>

                <p className="max-w-xl text-base leading-relaxed text-blue-200/50 sm:text-lg">
                  Вторая версия страницы акцентирует категории, топ-3 внутри профиля, поисковый
                  сценарий и отдельный аналитический экран по каждому университету с историей и
                  контекстными индикаторами.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:col-span-2">
                {[
                  { label: "Вузов", value: String(totalUniversities) },
                  { label: "Категорий", value: String(categories.length) },
                  { label: "Индикаторов", value: String(indicatorCount) },
                  { label: "Год", value: String(selectedYear) },
                ].map((stat, index) => (
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
            </div>
          </div>
        </section>

        <div className="relative overflow-hidden bg-white">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
            <div className="absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-100/40 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-10 rounded-2xl border border-gray-200/60 bg-white p-6 shadow-xl shadow-gray-200/50">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Фильтры</h2>
                  <p className="mt-0.5 text-[12px] text-gray-400">Выберите категорию, год и найдите вуз</p>
                </div>

                <div className="flex flex-wrap gap-1.5 rounded-xl bg-gray-100 p-1.5">
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() =>
                        router.get(
                          "/ranking-v2",
                          { year },
                          { preserveScroll: true, preserveState: false },
                        )
                      }
                      className={`rounded-lg px-4 py-2 text-[13px] font-bold transition-all duration-300 ${
                        selectedYear === year
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                          : "text-gray-400 hover:bg-white hover:text-gray-600"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                      currentCategory?.id === category.id
                        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                        : "border border-gray-200/60 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    <span className="text-base">{category.icon}</span>
                    {category.name}
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        currentCategory?.id === category.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-200/60 text-gray-400"
                      }`}
                    >
                      {category.universities.length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по названию вуза или городу..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-xl border border-gray-200/60 bg-gray-50 py-3 pl-11 pr-4 text-[13px] text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>

            {currentCategory ? (
              <div className="mb-8 flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-500/20 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
                  <Star size={12} fill="currentColor" />
                  {currentCategory.icon} {currentCategory.name}
                </div>
                <span className="text-sm text-gray-400">{filteredUniversities.length} вуз(ов)</span>
              </div>
            ) : null}

            {top3.length > 0 ? (
              <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                {top3.map((university, index) => (
                  <TopCard
                    key={`${university.id ?? university.name}-${index}`}
                    university={university}
                    rank={(index + 1) as 1 | 2 | 3}
                  />
                ))}
              </div>
            ) : null}

            {filteredUniversities.length > 0 && currentCategory ? (
              <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-xl shadow-gray-200/40">
                <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-7 py-5">
                  <h3 className="flex items-center gap-2 text-base font-bold text-white">
                    <BarChart3 size={18} />
                    Полный рейтинг — {currentCategory.name}
                  </h3>
                  <p className="mt-1 text-[12px] text-blue-200/60">Все вузы категории, включая топ-3</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="w-[70px] border-b border-gray-200 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Место
                        </th>
                        <th className="border-b border-gray-200 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Вуз
                        </th>
                        <th className="w-[120px] border-b border-gray-200 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Город
                        </th>
                        <th className="w-[160px] border-b border-gray-200 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Балл
                        </th>
                        <th className="w-[130px] border-b border-gray-200 px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Действие
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUniversities.map((university) => (
                        <tr
                          key={`${university.id ?? university.name}-${university.place}`}
                          className="group transition-colors duration-200 hover:bg-blue-50/50"
                        >
                          <td className="border-b border-gray-100 px-6 py-4">
                            {university.place <= 3 ? (
                              <span
                                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold text-white shadow-lg ${
                                  university.place === 1
                                    ? "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-yellow-400/30"
                                    : university.place === 2
                                      ? "bg-gradient-to-br from-gray-300 to-gray-500 shadow-gray-400/20"
                                      : "bg-gradient-to-br from-orange-400 to-amber-600 shadow-orange-400/20"
                                }`}
                              >
                                {university.place}
                              </span>
                            ) : (
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[12px] font-bold text-gray-400">
                                {university.place}
                              </span>
                            )}
                          </td>

                          <td className="border-b border-gray-100 px-6 py-4">
                            <p className="text-[13px] font-bold text-gray-800 transition-colors group-hover:text-blue-700">
                              {university.name}
                            </p>
                          </td>

                          <td className="border-b border-gray-100 px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} className="text-gray-400" />
                              <span className="text-[12px] text-gray-500">{university.city}</span>
                            </div>
                          </td>

                          <td className="border-b border-gray-100 px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2 max-w-[80px] flex-1 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${university.score}%`,
                                    background:
                                      university.score >= 90
                                        ? "linear-gradient(90deg, #1d4ed8, #3b82f6)"
                                        : university.score >= 75
                                          ? "linear-gradient(90deg, #3b82f6, #93c5fd)"
                                          : "linear-gradient(90deg, #9ca3af, #d1d5db)",
                                  }}
                                />
                              </div>

                              <span
                                className={`text-[14px] font-extrabold ${
                                  university.score >= 90
                                    ? "text-blue-700"
                                    : university.score >= 75
                                      ? "text-blue-500"
                                      : "text-gray-400"
                                }`}
                              >
                                {university.score.toFixed(2)}
                              </span>
                            </div>
                          </td>

                          <td className="border-b border-gray-100 px-6 py-4 text-center">
                            {university.analysisHref ? (
                              <Link
                                href={university.analysisHref}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3.5 py-2 text-[11px] font-bold text-blue-600 transition-colors hover:bg-blue-100"
                              >
                                <BarChart3 size={12} />
                                Анализ
                              </Link>
                            ) : (
                              <span className="text-[11px] font-semibold text-gray-300">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {filteredUniversities.length === 0 ? (
              <div className="py-20 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                  🔍
                </div>
                <p className="text-sm font-medium text-gray-400">
                  Вузы не найдены. Попробуйте изменить фильтры или поисковый запрос.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
