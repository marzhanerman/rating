import { Head, Link } from "@inertiajs/react";
import {
  ArrowRight,
  Award,
  BookOpenText,
  ChevronRight,
  Filter,
  GraduationCap,
  Layers3,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";

type YearOption = {
  year: number;
  levelType: "program" | "group";
  entryCount: number;
  levelCount: number;
  universityCount: number;
  scoredCount: number;
  hasScores: boolean;
  label: string;
  shortLabel: string;
};

type RatingItem = {
  id: number;
  rank: number;
  totalScore: number | null;
  levelType: "program" | "group";
  university: {
    id: number;
    currentName: string;
    city?: string | null;
  } | null;
  level: {
    id: number;
    code?: string | null;
    name?: string | null;
    label: string;
  };
  programs: Array<{
    code?: string | null;
    name?: string | null;
  }>;
};

type Props = {
  selectedYear: number;
  selectedMeta: YearOption | null;
  yearOptions: YearOption[];
  ratings: RatingItem[];
};

type RankFilter = "all" | "top1" | "top3" | "top10";

const rankFilters: Array<{ value: RankFilter; label: string }> = [
  { value: "all", label: "Все позиции" },
  { value: "top1", label: "Только 1 место" },
  { value: "top3", label: "Топ-3" },
  { value: "top10", label: "Топ-10" },
];

const matchesRankFilter = (rank: number, filter: RankFilter) => {
  if (filter === "top1") return rank === 1;
  if (filter === "top3") return rank <= 3;
  if (filter === "top10") return rank <= 10;

  return true;
};

const formatScore = (value: number | null) => (value === null ? "Не опубликован" : value.toFixed(2));

const formatCompactScore = (value: number | null) => (value === null ? "н/д" : value.toFixed(2));

const normalizeText = (value: string) => value.toLocaleLowerCase();

export default function ProgramRankingPage({
  selectedYear,
  selectedMeta,
  yearOptions = [],
  ratings = [],
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [rankFilter, setRankFilter] = useState<RankFilter>("all");

  const normalizedQuery = normalizeText(searchQuery.trim());

  const filteredRatings = ratings.filter((rating) => {
    const searchIndex = [
      rating.university?.currentName ?? "",
      rating.university?.city ?? "",
      rating.level.code ?? "",
      rating.level.name ?? "",
      rating.level.label,
      ...rating.programs.flatMap((program) => [program.code ?? "", program.name ?? ""]),
    ]
      .join(" ")
      .toLocaleLowerCase();

    const matchesSearch = !normalizedQuery || searchIndex.includes(normalizedQuery);

    return matchesSearch && matchesRankFilter(rating.rank, rankFilter);
  });

  const groupedLevels: Array<{
    key: string;
    level: RatingItem["level"];
    rows: RatingItem[];
    winner: RatingItem;
    programs: RatingItem["programs"];
  }> = [];

  const groupedLevelMap = new Map<
    string,
    {
      key: string;
      level: RatingItem["level"];
      rows: RatingItem[];
      programs: RatingItem["programs"];
    }
  >();

  filteredRatings.forEach((rating) => {
    const key = `${rating.levelType}-${rating.level.id}`;
    const group = groupedLevelMap.get(key);

    if (group) {
      group.rows.push(rating);

      if (group.programs.length === 0 && rating.programs.length > 0) {
        group.programs = rating.programs;
      }

      return;
    }

    groupedLevelMap.set(key, {
      key,
      level: rating.level,
      rows: [rating],
      programs: rating.programs,
    });
  });

  groupedLevelMap.forEach((group) => {
    const rows = [...group.rows].sort((left, right) => {
      if (left.rank !== right.rank) {
        return left.rank - right.rank;
      }

      return (left.university?.currentName ?? "").localeCompare(right.university?.currentName ?? "", "ru");
    });

    groupedLevels.push({
      ...group,
      rows,
      winner: rows[0],
    });
  });

  groupedLevels.sort((left, right) => {
    if (left.winner.rank !== right.winner.rank) {
      return left.winner.rank - right.winner.rank;
    }

    return left.level.label.localeCompare(right.level.label, "ru");
  });

  const featuredLevels = groupedLevels.slice(0, 6);

  const sortedRatings = [...filteredRatings].sort((left, right) => {
    const levelCompare = left.level.label.localeCompare(right.level.label, "ru");

    if (levelCompare !== 0) {
      return levelCompare;
    }

    if (left.rank !== right.rank) {
      return left.rank - right.rank;
    }

    return (left.university?.currentName ?? "").localeCompare(right.university?.currentName ?? "", "ru");
  });

  const visibleUniversityIds = new Set<number>();
  let bestScore = 0;

  filteredRatings.forEach((rating) => {
    if (rating.university?.id) {
      visibleUniversityIds.add(rating.university.id);
    }

    if (rating.totalScore !== null) {
      bestScore = Math.max(bestScore, rating.totalScore);
    }
  });

  const activeMode = selectedMeta?.levelType === "program" ? "образовательных программ" : "групп образовательных программ";
  const activeModeShort = selectedMeta?.levelType === "program" ? "программы" : "группы ОП";
  const programEraLabel =
    selectedMeta?.levelType === "program"
      ? "До 2020 года рейтинги публиковались по отдельным образовательным программам."
      : "Начиная с 2020 года рейтинги публикуются по группам образовательных программ.";

  return (
    <>
      <Head title="Программный рейтинг" />

      <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
        <section className="relative overflow-hidden bg-[#0d2b6b] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.2),transparent_28%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:72px_72px]" />

          <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-6">
            <header className="flex flex-col gap-6 rounded-[1.75rem] border border-slate-200/80 bg-white/95 px-5 py-4 shadow-xl shadow-slate-950/10 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
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
                <span className="font-medium text-slate-950">Программный рейтинг</span>
              </nav>
            </header>

            <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1.05fr)_360px] lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-blue-100">
                  <GraduationCap className="h-4 w-4" />
                  Программный рейтинг {selectedYear}
                </div>

                <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
                  Рейтинг образовательных программ и групп образовательных программ
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 md:text-lg">
                  Страница собирает данные из программного рейтинга IQAA по годам: до 2019 года ранжирование шло по
                  отдельным образовательным программам, а с 2020 года по группам образовательных программ.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#program-year-grid"
                    className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Выбрать год
                    <ChevronRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#program-ranking-table"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Смотреть таблицу
                  </a>
                  <Link
                    href="/methodology"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Методология
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Записей</div>
                    <div className="mt-3 text-4xl font-semibold">{selectedMeta?.entryCount ?? 0}</div>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">{selectedMeta?.shortLabel ?? "Формат"}</div>
                    <div className="mt-3 text-4xl font-semibold">{selectedMeta?.levelCount ?? 0}</div>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Вузов</div>
                    <div className="mt-3 text-4xl font-semibold">{selectedMeta?.universityCount ?? 0}</div>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Баллы</div>
                    <div className="mt-3 text-xl font-semibold">{selectedMeta?.hasScores ? "есть" : "нет"}</div>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-950/20 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-blue-100">Формат выбранного года</div>
                  <div className="mt-2 text-lg font-semibold">{selectedMeta?.label ?? "Программный рейтинг"}</div>
                  <p className="mt-2 text-sm leading-6 text-blue-100/85">{programEraLabel}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-6 py-12">
          <section
            id="program-year-grid"
            className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Годы публикации</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Переключение между годами и форматами</h2>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Здесь можно открыть любой доступный год и сразу увидеть, относится ли он к рейтингу образовательных
                программ или к рейтингу групп образовательных программ.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {yearOptions.map((option) => {
                const isActive = option.year === selectedYear;

                return (
                  <Link
                    key={option.year}
                    href={`/program-ranking?year=${option.year}`}
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
                          {option.shortLabel}
                        </div>
                        <div className="mt-3 text-3xl font-semibold">{option.year}</div>
                      </div>

                      <div
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                          isActive ? "bg-white/10 text-white" : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {option.hasScores ? "С баллами" : "Без баллов"}
                      </div>
                    </div>

                    <div className={`mt-4 text-sm leading-6 ${isActive ? "text-blue-100" : "text-slate-600"}`}>
                      {option.entryCount} записей, {option.levelCount} {option.levelType === "program" ? "программ" : "групп"}.
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Фильтры и контекст</h2>
                  <p className="text-sm text-slate-500">Поиск работает по вузу, коду и названию программы или группы.</p>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="program-search" className="mb-2 block text-sm font-medium text-slate-700">
                  Поиск по названию или коду
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    id="program-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Например, B001 или Педагогика"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 text-sm font-medium text-slate-700">Показывать позиции</div>
                <div className="flex flex-wrap gap-3">
                  {rankFilters.map((option) => {
                    const isActive = rankFilter === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRankFilter(option.value)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          isActive
                            ? "bg-[#0d2b6b] text-white shadow-lg shadow-blue-950/15"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 space-y-5 border-t border-slate-200 pt-6">
                <div className="rounded-[1.5rem] bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    {selectedMeta?.levelType === "program" ? (
                      <BookOpenText className="h-4 w-4 text-blue-700" />
                    ) : (
                      <Layers3 className="h-4 w-4 text-blue-700" />
                    )}
                    Текущий формат
                  </div>
                  <div className="mt-2 text-lg font-semibold text-slate-950">{selectedMeta?.label ?? "Не указан"}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{programEraLabel}</p>
                </div>

                <div>
                  <div className="text-sm text-slate-500">Показано строк</div>
                  <div className="mt-1 text-3xl font-semibold text-slate-950">{filteredRatings.length}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">Показано {activeModeShort}</div>
                  <div className="mt-1 text-3xl font-semibold text-slate-950">{groupedLevels.length}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">Уникальных вузов</div>
                  <div className="mt-1 text-3xl font-semibold text-slate-950">{visibleUniversityIds.size}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">Лучший балл в выборке</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-950">
                    {bestScore > 0 ? bestScore.toFixed(2) : "не опубликован"}
                  </div>
                </div>
              </div>

              {!selectedMeta?.hasScores ? (
                <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  Для этого года в таблице опубликованы позиции без итогового балла. Поэтому акцент на месте в рейтинге,
                  а не на числовом результате.
                </div>
              ) : null}
            </aside>

            <div className="space-y-6">
              <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Первые места</div>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                      Лидеры внутри выбранных {activeMode}
                    </h2>
                  </div>

                  <div className="text-sm leading-6 text-slate-500">
                    Эти карточки показывают первые места внутри каждой программы или группы после применённых фильтров.
                  </div>
                </div>

                <div className="mt-8 grid gap-5 xl:grid-cols-2">
                  {featuredLevels.length > 0 ? (
                    featuredLevels.map((group) => (
                      <article
                        key={group.key}
                        className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-xs uppercase tracking-[0.24em] text-blue-700">
                              {selectedMeta?.levelType === "program" ? "Программа" : "Группа ОП"}
                            </div>
                            <h3 className="mt-3 text-xl font-semibold leading-snug text-slate-950">{group.level.label}</h3>
                          </div>

                          <div className="rounded-full bg-orange-50 px-4 py-2 text-lg font-semibold text-orange-700">
                            #{group.winner.rank}
                          </div>
                        </div>

                        <div className="mt-5 space-y-3">
                          <div>
                            <div className="text-sm text-slate-500">Лидер</div>
                            <div className="mt-1 text-lg font-semibold text-slate-950">
                              {group.winner.university?.currentName ?? "Вуз не указан"}
                            </div>
                            {group.winner.university?.city ? (
                              <div className="mt-1 text-sm text-slate-500">{group.winner.university.city}</div>
                            ) : null}
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Участников</div>
                              <div className="mt-2 text-2xl font-semibold text-slate-950">{group.rows.length}</div>
                            </div>
                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Балл лидера</div>
                              <div className="mt-2 text-2xl font-semibold text-slate-950">
                                {formatCompactScore(group.winner.totalScore)}
                              </div>
                            </div>
                          </div>

                          {group.programs.length > 0 ? (
                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Состав группы</div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {group.programs.slice(0, 3).map((program, index) => (
                                  <span
                                    key={`${group.key}-program-${index}`}
                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                                  >
                                    {[program.code, program.name].filter(Boolean).join(" — ")}
                                  </span>
                                ))}
                                {group.programs.length > 3 ? (
                                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                                    +{group.programs.length - 3} программ
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500 xl:col-span-2">
                      По текущим фильтрам ничего не найдено. Попробуйте убрать часть запроса или расширить диапазон позиций.
                    </div>
                  )}
                </div>
              </section>

              <section
                id="program-ranking-table"
                className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Полная таблица</div>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                      Позиции вузов внутри программ и групп {selectedYear} года
                    </h2>
                  </div>

                  <div className="text-sm leading-6 text-slate-500">
                    Каждая строка показывает место вуза внутри конкретной программы или группы образовательных программ.
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Award className="h-4 w-4 text-blue-700" />
                      Всего строк
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{filteredRatings.length}</div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Trophy className="h-4 w-4 text-blue-700" />
                      Лидеров
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">
                      {filteredRatings.filter((item) => item.rank === 1).length}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Users className="h-4 w-4 text-blue-700" />
                      Уникальных вузов
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{visibleUniversityIds.size}</div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <BookOpenText className="h-4 w-4 text-blue-700" />
                      Формат
                    </div>
                    <div className="mt-2 text-lg font-semibold text-slate-950">{selectedMeta?.shortLabel ?? "Не указан"}</div>
                  </div>
                </div>

                <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr className="text-left text-sm text-slate-500">
                          <th className="px-4 py-4 font-medium">Программа / группа</th>
                          <th className="px-4 py-4 font-medium">Вуз</th>
                          <th className="px-4 py-4 font-medium">Город</th>
                          <th className="px-4 py-4 font-medium">Место</th>
                          <th className="px-4 py-4 font-medium">Балл</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {sortedRatings.length > 0 ? (
                          sortedRatings.map((rating) => (
                            <tr key={rating.id} className="align-top text-sm text-slate-700">
                              <td className="px-4 py-4">
                                <div className="font-semibold text-slate-950">{rating.level.label}</div>
                                {rating.programs.length > 0 ? (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {rating.programs.slice(0, 2).map((program, index) => (
                                      <span
                                        key={`${rating.id}-program-${index}`}
                                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                                      >
                                        {[program.code, program.name].filter(Boolean).join(" — ")}
                                      </span>
                                    ))}
                                    {rating.programs.length > 2 ? (
                                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                                        +{rating.programs.length - 2}
                                      </span>
                                    ) : null}
                                  </div>
                                ) : null}
                              </td>
                              <td className="px-4 py-4">
                                <div className="font-medium text-slate-950">
                                  {rating.university?.currentName ?? "Вуз не указан"}
                                </div>
                              </td>
                              <td className="px-4 py-4 text-slate-500">{rating.university?.city ?? "—"}</td>
                              <td className="px-4 py-4">
                                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                                  #{rating.rank}
                                </span>
                              </td>
                              <td className="px-4 py-4 font-medium text-slate-950">{formatScore(rating.totalScore)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                              По текущим фильтрам нет строк для отображения.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
