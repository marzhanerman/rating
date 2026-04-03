import { Head, Link, router } from "@inertiajs/react";
import { ArrowUpRight, Award, Building2, ChevronRight, Filter, GraduationCap, Search, Trophy } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import RankingHero, { RankingHeroPanel, RankingHeroStat } from "@/components/hero/ranking-hero";
import MediaCoverage from "@/components/media/media-coverage";
import UniversityProfileCard, { type UniversityProfile } from "@/components/universities/university-profile-card";

type Rating = {
  id: number;
  rank: number;
  total_score: number | string;
  institutional_category: string;
  university: {
    id: number;
    current_name: string;
    city?: string | null;
  } | null;
};

type Props = {
  ratingYear?: number | null;
  availableYears?: number[];
  ratings?: Rating[];
  universityProfiles?: UniversityProfile[];
};

const categoryStyles: Record<string, string> = {
  "РњРЅРѕРіРѕРїСЂРѕС„РёР»СЊРЅС‹Рµ РІСѓР·С‹": "bg-orange-500/15 text-orange-700 ring-orange-200",
  "РўРµС…РЅРёС‡РµСЃРєРёРµ РІСѓР·С‹": "bg-blue-500/15 text-blue-700 ring-blue-200",
  "Р“СѓРјР°РЅРёС‚Р°СЂРЅРѕ-СЌРєРѕРЅРѕРјРёС‡РµСЃРєРёРµ РІСѓР·С‹": "bg-amber-500/15 text-amber-700 ring-amber-200",
  "РџРµРґР°РіРѕРіРёС‡РµСЃРєРёРµ РІСѓР·С‹": "bg-cyan-500/15 text-cyan-700 ring-cyan-200",
  "РњРµРґРёС†РёРЅСЃРєРёРµ РІСѓР·С‹": "bg-emerald-500/15 text-emerald-700 ring-emerald-200",
  "Р’СѓР·С‹ РёСЃРєСѓСЃСЃС‚РІР° Рё СЃРїРѕСЂС‚Р°": "bg-fuchsia-500/15 text-fuchsia-700 ring-fuchsia-200",
};

const getCategoryStyle = (category: string) =>
  categoryStyles[category] ?? "bg-slate-500/10 text-slate-700 ring-slate-200";

const getUniversityImage = (universityId?: number) =>
  universityId ? `/storage/images/universities/${universityId}.jpg` : "";

const formatScore = (value: number | string) => Number(value).toFixed(2);
const getUniversityProfileHref = (universityId?: number | null, year?: number | null) =>
  universityId ? `/ranking/university/${universityId}${year ? `?year=${year}` : ""}` : undefined;

export default function IQAARanking({
  ratingYear,
  availableYears = [],
  ratings = [],
  universityProfiles = [],
}: Props) {
  const categories = [...new Set(ratings.map((rating) => rating.institutional_category).filter(Boolean))];
  const categorySignature = categories.join("||");
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] ?? "");
  const [searchQuery, setSearchQuery] = useState("");

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextYear = Number(event.target.value);

    if (Number.isNaN(nextYear) || nextYear === ratingYear) {
      return;
    }

    router.get(
      "/ranking",
      { year: nextYear },
      {
        preserveScroll: true,
        replace: true,
      },
    );
  };

  useEffect(() => {
    setSelectedCategory((currentCategory) =>
      categories.includes(currentCategory) ? currentCategory : (categories[0] ?? ""),
    );
  }, [categorySignature]);

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

  const filteredRatings = ratings.filter((rating) => {
    const matchesCategory = !selectedCategory || rating.institutional_category === selectedCategory;
    const universitySearchIndex = [
      rating.university?.current_name ?? "",
      rating.university?.city ?? "",
    ]
      .join(" ")
      .toLocaleLowerCase();
    const matchesSearch = !normalizedQuery || universitySearchIndex.includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  const filteredProfileIds = new Set(
    filteredRatings
      .map((rating) => rating.university?.id)
      .filter((universityId): universityId is number => Boolean(universityId)),
  );

  const filteredProfiles = universityProfiles
    .filter((profile) => profile.id !== null && filteredProfileIds.has(profile.id))
    .sort(
      (left, right) =>
        left.currentRank - right.currentRank ||
        (left.currentName ?? "").localeCompare(right.currentName ?? "", "ru"),
    );

  const featuredRatings = filteredRatings.slice(0, 3);
  const ratingCount = filteredRatings.length;
  const topScore = filteredRatings.length > 0 ? Math.max(...filteredRatings.map((item) => Number(item.total_score))) : 0;

  const methodologyItems = [
    {
      title: "РџСЂРѕР·СЂР°С‡РЅР°СЏ РјРѕРґРµР»СЊ РѕС†РµРЅРєРё",
      text: "Р РµР№С‚РёРЅРі РѕРїРёСЂР°РµС‚СЃСЏ РЅР° РІРµСЂРёС„РёС†РёСЂСѓРµРјС‹Рµ РґР°РЅРЅС‹Рµ, СѓРЅРёС„РёС†РёСЂРѕРІР°РЅРЅС‹Рµ РєСЂРёС‚РµСЂРёРё Рё РµРґРёРЅС‹Р№ РїРѕРґС…РѕРґ Рє СЂР°СЃС‡С‘С‚Сѓ РёС‚РѕРіРѕРІРѕРіРѕ Р±Р°Р»Р»Р°.",
    },
    {
      title: "РЎСЂР°РІРЅРµРЅРёРµ РІРЅСѓС‚СЂРё РєР°С‚РµРіРѕСЂРёРё",
      text: "Р’СѓР·С‹ СЃРѕРїРѕСЃС‚Р°РІР»СЏСЋС‚СЃСЏ СЃ РѕСЂРіР°РЅРёР·Р°С†РёСЏРјРё Р±Р»РёР·РєРѕРіРѕ РїСЂРѕС„РёР»СЏ, С‡С‚РѕР±С‹ СЂРµР·СѓР»СЊС‚Р°С‚ Р±С‹Р» РєРѕСЂСЂРµРєС‚РЅС‹Рј Рё РїРѕР»РµР·РЅС‹Рј РґР»СЏ Р°Р±РёС‚СѓСЂРёРµРЅС‚РѕРІ Рё СЌРєСЃРїРµСЂС‚РѕРІ.",
    },
    {
      title: "РћСЂРёРµРЅС‚Р°С†РёСЏ РЅР° РєР°С‡РµСЃС‚РІРѕ",
      text: "РС‚РѕРіРѕРІС‹Р№ РїРѕРєР°Р·Р°С‚РµР»СЊ РѕС‚СЂР°Р¶Р°РµС‚ Р°РєР°РґРµРјРёС‡РµСЃРєСѓСЋ СѓСЃС‚РѕР№С‡РёРІРѕСЃС‚СЊ, РёРЅСЃС‚РёС‚СѓС†РёРѕРЅР°Р»СЊРЅРѕРµ СЂР°Р·РІРёС‚РёРµ Рё РєРѕРЅРєСѓСЂРµРЅС‚РѕСЃРїРѕСЃРѕР±РЅРѕСЃС‚СЊ СѓРЅРёРІРµСЂСЃРёС‚РµС‚Р°.",
    },
  ];

  return (
    <>
      <Head title="Р РµР№С‚РёРЅРі РІСѓР·РѕРІ" />

      <div className="min-h-screen bg-[#f6f8fc] text-slate-950">
        <RankingHero
          currentPath="/ranking"
          badge={
            <>
              <Award className="h-4 w-4 text-blue-300" />
              Национальный рейтинг {ratingYear ?? "IQAA"}
            </>
          }
          title="Рейтинг университетов Казахстана"
          description="Актуальная таблица вузов с ранжированием по итоговому баллу, разбивкой по институциональным категориям и удобным обзором лидеров года."
          actions={
            <>
              <a
                href="#ranking-table"
                className="btn-orange inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
              >
                Смотреть таблицу
                <ChevronRight className="h-4 w-4" />
              </a>

              <Link
                href="/"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                На главную
              </Link>

              <a
                href="#university-profiles"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Карточки вузов
              </a>
            </>
          }
          aside={
            <div className="space-y-4 lg:ml-auto lg:max-w-md">
              <div className="grid grid-cols-2 gap-3">
                <RankingHeroStat label="Записей" value={ratings.length} valueClassName="text-3xl" />
                <RankingHeroStat label="Категорий" value={categories.length} valueClassName="text-3xl" />
              </div>

              <RankingHeroPanel className="rounded-[1.75rem] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300/70">
                  Лучший балл
                </div>
                <div className="mt-3 text-4xl font-semibold text-white">
                  {topScore ? formatScore(topScore) : "0.00"}
                </div>
                <p className="mt-3 text-sm leading-6 text-blue-100/65">
                  Текущий срез по выбранному году помогает быстро оценить масштаб публикации и верхнюю планку рейтинга.
                </p>
              </RankingHeroPanel>
            </div>
          }
        />

        <main className="mx-auto max-w-7xl px-6 py-12">
          <section className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Р¤РёР»СЊС‚СЂ РєР°С‚РµРіРѕСЂРёР№</h2>
                  <p className="text-sm text-slate-500">Р’С‹Р±РµСЂРёС‚Рµ РїСЂРѕС„РёР»СЊ РІСѓР·Р° РґР»СЏ С‚РѕС‡РЅРѕРіРѕ СЃСЂР°РІРЅРµРЅРёСЏ.</p>
                </div>
              </div>

              {availableYears.length > 0 ? (
                <>
                  <div className="mt-6">
                    <div className="text-sm font-medium text-slate-700">Р“РѕРґ СЂРµР№С‚РёРЅРіР°</div>
                    <p className="mt-1 text-sm text-slate-500">Р’С‹Р±РµСЂРёС‚Рµ РїСѓР±Р»РёРєР°С†РёСЋ Р·Р° РЅСѓР¶РЅС‹Р№ РіРѕРґ.</p>
                  </div>

                  <div className="mt-4">
                    <select
                      aria-label="Р’С‹Р±РµСЂРёС‚Рµ РіРѕРґ СЂРµР№С‚РёРЅРіР°"
                      value={ratingYear ?? ""}
                      onChange={handleYearChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
                    >
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
                {categories.map((category) => {
                  const isActive = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-[#0d2b6b] text-white shadow-lg shadow-blue-950/15"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <label htmlFor="university-search" className="mb-2 block text-sm font-medium text-slate-700">
                  РџРѕРёСЃРє РїРѕ РЅР°Р·РІР°РЅРёСЋ
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    id="university-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="РќР°РїСЂРёРјРµСЂ, Satbayev University"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="mt-8 space-y-4 border-t border-slate-200 pt-6">
                <div>
                  <div className="text-sm text-slate-500">РџРѕРєР°Р·Р°РЅРѕ РІСѓР·РѕРІ</div>
                  <div className="mt-1 text-3xl font-semibold text-slate-950">{ratingCount}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">Р“РѕРґ РїСѓР±Р»РёРєР°С†РёРё</div>
                  <div className="mt-1 text-xl font-semibold text-slate-950">{ratingYear ?? "РќРµ СѓРєР°Р·Р°РЅ"}</div>
                </div>
              </div>
            </aside>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Р›РёРґРµСЂС‹ СЂРµР№С‚РёРЅРіР°</div>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-950">РџРµСЂРІС‹Рµ РїРѕР·РёС†РёРё РІ РІС‹Р±СЂР°РЅРЅРѕР№ РєР°С‚РµРіРѕСЂРёРё</h2>
                </div>

                <div className="text-sm text-slate-500">
                  РЎРїРёСЃРѕРє СЃРѕСЂС‚РёСЂСѓРµС‚СЃСЏ РїРѕ РїРѕР»СЋ <span className="font-medium text-slate-700">rank</span>.
                </div>
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-3">
                {featuredRatings.length > 0 ? (
                  featuredRatings.map((rating, index) => (
                    <article key={rating.id} className="overflow-hidden rounded-[1.75rem] bg-slate-950 text-white">
                      <div
                        className="h-44 bg-cover bg-center"
                        style={{
                          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5), rgb(16 16 16 / 15%)),  url('${getUniversityImage(
                            rating.university?.id,
                          )}')`,
                        }}
                      />

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                              {index === 0 ? "Р›РёРґРµСЂ" : `РџРѕР·РёС†РёСЏ ${rating.rank}`}
                            </div>
                            <h3 className="mt-3 text-xl font-semibold leading-snug">
                              {rating.university?.current_name ?? "РЈРЅРёРІРµСЂСЃРёС‚РµС‚ РЅРµ СѓРєР°Р·Р°РЅ"}
                            </h3>
                            {getUniversityProfileHref(rating.university?.id, ratingYear) ? (
                              <Link
                                href={getUniversityProfileHref(rating.university?.id, ratingYear)!}
                                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-100 transition hover:text-white"
                              >
                                РЎС‚СЂР°РЅРёС†Р° РІСѓР·Р°
                                <ArrowUpRight className="h-4 w-4" />
                              </Link>
                            ) : null}
                          </div>

                          <div className="rounded-full bg-white/10 px-4 py-2 text-lg font-semibold">#{rating.rank}</div>
                        </div>

                        <div className="mt-6 inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset">
                          <span className={`rounded-full px-3 py-1 ${getCategoryStyle(rating.institutional_category)}`}>
                            {rating.institutional_category}
                          </span>
                        </div>

                        <div className="mt-6 flex items-end justify-between">
                          <div>
                            <div className="text-sm text-slate-400">РС‚РѕРіРѕРІС‹Р№ Р±Р°Р»Р»</div>
                            <div className="mt-1 text-4xl font-semibold">{formatScore(rating.total_score)}</div>
                          </div>

                          <div className="rounded-2xl bg-white/10 p-3 text-blue-200">
                            <Trophy className="h-5 w-5" />
                          </div>
                          {getUniversityProfileHref(rating.university?.id, ratingYear) ? (
                            <Link
                              href={getUniversityProfileHref(rating.university?.id, ratingYear)!}
                              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-700 transition hover:text-blue-900"
                            >
                              РџСЂРѕС„РёР»СЊ РІСѓР·Р°
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-500 xl:col-span-3">
                    Р”Р»СЏ РІС‹Р±СЂР°РЅРЅРѕР№ РєР°С‚РµРіРѕСЂРёРё РїРѕРєР° РЅРµС‚ РґР°РЅРЅС‹С….
                  </div>
                )}
              </div>
            </div>
          </section>

          <section id="ranking-table" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РўР°Р±Р»РёС†Р° СЂРµР№С‚РёРЅРіР°</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                  {selectedCategory || "РљР°С‚РµРіРѕСЂРёСЏ РЅРµ РІС‹Р±СЂР°РЅР°"}
                </h2>
              </div>

              <div className="text-sm text-slate-500">
                Р’СЃРµРіРѕ СЃС‚СЂРѕРє: <span className="font-semibold text-slate-900">{ratingCount}</span>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
              <div className="grid grid-cols-[90px_minmax(0,1.6fr)_minmax(180px,0.9fr)_140px] items-center gap-4 bg-slate-100 px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                <div>РњРµСЃС‚Рѕ</div>
                <div>РЈРЅРёРІРµСЂСЃРёС‚РµС‚</div>
                <div>РљР°С‚РµРіРѕСЂРёСЏ</div>
                <div className="text-right">Р‘Р°Р»Р»</div>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredRatings.map((rating) => (
                  <div
                    key={rating.id}
                    className="grid grid-cols-[90px_minmax(0,1.6fr)_minmax(180px,0.9fr)_140px] items-center gap-4 px-6 py-5 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-blue-700">
                        {rating.rank}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-base font-semibold text-slate-950">
                            {rating.university?.current_name ?? "РЈРЅРёРІРµСЂСЃРёС‚РµС‚ РЅРµ СѓРєР°Р·Р°РЅ"}
                          </div>
                          {getUniversityProfileHref(rating.university?.id, ratingYear) ? (
                            <Link
                              href={getUniversityProfileHref(rating.university?.id, ratingYear)!}
                              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-700 transition hover:text-blue-900"
                            >
                              РџСЂРѕС„РёР»СЊ РІСѓР·Р°
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          ) : null}
                          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                            <GraduationCap className="h-4 w-4" />
                            {ratingYear ? `Р РµР№С‚РёРЅРі ${ratingYear} РіРѕРґР°` : "Р РµР№С‚РёРЅРі IQAA"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className={`inline-flex rounded-full px-3 py-2 text-xs font-medium ring-1 ring-inset ${getCategoryStyle(rating.institutional_category)}`}>
                        {rating.institutional_category}
                      </span>
                    </div>

                    <div className="text-right text-2xl font-semibold text-slate-950">{formatScore(rating.total_score)}</div>
                  </div>
                ))}

                {filteredRatings.length === 0 ? (
                  <div className="px-6 py-10 text-center text-slate-500">РќРµС‚ Р·Р°РїРёСЃРµР№ РґР»СЏ РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ.</div>
                ) : null}
              </div>
            </div>
          </section>

          <section id="university-profiles" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РџСЂРѕС„РёР»Рё РІСѓР·РѕРІ</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">РљР°СЂС‚РѕС‡РєРё СЃ РёСЃС‚РѕСЂРёРµР№ Рё РёРЅС„РѕРіСЂР°С„РёРєРѕР№</h2>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                РљР°СЂС‚РѕС‡РєРё РїРѕРІС‚РѕСЂСЏСЋС‚ С‚РµРєСѓС‰РёРµ С„РёР»СЊС‚СЂС‹ СЃС‚СЂР°РЅРёС†С‹ Рё РїРѕРєР°Р·С‹РІР°СЋС‚ РЅРµ С‚РѕР»СЊРєРѕ РїРѕР·РёС†РёСЋ РІ РІС‹Р±СЂР°РЅРЅРѕРј РіРѕРґСѓ, РЅРѕ Рё
                РґРёРЅР°РјРёРєСѓ РІ РёРЅСЃС‚РёС‚СѓС†РёРѕРЅР°Р»СЊРЅРѕРј СЂРµР№С‚РёРЅРіРµ РїРѕ РіРѕРґР°Рј. РџРѕР»СЏ СЃР°Р№С‚Р°, СЂРµРєС‚РѕСЂР°, Р°РґСЂРµСЃР°, РіРѕРґР° РѕСЃРЅРѕРІР°РЅРёСЏ Рё
                РєРѕРЅС‚РёРЅРіРµРЅС‚Р° РїРѕРґРіРѕС‚РѕРІР»РµРЅС‹ РєР°Рє СЃР»РѕС‚С‹ РґР»СЏ Р±СѓРґСѓС‰РµРіРѕ РЅР°РїРѕР»РЅРµРЅРёСЏ.
              </p>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <UniversityProfileCard
                    key={profile.id ?? profile.currentName}
                    profile={profile}
                    detailsHref={getUniversityProfileHref(profile.id, ratingYear)}
                  />
                ))
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500 xl:col-span-2">
                  Р”Р»СЏ РІС‹Р±СЂР°РЅРЅРѕР№ РєР°С‚РµРіРѕСЂРёРё Рё РїРѕРёСЃРєРѕРІРѕРіРѕ Р·Р°РїСЂРѕСЃР° РїСЂРѕС„РёР»Рё РІСѓР·РѕРІ РЅРµ РЅР°Р№РґРµРЅС‹.
                </div>
              )}
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РњРµС‚РѕРґРѕР»РѕРіРёСЏ</div>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">РљР°Рє С‡РёС‚Р°С‚СЊ СЂРµР·СѓР»СЊС‚Р°С‚С‹ СЂРµР№С‚РёРЅРіР°</h2>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {methodologyItems.map((item) => (
                  <div key={item.title} className="border-l-2 border-blue-100 pl-5">
                    <div className="text-lg font-semibold text-slate-950">{item.title}</div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#102e5e] p-6 text-white shadow-sm">
              <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-200">РќР°Р·РЅР°С‡РµРЅРёРµ СЃС‚СЂР°РЅРёС†С‹</div>
              <h2 className="mt-2 text-3xl font-semibold">Р‘С‹СЃС‚СЂРѕРµ СЃСЂР°РІРЅРµРЅРёРµ РІСѓР·РѕРІ</h2>
              <p className="mt-4 text-sm leading-6 text-blue-100">
                РЎС‚СЂР°РЅРёС†Р° РїРѕРјРѕРіР°РµС‚ Р°Р±РёС‚СѓСЂРёРµРЅС‚Р°Рј, СЂРѕРґРёС‚РµР»СЏРј Рё СЌРєСЃРїРµСЂС‚Р°Рј Р±С‹СЃС‚СЂРѕ СѓРІРёРґРµС‚СЊ РїРѕР·РёС†РёСЋ СѓРЅРёРІРµСЂСЃРёС‚РµС‚Р° РІ СЃРІРѕРµР№ РєР°С‚РµРіРѕСЂРёРё Рё
                СЃСЂР°РІРЅРёС‚СЊ РёС‚РѕРіРѕРІС‹Рµ Р±Р°Р»Р»С‹.
              </p>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">РСЃС‚РѕС‡РЅРёРє</span>
                  <span className="font-medium">IQAA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Р¤РѕСЂРјР°С‚</span>
                  <span className="font-medium">РРЅСЃС‚РёС‚СѓС†РёРѕРЅР°Р»СЊРЅС‹Р№ СЂРµР№С‚РёРЅРі</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">РћР±РЅРѕРІР»РµРЅРёРµ</span>
                  <span className="font-medium">{ratingYear ?? "РїРѕ РјРµСЂРµ РїСѓР±Р»РёРєР°С†РёРё"}</span>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-10">
            <MediaCoverage />
          </div>
        </main>
      </div>
    </>
  );
}
