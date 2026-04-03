import { Head, Link } from "@inertiajs/react";
import { Award, Building2, ChevronRight, Filter, GraduationCap, Search, Trophy } from "lucide-react";
import { useState } from "react";
import RankingHeader from "@/components/header/navigation/ranking-header";
import MediaCoverage from "@/components/media/versions/media-coverage1";
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
  "Многопрофильные вузы": "bg-orange-500/15 text-orange-700 ring-orange-200",
  "Технические вузы": "bg-blue-500/15 text-blue-700 ring-blue-200",
  "Гуманитарно-экономические вузы": "bg-amber-500/15 text-amber-700 ring-amber-200",
  "Педагогические вузы": "bg-cyan-500/15 text-cyan-700 ring-cyan-200",
  "Медицинские вузы": "bg-emerald-500/15 text-emerald-700 ring-emerald-200",
  "Вузы искусства и спорта": "bg-fuchsia-500/15 text-fuchsia-700 ring-fuchsia-200",
};

const getCategoryStyle = (category: string) =>
  categoryStyles[category] ?? "bg-slate-500/10 text-slate-700 ring-slate-200";

const getUniversityImage = (universityId?: number) =>
  universityId ? `/storage/images/universities/${universityId}.jpg` : "";

const formatScore = (value: number | string) => Number(value).toFixed(2);

export default function IQAARanking({
  ratingYear,
  availableYears = [],
  ratings = [],
  universityProfiles = [],
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["all", ...new Set(ratings.map((rating) => rating.institutional_category).filter(Boolean))];

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

  const filteredRatings = ratings.filter((rating) => {
    const matchesCategory =
      selectedCategory === "all" || rating.institutional_category === selectedCategory;
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
      title: "Прозрачная модель оценки",
      text: "Рейтинг опирается на верифицируемые данные, унифицированные критерии и единый подход к расчёту итогового балла.",
    },
    {
      title: "Сравнение внутри категории",
      text: "Вузы сопоставляются с организациями близкого профиля, чтобы результат был корректным и полезным для абитуриентов и экспертов.",
    },
    {
      title: "Ориентация на качество",
      text: "Итоговый показатель отражает академическую устойчивость, институциональное развитие и конкурентоспособность университета.",
    },
  ];

  return (
    <>
      <Head title="Рейтинг вузов" />

      <div className="min-h-screen bg-[#f6f8fc] text-slate-950">
        <section className="relative overflow-hidden bg-[#0d2b6b] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.22),transparent_30%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:72px_72px]" />

          <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-6">
            <RankingHeader currentPath="/ranking" />

            <div className="grid gap-10 pt-12 lg:grid-cols-[minmax(0,1.05fr)_360px] lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-blue-100">
                  <Award className="h-4 w-4" />
                  Национальный рейтинг {ratingYear ?? "IQAA"}
                </div>

                <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
                  Рейтинг университетов Казахстана
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 md:text-lg">
                  Актуальная таблица вузов с ранжированием по итоговому баллу, разбивкой по институциональным категориям
                  и удобным обзором лидеров года.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#ranking-table"
                    className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Смотреть таблицу
                    <ChevronRight className="h-4 w-4" />
                  </a>

                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    На главную
                  </Link>

                  <a
                    href="#university-profiles"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Карточки вузов
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Записей</div>
                    <div className="mt-3 text-4xl font-semibold">{ratings.length}</div>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Категорий</div>
                    <div className="mt-3 text-4xl font-semibold">{Math.max(categories.length - 1, 0)}</div>
                  </div>
                  <div className="col-span-2 rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Лучший балл</div>
                    <div className="mt-3 text-4xl font-semibold">{topScore ? formatScore(topScore) : "0.00"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-6 py-12">
          <section className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Фильтр категорий</h2>
                  <p className="text-sm text-slate-500">Выберите профиль вуза для точного сравнения.</p>
                </div>
              </div>

              {availableYears.length > 0 ? (
                <>
                  <div className="mt-6">
                    <div className="text-sm font-medium text-slate-700">Год рейтинга</div>
                    <p className="mt-1 text-sm text-slate-500">Выберите публикацию за нужный год.</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {availableYears.map((year) => {
                      const isActive = ratingYear === year;

                      return (
                        <Link
                          key={year}
                          href={`/ranking?year=${year}`}
                          preserveScroll
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            isActive
                              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                              : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                          }`}
                        >
                          {year}
                        </Link>
                      );
                    })}
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
                      {category === "all" ? "Все категории" : category}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <label htmlFor="university-search" className="mb-2 block text-sm font-medium text-slate-700">
                  Поиск по названию
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    id="university-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Например, Satbayev University"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="mt-8 space-y-4 border-t border-slate-200 pt-6">
                <div>
                  <div className="text-sm text-slate-500">Показано вузов</div>
                  <div className="mt-1 text-3xl font-semibold text-slate-950">{ratingCount}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500">Год публикации</div>
                  <div className="mt-1 text-xl font-semibold text-slate-950">{ratingYear ?? "Не указан"}</div>
                </div>
              </div>
            </aside>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Лидеры рейтинга</div>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-950">Первые позиции в выбранной категории</h2>
                </div>

                <div className="text-sm text-slate-500">
                  Список сортируется по полю <span className="font-medium text-slate-700">rank</span>.
                </div>
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-3">
                {featuredRatings.length > 0 ? (
                  featuredRatings.map((rating, index) => (
                    <article key={rating.id} className="overflow-hidden rounded-[1.75rem] bg-slate-950 text-white">
                      <div
                        className="h-44 bg-cover bg-center"
                        style={{
                          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.12), rgba(15,23,42,0.78)), url('${getUniversityImage(
                            rating.university?.id,
                          )}')`,
                        }}
                      />

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                              {index === 0 ? "Лидер" : `Позиция ${rating.rank}`}
                            </div>
                            <h3 className="mt-3 text-xl font-semibold leading-snug">
                              {rating.university?.current_name ?? "Университет не указан"}
                            </h3>
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
                            <div className="text-sm text-slate-400">Итоговый балл</div>
                            <div className="mt-1 text-4xl font-semibold">{formatScore(rating.total_score)}</div>
                          </div>

                          <div className="rounded-2xl bg-white/10 p-3 text-blue-200">
                            <Trophy className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-500 xl:col-span-3">
                    Для выбранной категории пока нет данных.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section id="ranking-table" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Таблица рейтинга</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                  {selectedCategory === "all" ? "Все категории" : selectedCategory}
                </h2>
              </div>

              <div className="text-sm text-slate-500">
                Всего строк: <span className="font-semibold text-slate-900">{ratingCount}</span>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
              <div className="grid grid-cols-[90px_minmax(0,1.6fr)_minmax(180px,0.9fr)_140px] items-center gap-4 bg-slate-100 px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                <div>Место</div>
                <div>Университет</div>
                <div>Категория</div>
                <div className="text-right">Балл</div>
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
                            {rating.university?.current_name ?? "Университет не указан"}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                            <GraduationCap className="h-4 w-4" />
                            {ratingYear ? `Рейтинг ${ratingYear} года` : "Рейтинг IQAA"}
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
                  <div className="px-6 py-10 text-center text-slate-500">Нет записей для отображения.</div>
                ) : null}
              </div>
            </div>
          </section>

          <section id="university-profiles" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Профили вузов</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Карточки с историей и инфографикой</h2>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Карточки повторяют текущие фильтры страницы и показывают не только позицию в выбранном году, но и
                динамику в институциональном рейтинге по годам. Поля сайта, ректора, адреса, года основания и
                контингента подготовлены как слоты для будущего наполнения.
              </p>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <UniversityProfileCard key={profile.id ?? profile.currentName} profile={profile} />
                ))
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500 xl:col-span-2">
                  Для выбранной категории и поискового запроса профили вузов не найдены.
                </div>
              )}
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Методология</div>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Как читать результаты рейтинга</h2>

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
              <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-200">Назначение страницы</div>
              <h2 className="mt-2 text-3xl font-semibold">Быстрое сравнение вузов</h2>
              <p className="mt-4 text-sm leading-6 text-blue-100">
                Страница помогает абитуриентам, родителям и экспертам быстро увидеть позицию университета в своей категории и
                сравнить итоговые баллы.
              </p>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Источник</span>
                  <span className="font-medium">IQAA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Формат</span>
                  <span className="font-medium">Институциональный рейтинг</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Обновление</span>
                  <span className="font-medium">{ratingYear ?? "по мере публикации"}</span>
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
