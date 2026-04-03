import { Head, Link } from "@inertiajs/react";
import {
  ArrowUpRight,
  Award,
  ChevronRight,
  ExternalLink,
  FileText,
  Filter,
  Globe,
  LayoutGrid,
  Search,
  Sparkles,
  Waypoints,
} from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import RankingHero, { RankingHeroPanel, RankingHeroStat } from "@/components/hero/ranking-hero";

type MetricColumn = {
  key: string;
  label: string;
};

type Criterion = {
  key: string | null;
  title: string;
  points: number | null;
};

type Methodology = {
  title: string;
  intro: string[];
  criteria: Criterion[];
} | null;

type RankingRow = {
  id: string;
  place: number;
  universityName: string;
  websiteUrl?: string | null;
  totalScore: number | null;
  metrics: Record<string, number | null>;
};

type RankingCategory = {
  key: string;
  label: string;
  entryCount: number;
  topScore: number | null;
  rows: RankingRow[];
};

type SelectedRating = {
  year: number;
  title: string;
  entryCount: number;
  categoryCount: number;
  metricCount: number;
  topScore: number | null;
  metricColumns: MetricColumn[];
  categories: RankingCategory[];
  methodology: Methodology;
} | null;

type YearOption = {
  year: number;
  entryCount: number;
  categoryCount: number;
  metricCount: number;
  hasMethodology: boolean;
  hasDetailedMetrics: boolean;
  topScore: number | null;
  modeLabel: string;
};

type Props = {
  selectedYear: number;
  selectedRating?: SelectedRating;
  yearOptions?: YearOption[];
};

const formatScore = (value: number | null) => (value === null ? "РЅ/Рґ" : value.toFixed(2));

const getDomainLabel = (url?: string | null) => {
  if (!url) return "СЃСЃС‹Р»РєР° РЅРµ СѓРєР°Р·Р°РЅР°";

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "");
  }
};

const getCategoryTone = (key: string) => {
  const palette: Record<string, string> = {
    multidisciplinary: "bg-orange-50 text-orange-700 ring-orange-200",
    technical: "bg-blue-50 text-blue-700 ring-blue-200",
    "humanitarian-economic": "bg-amber-50 text-amber-700 ring-amber-200",
    medical: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pedagogical: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    arts: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
    all: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return palette[key] ?? palette.all;
};

export default function WebsiteRankingPage({
  selectedYear,
  selectedRating = null,
  yearOptions = [],
}: Props) {
  const categories = selectedRating?.categories ?? [];
  const metricColumns = selectedRating?.metricColumns ?? [];
  const methodology = selectedRating?.methodology ?? null;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedMetricKey, setFocusedMetricKey] = useState<string | null>(metricColumns[0]?.key ?? null);

  useEffect(() => {
    setSelectedCategory("all");
  }, [selectedYear]);

  useEffect(() => {
    setFocusedMetricKey(metricColumns[0]?.key ?? null);
  }, [selectedYear, metricColumns.length]);

  const deferredQuery = useDeferredValue(searchQuery.trim().toLocaleLowerCase());
  const hasCategoryFilter = categories.length > 1;

  const visibleRows = categories
    .filter((category) => selectedCategory === "all" || category.key === selectedCategory)
    .flatMap((category) =>
      category.rows.map((row) => ({
        ...row,
        categoryKey: category.key,
        categoryLabel: category.label,
      })),
    )
    .filter((row) => {
      if (!deferredQuery) return true;

      const haystack = [row.universityName, row.websiteUrl ?? "", row.categoryLabel]
        .join(" ")
        .toLocaleLowerCase();

      return haystack.includes(deferredQuery);
    })
    .sort((left, right) => {
      if (left.place !== right.place) return left.place - right.place;

      return left.universityName.localeCompare(right.universityName, "ru");
    });

  const highlightedMetric =
    (focusedMetricKey
      ? methodology?.criteria.find((criterion) => criterion.key === focusedMetricKey)
      : null) ??
    (focusedMetricKey
      ? {
          key: focusedMetricKey,
          title: `РџРѕРєР°Р·Р°С‚РµР»СЊ ${focusedMetricKey}`,
          points: null,
        }
      : null);

  const leaders = visibleRows.slice(0, 3);
  const websitesCount = visibleRows.filter((row) => Boolean(row.websiteUrl)).length;
  const bestVisibleScore =
    visibleRows.length > 0
      ? Math.max(...visibleRows.map((row) => row.totalScore ?? 0))
      : 0;

  const archiveRange =
    yearOptions.length > 0
      ? `${yearOptions[yearOptions.length - 1]?.year}вЂ“${yearOptions[0]?.year}`
      : `${selectedYear}`;

  return (
    <>
      <Head title="Р РµР№С‚РёРЅРі СЃР°Р№С‚РѕРІ РІСѓР·РѕРІ" />

      <div className="min-h-screen bg-[#f5f8fc] text-slate-950">
        <RankingHero
          currentPath="/website-ranking"
          badge={
            <>
              <Globe className="h-4 w-4 text-blue-300" />
              Архив рейтинга сайтов {archiveRange}
            </>
          }
          title="Рейтинг веб-сайтов вузов Казахстана"
          description="Интерактивная страница собирает архив IQAA по сайтам вузов: единые списки разных лет, профильные категории 2022 года и методологию по критериям оценки цифровой открытости университетов."
          actions={
            <>
              <a
                href="#website-year-grid"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Выбрать год
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#website-ranking-table"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Смотреть таблицу
              </a>
            </>
          }
          aside={
            <div className="space-y-4 lg:ml-auto lg:max-w-md">
              <div className="grid grid-cols-2 gap-3">
                <RankingHeroStat label="Год" value={selectedYear} valueClassName="text-3xl" />
                <RankingHeroStat label="Записей" value={selectedRating?.entryCount ?? 0} valueClassName="text-3xl" />
                <RankingHeroStat label="Категорий" value={selectedRating?.categoryCount ?? 0} valueClassName="text-3xl" />
                <RankingHeroStat label="Метрик" value={selectedRating?.metricCount ?? 0} valueClassName="text-3xl" />
              </div>

              <RankingHeroPanel className="rounded-[1.75rem] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300/70">Лучший итог</div>
                <div className="mt-3 text-3xl font-semibold text-white">
                  {selectedRating && selectedRating.topScore !== null ? formatScore(selectedRating.topScore) : "н/д"}
                </div>
                <p className="mt-3 text-sm leading-6 text-blue-100/65">
                  {selectedRating?.categoryCount && selectedRating.categoryCount > 1
                    ? "В этом году рейтинг опубликован по отдельным профилям вузов."
                    : "В этом году рейтинг опубликован единым списком по казахстанским вузам."}
                </p>
              </RankingHeroPanel>
            </div>
          }
        />

        <main className="mx-auto max-w-7xl px-6 py-12">
          <section
            id="website-year-grid"
            className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Р“РѕРґС‹ РїСѓР±Р»РёРєР°С†РёРё</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                  РђСЂС…РёРІ СЂРµР№С‚РёРЅРіР° СЃР°Р№С‚РѕРІ РїРѕ РіРѕРґР°Рј
                </h2>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                РњРѕР¶РЅРѕ РїРµСЂРµРєР»СЋС‡Р°С‚СЊСЃСЏ РјРµР¶РґСѓ РіРѕРґР°РјРё, СЃСЂР°РІРЅРёРІР°С‚СЊ С„РѕСЂРјР°С‚ РїСѓР±Р»РёРєР°С†РёРё, РЅР°Р»РёС‡РёРµ РјРµС‚РѕРґРѕР»РѕРіРёРё
                Рё СЃРјРѕС‚СЂРµС‚СЊ, РІ РєР°РєРѕРј РІРёРґРµ СЂРµР№С‚РёРЅРі РїСѓР±Р»РёРєРѕРІР°Р»СЃСЏ: РµРґРёРЅС‹Рј СЃРїРёСЃРєРѕРј РёР»Рё РїРѕ РїСЂРѕС„РёР»СЏРј РІСѓР·РѕРІ.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {yearOptions.map((option) => {
                const isActive = option.year === selectedYear;

                return (
                  <Link
                    key={option.year}
                    href={`/website-ranking?year=${option.year}`}
                    className={`rounded-[1.6rem] border p-5 transition ${
                      isActive
                        ? "border-blue-900 bg-blue-950 text-white shadow-xl shadow-blue-950/10"
                        : "border-slate-200 bg-slate-50 text-slate-950 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div
                          className={`text-xs uppercase tracking-[0.24em] ${
                            isActive ? "text-blue-100" : "text-blue-700"
                          }`}
                        >
                          {option.modeLabel}
                        </div>
                        <div className="mt-3 text-3xl font-semibold">{option.year}</div>
                      </div>

                      <div
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                          isActive ? "bg-white/10 text-white" : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {option.hasDetailedMetrics ? "РЎ РјРµС‚СЂРёРєР°РјРё" : "Р‘РµР· РјРµС‚СЂРёРє"}
                      </div>
                    </div>

                    <div className={`mt-4 text-sm leading-6 ${isActive ? "text-blue-100" : "text-slate-600"}`}>
                      {option.entryCount} Р·Р°РїРёСЃРµР№, {option.categoryCount} РєР°С‚РµРіРѕСЂРёР№, РїРёРє {formatScore(option.topScore)}.
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="top-6 h-fit rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:sticky">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Р¤РёР»СЊС‚СЂС‹ Рё РєРѕРЅС‚РµРєСЃС‚</h2>
                  <p className="text-sm text-slate-500">РџРѕРёСЃРє СЂР°Р±РѕС‚Р°РµС‚ РїРѕ РЅР°Р·РІР°РЅРёСЋ РІСѓР·Р°, СЃСЃС‹Р»РєРµ Рё РєР°С‚РµРіРѕСЂРёРё.</p>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="website-search" className="mb-2 block text-sm font-medium text-slate-700">
                  РџРѕРёСЃРє РїРѕ РІСѓР·Сѓ РёР»Рё СЃР°Р№С‚Сѓ
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    id="website-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="РќР°РїСЂРёРјРµСЂ, Satbayev РёР»Рё kaznu.kz"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {hasCategoryFilter ? (
                <div className="mt-6">
                  <div className="mb-3 text-sm font-medium text-slate-700">РљР°С‚РµРіРѕСЂРёСЏ</div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("all")}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        selectedCategory === "all"
                          ? "bg-[#0d2b6b] text-white shadow-lg shadow-blue-950/15"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Р’СЃРµ РєР°С‚РµРіРѕСЂРёРё
                    </button>

                    {categories.map((category) => (
                      <button
                        key={category.key}
                        type="button"
                        onClick={() => setSelectedCategory(category.key)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          selectedCategory === category.key
                            ? "bg-[#0d2b6b] text-white shadow-lg shadow-blue-950/15"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-8 space-y-5 border-t border-slate-200 pt-6">
                <div>
                  <div className="text-sm text-slate-500">РџРѕРєР°Р·Р°РЅРѕ СЃС‚СЂРѕРє</div>
                  <div className="mt-1 text-3xl font-semibold text-slate-950">{visibleRows.length}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">РЎСЃС‹Р»РѕРє РЅР° СЃР°Р№С‚С‹</div>
                  <div className="mt-1 text-3xl font-semibold text-slate-950">{websitesCount}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">РђРєС‚РёРІРЅС‹Р№ РіРѕРґ</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-950">{selectedYear}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">Р›СѓС‡С€РёР№ Р±Р°Р»Р» РІ РІС‹Р±РѕСЂРєРµ</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-950">{formatScore(bestVisibleScore)}</div>
                </div>
              </div>

              {selectedRating?.categoryCount && selectedRating.categoryCount > 1 ? (
                <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  Р’ <span className="font-semibold">{selectedYear}</span> РіРѕРґСѓ СЂРµР№С‚РёРЅРі СЃР°Р№С‚РѕРІ РїСѓР±Р»РёРєРѕРІР°Р»СЃСЏ РїРѕ
                  РѕС‚РґРµР»СЊРЅС‹Рј РїСЂРѕС„РёР»СЏРј РІСѓР·РѕРІ, РїРѕСЌС‚РѕРјСѓ РєР°С‚РµРіРѕСЂРёР№ РЅРµСЃРєРѕР»СЊРєРѕ Рё РёС… СѓРґРѕР±РЅРѕ СЃСЂР°РІРЅРёРІР°С‚СЊ РѕС‚РґРµР»СЊРЅРѕ.
                </div>
              ) : null}
            </aside>

            <div className="space-y-6">
              <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РњРµС‚РѕРґРѕР»РѕРіРёСЏ</div>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                      РљР°Рє РѕС†РµРЅРёРІР°РµС‚СЃСЏ СЃР°Р№С‚ РІСѓР·Р°
                    </h2>
                  </div>

                  <div className="text-sm leading-6 text-slate-500">
                    {methodology?.title ?? "РђСЂС…РёРІРЅР°СЏ РјРµС‚РѕРґРѕР»РѕРіРёСЏ РЅРµ РЅР°Р№РґРµРЅР° РґР»СЏ РІС‹Р±СЂР°РЅРЅРѕРіРѕ РіРѕРґР°."}
                  </div>
                </div>

                {metricColumns.length > 0 && methodology?.criteria.length ? (
                  <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <div>
                      <div className="mb-3 text-sm font-medium text-slate-700">Р¤РѕРєСѓСЃ РїРѕ РёРЅРґРёРєР°С‚РѕСЂСѓ</div>
                      <div className="flex flex-wrap gap-3">
                        {methodology.criteria
                          .filter((criterion) => criterion.key)
                          .map((criterion) => {
                            const isActive = criterion.key === focusedMetricKey;

                            return (
                              <button
                                key={criterion.key}
                                type="button"
                                onClick={() => setFocusedMetricKey(criterion.key)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                  isActive
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-700/20"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                              >
                                {criterion.key}
                                {criterion.points !== null ? ` В· ${formatScore(criterion.points)}` : ""}
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    <div className="rounded-[1.8rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-emerald-700">РђРєС‚РёРІРЅС‹Р№ РєСЂРёС‚РµСЂРёР№</div>
                          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                            {highlightedMetric?.key ?? "РРЅРґРёРєР°С‚РѕСЂ"}
                          </h3>
                        </div>

                        {highlightedMetric && highlightedMetric.points !== null ? (
                          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 ring-1 ring-slate-200">
                            {formatScore(highlightedMetric.points)} Р±Р°Р»Р»Р°
                          </div>
                        ) : null}
                      </div>

                      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                        {highlightedMetric?.title ??
                          "Р”Р»СЏ РІС‹Р±СЂР°РЅРЅРѕРіРѕ РіРѕРґР° РґРѕСЃС‚СѓРїРЅС‹ РєСЂРёС‚РµСЂРёРё РѕС†РµРЅРєРё СЃР°Р№С‚Р° Рё РёС‚РѕРіРѕРІС‹Р№ Р±Р°Р»Р»."}
                      </p>

                      {methodology.intro.length > 0 ? (
                        <div className="mt-6 rounded-[1.3rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                          {methodology.intro.slice(0, 2).map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : methodology?.criteria.length ? (
                  <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {methodology.criteria.map((criterion) => (
                      <div key={`${criterion.key ?? criterion.title}`} className="rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs uppercase tracking-[0.24em] text-blue-700">
                            {criterion.key ?? "РљСЂРёС‚РµСЂРёР№"}
                          </div>
                          {criterion.points !== null ? (
                            <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 ring-1 ring-slate-200">
                              {formatScore(criterion.points)}
                            </div>
                          ) : null}
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-600">{criterion.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">
                    Р”Р»СЏ РІС‹Р±СЂР°РЅРЅРѕРіРѕ РіРѕРґР° РјРµС‚РѕРґРѕР»РѕРіРёСЏ РІ Р°СЂС…РёРІРµ РЅРµ РЅР°Р№РґРµРЅР°, РЅРѕ СЃР°РјР° СЂРµР№С‚РёРЅРіРѕРІР°СЏ С‚Р°Р±Р»РёС†Р° РґРѕСЃС‚СѓРїРЅР° РЅРёР¶Рµ.
                  </div>
                )}
              </section>

              <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Р›РёРґРµСЂС‹ РІС‹Р±РѕСЂРєРё</div>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                      РџРµСЂРІС‹Рµ РїРѕР·РёС†РёРё РїРѕ РІС‹Р±СЂР°РЅРЅС‹Рј С„РёР»СЊС‚СЂР°Рј
                    </h2>
                  </div>

                  <div className="text-sm leading-6 text-slate-500">
                    РљР°СЂС‚РѕС‡РєРё РїРѕРєР°Р·С‹РІР°СЋС‚ РёС‚РѕРіРѕРІС‹Р№ Р±Р°Р»Р», СЃР°Р№С‚ Рё С‚РµРєСѓС‰РµРµ Р·РЅР°С‡РµРЅРёРµ С„РѕРєСѓСЃРЅРѕРіРѕ РёРЅРґРёРєР°С‚РѕСЂР°.
                  </div>
                </div>

                <div className="mt-8 grid gap-5 xl:grid-cols-3">
                  {leaders.length > 0 ? (
                    leaders.map((row, index) => (
                      <article
                        key={row.id}
                        className="rounded-[1.8rem] bg-[linear-gradient(180deg,#0d2b6b_0%,#0f3d84_100%)] p-6 text-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-950/10"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-xs uppercase tracking-[0.24em] text-blue-200">
                              {index === 0 ? "Р›РёРґРµСЂ" : `РџРѕР·РёС†РёСЏ ${row.place}`}
                            </div>
                            <h3 className="mt-3 text-xl font-semibold leading-snug">{row.universityName}</h3>
                          </div>

                          <div className="rounded-full bg-white/10 px-4 py-2 text-lg font-semibold">
                            #{row.place}
                          </div>
                        </div>

                        <div className="mt-6 rounded-[1.3rem] border border-white/10 bg-white/10 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-blue-100">РЎР°Р№С‚</div>
                          {row.websiteUrl ? (
                            <a
                              href={row.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-white/30 underline-offset-4 transition hover:text-emerald-200"
                            >
                              {getDomainLabel(row.websiteUrl)}
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                          ) : (
                            <div className="mt-2 text-sm text-blue-100">РЎСЃС‹Р»РєР° РЅРµ СѓРєР°Р·Р°РЅР°</div>
                          )}
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          <div className="rounded-[1.3rem] bg-white/10 p-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-blue-100">РС‚РѕРіРѕ</div>
                            <div className="mt-2 text-3xl font-semibold">{formatScore(row.totalScore)}</div>
                          </div>
                          <div className="rounded-[1.3rem] bg-white/10 p-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-blue-100">
                              {focusedMetricKey ?? "РњРµС‚СЂРёРєР°"}
                            </div>
                            <div className="mt-2 text-3xl font-semibold">
                              {focusedMetricKey ? formatScore(row.metrics[focusedMetricKey] ?? null) : "РЅ/Рґ"}
                            </div>
                          </div>
                        </div>

                        {hasCategoryFilter ? (
                          <div className="mt-5 inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ring-white/15">
                            {row.categoryLabel}
                          </div>
                        ) : null}
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500 xl:col-span-3">
                      РџРѕ РІС‹Р±СЂР°РЅРЅС‹Рј С„РёР»СЊС‚СЂР°Рј РЅРёС‡РµРіРѕ РЅРµ РЅР°Р№РґРµРЅРѕ.
                    </div>
                  )}
                </div>
              </section>
 
              <section
                id="website-ranking-table"
                className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РџРѕР»РЅР°СЏ С‚Р°Р±Р»РёС†Р°</div>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                      Р РµР·СѓР»СЊС‚Р°С‚С‹ СЂРµР№С‚РёРЅРіР° СЃР°Р№С‚РѕРІ {selectedYear} РіРѕРґР°
                    </h2>
                  </div>

                  <div className="text-sm leading-6 text-slate-500">
                    {focusedMetricKey
                      ? `РЎРµР№С‡Р°СЃ Р°РєС†РµРЅС‚ РЅР° РїРѕРєР°Р·Р°С‚РµР»Рµ ${focusedMetricKey}.`
                      : "Р”Р»СЏ СЌС‚РѕРіРѕ РіРѕРґР° РѕРїСѓР±Р»РёРєРѕРІР°РЅ РёС‚РѕРіРѕРІС‹Р№ СЂРµР№С‚РёРЅРі Р±РµР· РґРµС‚Р°Р»РёР·Р°С†РёРё РїРѕ РѕС‚РґРµР»СЊРЅС‹Рј РјРµС‚СЂРёРєР°Рј."}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Award className="h-4 w-4 text-blue-700" />
                      Р’СЃРµРіРѕ СЃС‚СЂРѕРє
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{visibleRows.length}</div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <LayoutGrid className="h-4 w-4 text-blue-700" />
                      РљР°С‚РµРіРѕСЂРёР№
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">
                      {hasCategoryFilter ? categories.length : 1}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Waypoints className="h-4 w-4 text-blue-700" />
                      РњРµС‚СЂРёРє
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{metricColumns.length}</div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Sparkles className="h-4 w-4 text-blue-700" />
                      Р›СѓС‡С€РёР№ Р±Р°Р»Р»
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{formatScore(bestVisibleScore)}</div>
                  </div>
                </div>

                <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr className="text-left text-sm text-slate-500">
                          <th className="px-4 py-4 font-medium">РњРµСЃС‚Рѕ</th>
                          <th className="px-4 py-4 font-medium">Р’СѓР· Рё СЃР°Р№С‚</th>
                          {hasCategoryFilter ? <th className="px-4 py-4 font-medium">РљР°С‚РµРіРѕСЂРёСЏ</th> : null}
                          {focusedMetricKey ? (
                            <th className="px-4 py-4 font-medium">
                              {focusedMetricKey}
                              {highlightedMetric && highlightedMetric.points !== null
                                ? ` В· ${formatScore(highlightedMetric.points)}`
                                : ""}
                            </th>
                          ) : null}
                          <th className="px-4 py-4 font-medium">РС‚РѕРіРѕ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {visibleRows.length > 0 ? (
                          visibleRows.map((row) => (
                            <tr key={row.id} className="align-top text-sm text-slate-700 transition hover:bg-slate-50">
                              <td className="px-4 py-4">
                                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                                  #{row.place}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="font-semibold text-slate-950">{row.universityName}</div>
                                {row.websiteUrl ? (
                                  <a
                                    href={row.websiteUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-flex items-center gap-2 text-sm text-blue-700 transition hover:text-blue-900"
                                  >
                                    {getDomainLabel(row.websiteUrl)}
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                ) : (
                                  <div className="mt-2 text-sm text-slate-400">РЎР°Р№С‚ РЅРµ СѓРєР°Р·Р°РЅ</div>
                                )}
                              </td>

                              {hasCategoryFilter ? (
                                <td className="px-4 py-4">
                                  <span
                                    className={`inline-flex rounded-full px-3 py-2 text-xs font-medium ring-1 ring-inset ${getCategoryTone(
                                      row.categoryKey,
                                    )}`}
                                  >
                                    {row.categoryLabel}
                                  </span>
                                </td>
                              ) : null}

                              {focusedMetricKey ? (
                                <td className="px-4 py-4 font-medium text-slate-950">
                                  {formatScore(row.metrics[focusedMetricKey] ?? null)}
                                </td>
                              ) : null}

                              <td className="px-4 py-4 font-semibold text-slate-950">{formatScore(row.totalScore)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={hasCategoryFilter ? (focusedMetricKey ? 5 : 4) : focusedMetricKey ? 4 : 3}
                              className="px-6 py-12 text-center text-slate-500"
                            >
                              РџРѕ С‚РµРєСѓС‰РёРј С„РёР»СЊС‚СЂР°Рј РЅРµС‚ СЃС‚СЂРѕРє РґР»СЏ РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Р§С‚Рѕ РІР°Р¶РЅРѕ С‡РёС‚Р°С‚СЊ</div>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                    РќРµ С‚РѕР»СЊРєРѕ РёС‚РѕРі, РЅРѕ Рё С†РёС„СЂРѕРІР°СЏ РѕС‚РєСЂС‹С‚РѕСЃС‚СЊ
                  </h2>

                  <div className="mt-8 grid gap-6 md:grid-cols-3">
                    <div className="border-l-2 border-blue-100 pl-5">
                      <div className="text-lg font-semibold text-slate-950">РљРѕРЅС‚РµРЅС‚ СЃР°Р№С‚Р°</div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Р РµР№С‚РёРЅРі РїРѕРєР°Р·С‹РІР°РµС‚ РЅРµ С‚РѕР»СЊРєРѕ РґРёР·Р°Р№РЅ, РЅРѕ Рё РѕР±СЉС‘Рј РїРѕР»РµР·РЅРѕР№ РёРЅС„РѕСЂРјР°С†РёРё, РґРѕРєСѓРјРµРЅС‚РѕРІ Рё
                        РґРѕСЃС‚СѓРїРЅС‹С… СЂР°Р·РґРµР»РѕРІ.
                      </p>
                    </div>

                    <div className="border-l-2 border-emerald-100 pl-5">
                      <div className="text-lg font-semibold text-slate-950">РћС‚РєСЂС‹С‚РѕСЃС‚СЊ РґР»СЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ</div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Р’Р°Р¶РЅС‹ СЏР·С‹Рє, СЃРєРѕСЂРѕСЃС‚СЊ, РїРѕСЃРµС‰Р°РµРјРѕСЃС‚СЊ Рё РЅР°РІРёРіР°С†РёСЏ: СЃР°Р№С‚ РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РїРѕРЅСЏС‚РЅС‹Рј Рё РґРѕСЃС‚СѓРїРЅС‹Рј
                        РґР»СЏ Р°Р±РёС‚СѓСЂРёРµРЅС‚Р°, СЃС‚СѓРґРµРЅС‚Р° Рё СЌРєСЃРїРµСЂС‚Р°.
                      </p>
                    </div>

                    <div className="border-l-2 border-orange-100 pl-5">
                      <div className="text-lg font-semibold text-slate-950">РђСЂС…РёРІ РїРѕ РіРѕРґР°Рј</div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Р§РµСЂРµР· РїРµСЂРµРєР»СЋС‡РµРЅРёРµ РїРѕ РіРѕРґР°Рј РјРѕР¶РЅРѕ СѓРІРёРґРµС‚СЊ, РєР°Рє РјРµРЅСЏР»РёСЃСЊ С„РѕСЂРјР°С‚ РїСѓР±Р»РёРєР°С†РёРё, РєСЂРёС‚РµСЂРёРё Рё
                        СЃРѕСЃС‚Р°РІ СѓС‡Р°СЃС‚РЅРёРєРѕРІ СЂРµР№С‚РёРЅРіР°.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-[#102e5e] p-6 text-white shadow-sm">
                  <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-200">РЎРІРѕРґРєР° РіРѕРґР°</div>
                  <h2 className="mt-2 text-3xl font-semibold">{selectedYear}</h2>
                  <p className="mt-4 text-sm leading-6 text-blue-100">
                    РЎС‚СЂР°РЅРёС†Р° СЃРѕР±РёСЂР°РµС‚ Р°СЂС…РёРІРЅС‹Рµ РїСѓР±Р»РёРєР°С†РёРё СЃС‚Р°СЂРѕРіРѕ СЃР°Р№С‚Р° IQAA Рё РїРµСЂРµРІРѕРґРёС‚ РёС… РІ РµРґРёРЅС‹Р№,
                    С‡РёС‚Р°РµРјС‹Р№ РёРЅС‚РµСЂС„РµР№СЃ СЃ РїРѕРёСЃРєРѕРј, РїРµСЂРµРєР»СЋС‡РµРЅРёРµРј РєСЂРёС‚РµСЂРёРµРІ Рё СЃСЃС‹Р»РєР°РјРё РЅР° СЃР°Р№С‚С‹ РІСѓР·РѕРІ.
                  </p>

                  <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">РСЃС‚РѕС‡РЅРёРє</span>
                      <span className="font-medium">РђСЂС…РёРІ IQAA</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Р¤РѕСЂРјР°С‚</span>
                      <span className="font-medium">
                        {selectedRating?.categoryCount && selectedRating.categoryCount > 1
                          ? "РџСЂРѕС„РёР»СЊРЅС‹Рµ РєР°С‚РµРіРѕСЂРёРё"
                          : "Р•РґРёРЅС‹Р№ СЃРїРёСЃРѕРє"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">РњРµС‚РѕРґРѕР»РѕРіРёСЏ</span>
                      <span className="font-medium">{methodology ? "РґРѕСЃС‚СѓРїРЅР°" : "РЅРµ РЅР°Р№РґРµРЅР°"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">РљСЂРёС‚РµСЂРёРµРІ</span>
                      <span className="font-medium">{methodology?.criteria.length ?? 0}</span>
                    </div>
                  </div>

                  <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-blue-100">
                      <FileText className="h-4 w-4" />
                      РќР°РІРёРіР°С†РёСЏ РїРѕ Р°СЂС…РёРІСѓ
                    </div>
                    <p className="mt-3 text-sm leading-6 text-blue-100">
                      РћС‚РєСЂРѕР№ Р»СЋР±РѕР№ РіРѕРґ, СЃС„РѕРєСѓСЃРёСЂСѓР№СЃСЏ РЅР° РѕС‚РґРµР»СЊРЅРѕРј РєСЂРёС‚РµСЂРёРё Рё СЃРјРѕС‚СЂРё, РєС‚Рѕ Р»РёРґРёСЂРѕРІР°Р» РїРѕ
                      С†РёС„СЂРѕРІРѕРјСѓ РїСЂРёСЃСѓС‚СЃС‚РІРёСЋ Рё СѓРґРѕР±СЃС‚РІСѓ СЃР°Р№С‚Р°.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
