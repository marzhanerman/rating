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
import RankingHero, { RankingHeroPanel, RankingHeroStat } from "@/components/hero/ranking-hero";

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
  { value: "all", label: "Р’СЃРµ РїРѕР·РёС†РёРё" },
  { value: "top1", label: "РўРѕР»СЊРєРѕ 1 РјРµСЃС‚Рѕ" },
  { value: "top3", label: "РўРѕРї-3" },
  { value: "top10", label: "РўРѕРї-10" },
];

const matchesRankFilter = (rank: number, filter: RankFilter) => {
  if (filter === "top1") return rank === 1;
  if (filter === "top3") return rank <= 3;
  if (filter === "top10") return rank <= 10;

  return true;
};

const formatScore = (value: number | null) => (value === null ? "РќРµ РѕРїСѓР±Р»РёРєРѕРІР°РЅ" : value.toFixed(2));

const formatCompactScore = (value: number | null) => (value === null ? "РЅ/Рґ" : value.toFixed(2));

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

  const activeMode = selectedMeta?.levelType === "program" ? "РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹С… РїСЂРѕРіСЂР°РјРј" : "РіСЂСѓРїРї РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹С… РїСЂРѕРіСЂР°РјРј";
  const activeModeShort = selectedMeta?.levelType === "program" ? "РїСЂРѕРіСЂР°РјРјС‹" : "РіСЂСѓРїРїС‹ РћРџ";
  const programEraLabel =
    selectedMeta?.levelType === "program"
      ? "Р”Рѕ 2020 РіРѕРґР° СЂРµР№С‚РёРЅРіРё РїСѓР±Р»РёРєРѕРІР°Р»РёСЃСЊ РїРѕ РѕС‚РґРµР»СЊРЅС‹Рј РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹Рј РїСЂРѕРіСЂР°РјРјР°Рј."
      : "РќР°С‡РёРЅР°СЏ СЃ 2020 РіРѕРґР° СЂРµР№С‚РёРЅРіРё РїСѓР±Р»РёРєСѓСЋС‚СЃСЏ РїРѕ РіСЂСѓРїРїР°Рј РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹С… РїСЂРѕРіСЂР°РјРј.";

  return (
    <>
      <Head title="РџСЂРѕРіСЂР°РјРјРЅС‹Р№ СЂРµР№С‚РёРЅРі" />

      <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
        <RankingHero
          currentPath="/program-ranking"
          badge={
            <>
              <GraduationCap className="h-4 w-4 text-blue-300" />
              Программный рейтинг {selectedYear}
            </>
          }
          title="Рейтинг образовательных программ и групп образовательных программ"
          description="Страница собирает данные из программного рейтинга IQAA по годам: до 2019 года ранжирование шло по отдельным образовательным программам, а с 2020 года по группам образовательных программ."
          actions={
            <>
              <a
                href="#program-year-grid"
                className="btn-orange inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
              >
                Выбрать год
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#program-ranking-table"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Смотреть таблицу
              </a>
              <Link
                href="/methodology"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Методология
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          }
          aside={
            <div className="space-y-4 lg:ml-auto lg:max-w-md">
              <div className="grid grid-cols-2 gap-3">
                <RankingHeroStat label="Записей" value={selectedMeta?.entryCount ?? 0} valueClassName="text-3xl" />
                <RankingHeroStat label={selectedMeta?.shortLabel ?? "Формат"} value={selectedMeta?.levelCount ?? 0} valueClassName="text-3xl" />
                <RankingHeroStat label="Вузов" value={selectedMeta?.universityCount ?? 0} valueClassName="text-3xl" />
                <RankingHeroStat label="Баллы" value={selectedMeta?.hasScores ? "есть" : "нет"} valueClassName="text-2xl" />
              </div>

              <RankingHeroPanel className="rounded-[1.75rem] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300/70">
                  Формат выбранного года
                </div>
                <div className="mt-3 text-xl font-semibold text-white">
                  {selectedMeta?.label ?? "Программный рейтинг"}
                </div>
                <p className="mt-3 text-sm leading-6 text-blue-100/65">{programEraLabel}</p>
              </RankingHeroPanel>
            </div>
          }
        />

        <main className="mx-auto max-w-7xl px-6 py-12">
          <section
            id="program-year-grid"
            className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Р“РѕРґС‹ РїСѓР±Р»РёРєР°С†РёРё</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">РџРµСЂРµРєР»СЋС‡РµРЅРёРµ РјРµР¶РґСѓ РіРѕРґР°РјРё Рё С„РѕСЂРјР°С‚Р°РјРё</h2>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Р—РґРµСЃСЊ РјРѕР¶РЅРѕ РѕС‚РєСЂС‹С‚СЊ Р»СЋР±РѕР№ РґРѕСЃС‚СѓРїРЅС‹Р№ РіРѕРґ Рё СЃСЂР°Р·Сѓ СѓРІРёРґРµС‚СЊ, РѕС‚РЅРѕСЃРёС‚СЃСЏ Р»Рё РѕРЅ Рє СЂРµР№С‚РёРЅРіСѓ РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹С…
                РїСЂРѕРіСЂР°РјРј РёР»Рё Рє СЂРµР№С‚РёРЅРіСѓ РіСЂСѓРїРї РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹С… РїСЂРѕРіСЂР°РјРј.
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
                        {option.hasScores ? "РЎ Р±Р°Р»Р»Р°РјРё" : "Р‘РµР· Р±Р°Р»Р»РѕРІ"}
                      </div>
                    </div>

                    <div className={`mt-4 text-sm leading-6 ${isActive ? "text-blue-100" : "text-slate-600"}`}>
                      {option.entryCount} Р·Р°РїРёСЃРµР№, {option.levelCount} {option.levelType === "program" ? "РїСЂРѕРіСЂР°РјРј" : "РіСЂСѓРїРї"}.
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
                  <h2 className="text-lg font-semibold">Р¤РёР»СЊС‚СЂС‹ Рё РєРѕРЅС‚РµРєСЃС‚</h2>
                  <p className="text-sm text-slate-500">РџРѕРёСЃРє СЂР°Р±РѕС‚Р°РµС‚ РїРѕ РІСѓР·Сѓ, РєРѕРґСѓ Рё РЅР°Р·РІР°РЅРёСЋ РїСЂРѕРіСЂР°РјРјС‹ РёР»Рё РіСЂСѓРїРїС‹.</p>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="program-search" className="mb-2 block text-sm font-medium text-slate-700">
                  РџРѕРёСЃРє РїРѕ РЅР°Р·РІР°РЅРёСЋ РёР»Рё РєРѕРґСѓ
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    id="program-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="РќР°РїСЂРёРјРµСЂ, B001 РёР»Рё РџРµРґР°РіРѕРіРёРєР°"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 text-sm font-medium text-slate-700">РџРѕРєР°Р·С‹РІР°С‚СЊ РїРѕР·РёС†РёРё</div>
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
                    РўРµРєСѓС‰РёР№ С„РѕСЂРјР°С‚
                  </div>
                  <div className="mt-2 text-lg font-semibold text-slate-950">{selectedMeta?.label ?? "РќРµ СѓРєР°Р·Р°РЅ"}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{programEraLabel}</p>
                </div>

                <div>
                  <div className="text-sm text-slate-500">РџРѕРєР°Р·Р°РЅРѕ СЃС‚СЂРѕРє</div>
                  <div className="mt-1 text-3xl font-semibold text-slate-950">{filteredRatings.length}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">РџРѕРєР°Р·Р°РЅРѕ {activeModeShort}</div>
                  <div className="mt-1 text-3xl font-semibold text-slate-950">{groupedLevels.length}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">РЈРЅРёРєР°Р»СЊРЅС‹С… РІСѓР·РѕРІ</div>
                  <div className="mt-1 text-3xl font-semibold text-slate-950">{visibleUniversityIds.size}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">Р›СѓС‡С€РёР№ Р±Р°Р»Р» РІ РІС‹Р±РѕСЂРєРµ</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-950">
                    {bestScore > 0 ? bestScore.toFixed(2) : "РЅРµ РѕРїСѓР±Р»РёРєРѕРІР°РЅ"}
                  </div>
                </div>
              </div>

              {!selectedMeta?.hasScores ? (
                <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  Р”Р»СЏ СЌС‚РѕРіРѕ РіРѕРґР° РІ С‚Р°Р±Р»РёС†Рµ РѕРїСѓР±Р»РёРєРѕРІР°РЅС‹ РїРѕР·РёС†РёРё Р±РµР· РёС‚РѕРіРѕРІРѕРіРѕ Р±Р°Р»Р»Р°. РџРѕСЌС‚РѕРјСѓ Р°РєС†РµРЅС‚ РЅР° РјРµСЃС‚Рµ РІ СЂРµР№С‚РёРЅРіРµ,
                  Р° РЅРµ РЅР° С‡РёСЃР»РѕРІРѕРј СЂРµР·СѓР»СЊС‚Р°С‚Рµ.
                </div>
              ) : null}
            </aside>

            <div className="space-y-6">
              <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РџРµСЂРІС‹Рµ РјРµСЃС‚Р°</div>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                      Р›РёРґРµСЂС‹ РІРЅСѓС‚СЂРё РІС‹Р±СЂР°РЅРЅС‹С… {activeMode}
                    </h2>
                  </div>

                  <div className="text-sm leading-6 text-slate-500">
                    Р­С‚Рё РєР°СЂС‚РѕС‡РєРё РїРѕРєР°Р·С‹РІР°СЋС‚ РїРµСЂРІС‹Рµ РјРµСЃС‚Р° РІРЅСѓС‚СЂРё РєР°Р¶РґРѕР№ РїСЂРѕРіСЂР°РјРјС‹ РёР»Рё РіСЂСѓРїРїС‹ РїРѕСЃР»Рµ РїСЂРёРјРµРЅС‘РЅРЅС‹С… С„РёР»СЊС‚СЂРѕРІ.
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
                              {selectedMeta?.levelType === "program" ? "РџСЂРѕРіСЂР°РјРјР°" : "Р“СЂСѓРїРїР° РћРџ"}
                            </div>
                            <h3 className="mt-3 text-xl font-semibold leading-snug text-slate-950">{group.level.label}</h3>
                          </div>

                          <div className="rounded-full bg-orange-50 px-4 py-2 text-lg font-semibold text-orange-700">
                            #{group.winner.rank}
                          </div>
                        </div>

                        <div className="mt-5 space-y-3">
                          <div>
                            <div className="text-sm text-slate-500">Р›РёРґРµСЂ</div>
                            <div className="mt-1 text-lg font-semibold text-slate-950">
                              {group.winner.university?.currentName ?? "Р’СѓР· РЅРµ СѓРєР°Р·Р°РЅ"}
                            </div>
                            {group.winner.university?.city ? (
                              <div className="mt-1 text-sm text-slate-500">{group.winner.university.city}</div>
                            ) : null}
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">РЈС‡Р°СЃС‚РЅРёРєРѕРІ</div>
                              <div className="mt-2 text-2xl font-semibold text-slate-950">{group.rows.length}</div>
                            </div>
                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Р‘Р°Р»Р» Р»РёРґРµСЂР°</div>
                              <div className="mt-2 text-2xl font-semibold text-slate-950">
                                {formatCompactScore(group.winner.totalScore)}
                              </div>
                            </div>
                          </div>

                          {group.programs.length > 0 ? (
                            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">РЎРѕСЃС‚Р°РІ РіСЂСѓРїРїС‹</div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {group.programs.slice(0, 3).map((program, index) => (
                                  <span
                                    key={`${group.key}-program-${index}`}
                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                                  >
                                    {[program.code, program.name].filter(Boolean).join(" вЂ” ")}
                                  </span>
                                ))}
                                {group.programs.length > 3 ? (
                                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                                    +{group.programs.length - 3} РїСЂРѕРіСЂР°РјРј
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
                      РџРѕ С‚РµРєСѓС‰РёРј С„РёР»СЊС‚СЂР°Рј РЅРёС‡РµРіРѕ РЅРµ РЅР°Р№РґРµРЅРѕ. РџРѕРїСЂРѕР±СѓР№С‚Рµ СѓР±СЂР°С‚СЊ С‡Р°СЃС‚СЊ Р·Р°РїСЂРѕСЃР° РёР»Рё СЂР°СЃС€РёСЂРёС‚СЊ РґРёР°РїР°Р·РѕРЅ РїРѕР·РёС†РёР№.
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
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РџРѕР»РЅР°СЏ С‚Р°Р±Р»РёС†Р°</div>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                      РџРѕР·РёС†РёРё РІСѓР·РѕРІ РІРЅСѓС‚СЂРё РїСЂРѕРіСЂР°РјРј Рё РіСЂСѓРїРї {selectedYear} РіРѕРґР°
                    </h2>
                  </div>

                  <div className="text-sm leading-6 text-slate-500">
                    РљР°Р¶РґР°СЏ СЃС‚СЂРѕРєР° РїРѕРєР°Р·С‹РІР°РµС‚ РјРµСЃС‚Рѕ РІСѓР·Р° РІРЅСѓС‚СЂРё РєРѕРЅРєСЂРµС‚РЅРѕР№ РїСЂРѕРіСЂР°РјРјС‹ РёР»Рё РіСЂСѓРїРїС‹ РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹С… РїСЂРѕРіСЂР°РјРј.
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Award className="h-4 w-4 text-blue-700" />
                      Р’СЃРµРіРѕ СЃС‚СЂРѕРє
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{filteredRatings.length}</div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Trophy className="h-4 w-4 text-blue-700" />
                      Р›РёРґРµСЂРѕРІ
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">
                      {filteredRatings.filter((item) => item.rank === 1).length}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Users className="h-4 w-4 text-blue-700" />
                      РЈРЅРёРєР°Р»СЊРЅС‹С… РІСѓР·РѕРІ
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{visibleUniversityIds.size}</div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <BookOpenText className="h-4 w-4 text-blue-700" />
                      Р¤РѕСЂРјР°С‚
                    </div>
                    <div className="mt-2 text-lg font-semibold text-slate-950">{selectedMeta?.shortLabel ?? "РќРµ СѓРєР°Р·Р°РЅ"}</div>
                  </div>
                </div>

                <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr className="text-left text-sm text-slate-500">
                          <th className="px-4 py-4 font-medium">РџСЂРѕРіСЂР°РјРјР° / РіСЂСѓРїРїР°</th>
                          <th className="px-4 py-4 font-medium">Р’СѓР·</th>
                          <th className="px-4 py-4 font-medium">Р“РѕСЂРѕРґ</th>
                          <th className="px-4 py-4 font-medium">РњРµСЃС‚Рѕ</th>
                          <th className="px-4 py-4 font-medium">Р‘Р°Р»Р»</th>
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
                                        {[program.code, program.name].filter(Boolean).join(" вЂ” ")}
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
                                  {rating.university?.currentName ?? "Р’СѓР· РЅРµ СѓРєР°Р·Р°РЅ"}
                                </div>
                              </td>
                              <td className="px-4 py-4 text-slate-500">{rating.university?.city ?? "вЂ”"}</td>
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
                              РџРѕ С‚РµРєСѓС‰РёРј С„РёР»СЊС‚СЂР°Рј РЅРµС‚ СЃС‚СЂРѕРє РґР»СЏ РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ.
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
