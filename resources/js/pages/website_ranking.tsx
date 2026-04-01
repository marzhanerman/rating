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

const formatScore = (value: number | null) => (value === null ? "н/д" : value.toFixed(2));

const getDomainLabel = (url?: string | null) => {
  if (!url) return "ссылка не указана";

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
          title: `Показатель ${focusedMetricKey}`,
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
      ? `${yearOptions[yearOptions.length - 1]?.year}–${yearOptions[0]?.year}`
      : `${selectedYear}`;

  return (
    <>
      <Head title="Рейтинг сайтов вузов" />

      <div className="min-h-screen bg-[#f5f8fc] text-slate-950">
        <section className="relative overflow-hidden bg-[#0a2c63] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.16),transparent_25%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:72px_72px]" />

          <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-6">
            <header className="flex flex-col gap-6 rounded-[1.8rem] border border-white/10 bg-white/95 px-5 py-4 text-slate-900 shadow-xl shadow-slate-950/10 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
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

              <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <Link href="/" className="transition hover:text-slate-950">
                  Главная
                </Link>
                <span className="text-slate-300">/</span>
                <Link href="/ranking" className="transition hover:text-slate-950">
                  Рейтинг вузов
                </Link>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-slate-950">Рейтинг сайтов</span>
              </nav>
            </header>

            <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1.05fr)_360px] lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-blue-100">
                  <Globe className="h-4 w-4" />
                  Архив рейтинга сайтов {archiveRange}
                </div>

                <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
                  Рейтинг веб-сайтов вузов Казахстана
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 md:text-lg">
                  Интерактивная страница собирает архив IQAA по сайтам вузов: единые списки разных лет,
                  профильные категории 2022 года и методологию по критериям оценки цифровой
                  открытости университетов.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#website-year-grid"
                    className="inline-flex items-center gap-2 rounded-full bg-[#10b981] px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Выбрать год
                    <ChevronRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#website-ranking-table"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Смотреть таблицу
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Год</div>
                    <div className="mt-3 text-4xl font-semibold">{selectedYear}</div>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Записей</div>
                    <div className="mt-3 text-4xl font-semibold">{selectedRating?.entryCount ?? 0}</div>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Категорий</div>
                    <div className="mt-3 text-4xl font-semibold">{selectedRating?.categoryCount ?? 0}</div>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Метрик</div>
                    <div className="mt-3 text-4xl font-semibold">{selectedRating?.metricCount ?? 0}</div>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-950/20 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-blue-100">Лучший итог</div>
                  <div className="mt-2 text-3xl font-semibold">
                    {selectedRating && selectedRating.topScore !== null ? formatScore(selectedRating.topScore) : "н/д"}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-blue-100/85">
                    {selectedRating?.categoryCount && selectedRating.categoryCount > 1
                      ? "В этом году рейтинг опубликован по отдельным профилям вузов."
                      : "В этом году рейтинг опубликован единым списком по казахстанским вузам."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-6 py-12">
          <section
            id="website-year-grid"
            className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Годы публикации</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                  Архив рейтинга сайтов по годам
                </h2>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Можно переключаться между годами, сравнивать формат публикации, наличие методологии
                и смотреть, в каком виде рейтинг публиковался: единым списком или по профилям вузов.
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
                        {option.hasDetailedMetrics ? "С метриками" : "Без метрик"}
                      </div>
                    </div>

                    <div className={`mt-4 text-sm leading-6 ${isActive ? "text-blue-100" : "text-slate-600"}`}>
                      {option.entryCount} записей, {option.categoryCount} категорий, пик {formatScore(option.topScore)}.
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
                  <h2 className="text-lg font-semibold">Фильтры и контекст</h2>
                  <p className="text-sm text-slate-500">Поиск работает по названию вуза, ссылке и категории.</p>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="website-search" className="mb-2 block text-sm font-medium text-slate-700">
                  Поиск по вузу или сайту
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    id="website-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Например, Satbayev или kaznu.kz"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {hasCategoryFilter ? (
                <div className="mt-6">
                  <div className="mb-3 text-sm font-medium text-slate-700">Категория</div>
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
                      Все категории
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
                  <div className="text-sm text-slate-500">Показано строк</div>
                  <div className="mt-1 text-3xl font-semibold text-slate-950">{visibleRows.length}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">Ссылок на сайты</div>
                  <div className="mt-1 text-3xl font-semibold text-slate-950">{websitesCount}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">Активный год</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-950">{selectedYear}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">Лучший балл в выборке</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-950">{formatScore(bestVisibleScore)}</div>
                </div>
              </div>

              {selectedRating?.categoryCount && selectedRating.categoryCount > 1 ? (
                <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  В <span className="font-semibold">{selectedYear}</span> году рейтинг сайтов публиковался по
                  отдельным профилям вузов, поэтому категорий несколько и их удобно сравнивать отдельно.
                </div>
              ) : null}
            </aside>

            <div className="space-y-6">
              <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Методология</div>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                      Как оценивается сайт вуза
                    </h2>
                  </div>

                  <div className="text-sm leading-6 text-slate-500">
                    {methodology?.title ?? "Архивная методология не найдена для выбранного года."}
                  </div>
                </div>

                {metricColumns.length > 0 && methodology?.criteria.length ? (
                  <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <div>
                      <div className="mb-3 text-sm font-medium text-slate-700">Фокус по индикатору</div>
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
                                {criterion.points !== null ? ` · ${formatScore(criterion.points)}` : ""}
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    <div className="rounded-[1.8rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-emerald-700">Активный критерий</div>
                          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                            {highlightedMetric?.key ?? "Индикатор"}
                          </h3>
                        </div>

                        {highlightedMetric && highlightedMetric.points !== null ? (
                          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 ring-1 ring-slate-200">
                            {formatScore(highlightedMetric.points)} балла
                          </div>
                        ) : null}
                      </div>

                      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                        {highlightedMetric?.title ??
                          "Для выбранного года доступны критерии оценки сайта и итоговый балл."}
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
                            {criterion.key ?? "Критерий"}
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
                    Для выбранного года методология в архиве не найдена, но сама рейтинговая таблица доступна ниже.
                  </div>
                )}
              </section>

              <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Лидеры выборки</div>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                      Первые позиции по выбранным фильтрам
                    </h2>
                  </div>

                  <div className="text-sm leading-6 text-slate-500">
                    Карточки показывают итоговый балл, сайт и текущее значение фокусного индикатора.
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
                              {index === 0 ? "Лидер" : `Позиция ${row.place}`}
                            </div>
                            <h3 className="mt-3 text-xl font-semibold leading-snug">{row.universityName}</h3>
                          </div>

                          <div className="rounded-full bg-white/10 px-4 py-2 text-lg font-semibold">
                            #{row.place}
                          </div>
                        </div>

                        <div className="mt-6 rounded-[1.3rem] border border-white/10 bg-white/10 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Сайт</div>
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
                            <div className="mt-2 text-sm text-blue-100">Ссылка не указана</div>
                          )}
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          <div className="rounded-[1.3rem] bg-white/10 p-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Итого</div>
                            <div className="mt-2 text-3xl font-semibold">{formatScore(row.totalScore)}</div>
                          </div>
                          <div className="rounded-[1.3rem] bg-white/10 p-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-blue-100">
                              {focusedMetricKey ?? "Метрика"}
                            </div>
                            <div className="mt-2 text-3xl font-semibold">
                              {focusedMetricKey ? formatScore(row.metrics[focusedMetricKey] ?? null) : "н/д"}
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
                      По выбранным фильтрам ничего не найдено.
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
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Полная таблица</div>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                      Результаты рейтинга сайтов {selectedYear} года
                    </h2>
                  </div>

                  <div className="text-sm leading-6 text-slate-500">
                    {focusedMetricKey
                      ? `Сейчас акцент на показателе ${focusedMetricKey}.`
                      : "Для этого года опубликован итоговый рейтинг без детализации по отдельным метрикам."}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Award className="h-4 w-4 text-blue-700" />
                      Всего строк
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{visibleRows.length}</div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <LayoutGrid className="h-4 w-4 text-blue-700" />
                      Категорий
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">
                      {hasCategoryFilter ? categories.length : 1}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Waypoints className="h-4 w-4 text-blue-700" />
                      Метрик
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{metricColumns.length}</div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Sparkles className="h-4 w-4 text-blue-700" />
                      Лучший балл
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{formatScore(bestVisibleScore)}</div>
                  </div>
                </div>

                <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr className="text-left text-sm text-slate-500">
                          <th className="px-4 py-4 font-medium">Место</th>
                          <th className="px-4 py-4 font-medium">Вуз и сайт</th>
                          {hasCategoryFilter ? <th className="px-4 py-4 font-medium">Категория</th> : null}
                          {focusedMetricKey ? (
                            <th className="px-4 py-4 font-medium">
                              {focusedMetricKey}
                              {highlightedMetric && highlightedMetric.points !== null
                                ? ` · ${formatScore(highlightedMetric.points)}`
                                : ""}
                            </th>
                          ) : null}
                          <th className="px-4 py-4 font-medium">Итого</th>
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
                                  <div className="mt-2 text-sm text-slate-400">Сайт не указан</div>
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
                              По текущим фильтрам нет строк для отображения.
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
                  <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Что важно читать</div>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                    Не только итог, но и цифровая открытость
                  </h2>

                  <div className="mt-8 grid gap-6 md:grid-cols-3">
                    <div className="border-l-2 border-blue-100 pl-5">
                      <div className="text-lg font-semibold text-slate-950">Контент сайта</div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Рейтинг показывает не только дизайн, но и объём полезной информации, документов и
                        доступных разделов.
                      </p>
                    </div>

                    <div className="border-l-2 border-emerald-100 pl-5">
                      <div className="text-lg font-semibold text-slate-950">Открытость для пользователя</div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Важны язык, скорость, посещаемость и навигация: сайт должен быть понятным и доступным
                        для абитуриента, студента и эксперта.
                      </p>
                    </div>

                    <div className="border-l-2 border-orange-100 pl-5">
                      <div className="text-lg font-semibold text-slate-950">Архив по годам</div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Через переключение по годам можно увидеть, как менялись формат публикации, критерии и
                        состав участников рейтинга.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-[#102e5e] p-6 text-white shadow-sm">
                  <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-200">Сводка года</div>
                  <h2 className="mt-2 text-3xl font-semibold">{selectedYear}</h2>
                  <p className="mt-4 text-sm leading-6 text-blue-100">
                    Страница собирает архивные публикации старого сайта IQAA и переводит их в единый,
                    читаемый интерфейс с поиском, переключением критериев и ссылками на сайты вузов.
                  </p>

                  <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Источник</span>
                      <span className="font-medium">Архив IQAA</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Формат</span>
                      <span className="font-medium">
                        {selectedRating?.categoryCount && selectedRating.categoryCount > 1
                          ? "Профильные категории"
                          : "Единый список"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Методология</span>
                      <span className="font-medium">{methodology ? "доступна" : "не найдена"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Критериев</span>
                      <span className="font-medium">{methodology?.criteria.length ?? 0}</span>
                    </div>
                  </div>

                  <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-blue-100">
                      <FileText className="h-4 w-4" />
                      Навигация по архиву
                    </div>
                    <p className="mt-3 text-sm leading-6 text-blue-100">
                      Открой любой год, сфокусируйся на отдельном критерии и смотри, кто лидировал по
                      цифровому присутствию и удобству сайта.
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
