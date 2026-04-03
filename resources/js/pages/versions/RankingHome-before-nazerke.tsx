import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowRight, Award, BookOpenText, ChevronRight, Globe2, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import RankingHero, { RankingHeroPanel, RankingHeroStat } from "@/components/hero/ranking-hero";
import MediaCoverage from "@/components/media/media-coverage";

type Rating = {
  id: number;
  rank: number;
  total_score: number | string;
  institutional_category: string;
  university: {
    id: number;
    current_name: string;
    image?: string | null;
    logo?: string | null;
  } | null;
};

type Props = {
  ratingYear?: number | null;
  ratings?: Rating[];
};

const categoryColors: Record<string, string> = {
  "Многопрофильные вузы": "bg-orange-500",
  "Технические вузы": "bg-blue-500",
  "Гуманитарно-экономические вузы": "bg-yellow-500",
  "Педагогические вузы": "bg-amber-500",
  "Медицинские вузы": "bg-emerald-500",
  "Вузы искусства и спорта": "bg-pink-500",
};

const getCategoryColor = (category: string) => categoryColors[category] ?? "bg-slate-500";

const formatScore = (value: number | string | null | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : "0.00";
};

export default function RankingHome() {
  const { props } = usePage<Props>();
  const { ratings = [], ratingYear } = props;

  const categories = useMemo(
    () => Array.from(new Set(ratings.map((rating) => rating.institutional_category).filter(Boolean))),
    [ratings],
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] ?? "");

  useEffect(() => {
    if (!categories.length) {
      setSelectedCategory("");
      return;
    }

    if (!selectedCategory || !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const filteredRatings = selectedCategory
    ? ratings.filter((rating) => rating.institutional_category === selectedCategory)
    : ratings;

  const topScore = ratings.reduce((max, rating) => {
    const value = Number(rating.total_score);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return (
    <>
      <Head title="IQAA Ranking" />

      <div className="min-h-screen bg-[#f6f8fc] text-slate-950">
        <RankingHero
          currentPath="/"
          badge={
            <>
              <Award className="h-4 w-4 text-blue-300" />
              Национальный рейтинг {ratingYear ?? "IQAA"}
            </>
          }
          title={
            <>
              Национальный рейтинг
              <br />
              вузов Казахстана
            </>
          }
          description="Единая точка входа в рейтинги IQAA: институциональный рейтинг, методология, международные принципы IREG и материалы о системе оценки качества."
          actions={
            <>
              <Link
                href="/ranking"
                className="btn-orange inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
              >
                Смотреть рейтинг
                <ChevronRight className="h-4 w-4" />
              </Link>

              <Link
                href="/methodology"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                <BookOpenText className="h-4 w-4" />
                Методология
              </Link>

              <Link
                href="/ireg"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                <Globe2 className="h-4 w-4" />
                IREG
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          }
          aside={
            <div className="space-y-4 lg:ml-auto lg:max-w-md">
              <div className="grid grid-cols-2 gap-3">
                <RankingHeroStat label="Год" value={ratingYear ?? "—"} valueClassName="text-3xl" />
                <RankingHeroStat label="Записей" value={ratings.length} valueClassName="text-3xl" />
                <RankingHeroStat label="Категорий" value={categories.length} valueClassName="text-3xl" />
                <RankingHeroStat label="Лучший балл" value={formatScore(topScore)} valueClassName="text-2xl" />
              </div>

              <RankingHeroPanel className="rounded-[1.75rem] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300/70">
                  Международный контекст
                </div>
                <div className="mt-3 text-xl font-semibold text-white">Методология и принципы IREG</div>
                <p className="mt-3 text-sm leading-6 text-blue-100/65">
                  На главной странице собраны ключевые входы в рейтинг: таблица вузов, методология оценки и международные ориентиры доверия к результатам.
                </p>
              </RankingHeroPanel>
            </div>
          }
          footerLabel="Независимость · Профессионализм · Прозрачность"
        />

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/70 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">Лидеры года</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Лидеры рейтинга {ratingYear ?? ""}</h2>
              </div>

              <Link href="/ranking" className="text-sm font-medium text-[#1E40AF] hover:underline">
                Полная таблица →
              </Link>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === category
                      ? `${getCategoryColor(category)} text-white`
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {filteredRatings.slice(0, 3).map((rating) => (
                <div
                  key={rating.id}
                  className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={rating.university ? `/storage/images/universities/${rating.university.id}.jpg` : "/images/kratkaya.png"}
                      alt={rating.university?.current_name ?? "Университет"}
                      className="h-44 w-full object-cover"
                    />

                    <div
                      className={`absolute left-3 top-3 rounded-lg px-3 py-1 text-sm font-bold text-white ${getCategoryColor(
                        rating.institutional_category,
                      )}`}
                    >
                      #{rating.rank}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="mb-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {rating.institutional_category}
                    </p>

                    <h3 className="min-h-[48px] text-base font-semibold leading-snug text-slate-950">
                      {rating.university?.current_name ?? "Вуз без названия"}
                    </h3>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                      <div className="rounded-2xl bg-slate-50 px-4 py-4">
                        <p className="text-2xl font-bold text-blue-700">{formatScore(rating.total_score)}</p>
                        <p className="mt-1 text-xs text-slate-500">Итоговый балл</p>
                      </div>

                      <div className="rounded-2xl bg-orange-50 px-4 py-4">
                        <p className="text-2xl font-bold text-orange-600">#{rating.rank}</p>
                        <p className="mt-1 text-xs text-slate-500">Позиция</p>
                      </div>
                    </div>

                    {rating.university ? (
                      <Link
                        href={`/ranking/university/${rating.university.id}`}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#1E40AF] hover:underline"
                      >
                        Карточка вуза
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] bg-white px-4 py-8 shadow-sm shadow-slate-200/70 sm:px-6">
            <MediaCoverage />
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-[1.75rem] bg-white p-6 shadow-sm shadow-slate-200/70">
              <h3 className="text-lg font-semibold text-orange-500">Методология рейтинга</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• О методике и структуре оценки</li>
                <li>• Критерии и показатели</li>
                <li>• Анкетные опросы</li>
                <li>• Типы и категории вузов</li>
              </ul>

              <Link
                href="/methodology"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                Подробнее
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm shadow-slate-200/70">
              <img src="/images/kratkaya.png" alt="Краткая информация" className="h-full w-full object-cover" />
            </div>

            <div className="rounded-[1.75rem] bg-white p-6 shadow-sm shadow-slate-200/70">
              <h3 className="text-lg font-semibold text-blue-700">Международный контекст</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Отдельные страницы про IREG и методологию помогают показать не только результаты, но и основания доверия к рейтингу.
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/ireg"
                  className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Страница IREG
                </Link>
                <Link
                  href="/program-ranking"
                  className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Программный рейтинг
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#0B2E6B] text-blue-200">
          <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm opacity-90">
            © {new Date().getFullYear()} IQAA Ranking. Все права защищены.
          </div>
        </footer>
      </div>
    </>
  );
}
