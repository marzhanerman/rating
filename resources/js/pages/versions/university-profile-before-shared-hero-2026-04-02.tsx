import { Head, Link, router } from "@inertiajs/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarRange,
  ChevronRight,
  Globe,
  LayoutPanelLeft,
  MapPin,
  Trophy,
} from "lucide-react";
import { type ChangeEvent } from "react";
import RankingHeader from "@/components/header/navigation/ranking-header";
import UniversityProfileCard, { type UniversityProfile } from "@/components/universities/university-profile-card";

type PeerRating = {
  id: number;
  rank: number;
  totalScore: number;
  universityId: number | null;
  universityName: string | null;
  isCurrent: boolean;
};

type Props = {
  profile: UniversityProfile;
  selectedYear: number | null;
  availableYears: number[];
  peerRatings: PeerRating[];
  backHref: string;
};

const formatScore = (value: number) => value.toFixed(2);

const normalizeWebsiteUrl = (value?: string | null) => {
  if (!value) {
    return null;
  }

  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

export default function UniversityProfilePage({
  profile,
  selectedYear,
  availableYears = [],
  peerRatings = [],
  backHref,
}: Props) {
  const historyRows = [...profile.history].sort((left, right) => right.year - left.year);
  const recentHistory = historyRows.slice(0, 5);
  const bestRank = historyRows.length > 0 ? Math.min(...historyRows.map((item) => item.rank)) : profile.currentRank;
  const websiteUrl = normalizeWebsiteUrl(profile.website);

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextYear = Number(event.target.value);

    if (Number.isNaN(nextYear) || nextYear === selectedYear || !profile.id) {
      return;
    }

    router.get(
      `/ranking/university/${profile.id}`,
      { year: nextYear },
      {
        preserveScroll: true,
        replace: true,
      },
    );
  };

  return (
    <>
      <Head title={`${profile.currentName ?? "Профиль вуза"} | IQAA Ranking`} />

      <div className="min-h-screen bg-[#f5f8fc] text-slate-950">
        <section className="relative overflow-hidden bg-[#0d2b6b] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.2),transparent_28%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:72px_72px]" />

          <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-6">
            <RankingHeader currentPath="/ranking" />

            <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div className="max-w-4xl">
                <Link
                  href={backHref}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/15"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Вернуться к рейтингу
                </Link>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-blue-100">
                  <Building2 className="h-4 w-4" />
                  Профиль университета
                </div>

                <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
                  {profile.currentName ?? "Профиль вуза"}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-blue-100">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {profile.city ?? "Город будет добавлен"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarRange className="h-4 w-4" />
                    {selectedYear ? `Рейтинг ${selectedYear} года` : "Архив рейтинга"}
                  </span>
                </div>

                <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 md:text-lg">
                  Здесь собраны текущая позиция, итоговый балл, паспорт вуза и его динамика в институциональном
                  рейтинге IQAA по годам.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#university-profile-card"
                    className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Открыть карточку
                    <ChevronRight className="h-4 w-4" />
                  </a>

                  <a
                    href="#history-table"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    История по годам
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                <div className="space-y-4">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Текущая позиция</div>
                    <div className="mt-3 text-4xl font-semibold">#{profile.currentRank}</div>
                  </div>

                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Итоговый балл</div>
                    <div className="mt-3 text-4xl font-semibold">{formatScore(profile.currentScore)}</div>
                  </div>

                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Год рейтинга</div>
                    <select
                      aria-label="Выберите год профиля вуза"
                      value={selectedYear ?? ""}
                      onChange={handleYearChange}
                      className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200/30"
                    >
                      {availableYears.map((year) => (
                        <option key={year} value={year} className="text-slate-950">
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-6 py-12">
          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_340px] xl:items-start">
            <div id="university-profile-card">
              <UniversityProfileCard profile={profile} variant="detail" />
            </div>

            <aside className="space-y-6 xl:sticky xl:top-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-blue-700">
                  <LayoutPanelLeft className="h-4 w-4" />
                  Обзор профиля
                </div>

                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Ключевой срез по вузу</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Правая колонка теперь работает как компактное досье: здесь удобно быстро посмотреть год, категорию и
                  недавнюю историю без длинного скролла.
                </p>

                <div className="mt-6 space-y-3">
                  <QuickFact label="Выбранный год" value={selectedYear ? String(selectedYear) : "Архив"} />
                  <QuickFact label="Категория" value={profile.institutionalCategory} />
                  <QuickFact label="Лучшая позиция" value={`#${bestRank}`} />
                  <QuickFact label="Лет в рейтинге" value={String(historyRows.length)} />
                </div>

                {websiteUrl ? (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Globe className="h-4 w-4" />
                    Открыть сайт
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="#history-table"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Динамика
                    <ChevronRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#peer-positions"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Соседи по рейтингу
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-blue-700">
                  <Trophy className="h-4 w-4" />
                  Архив рейтинга
                </div>

                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Последние годы</h2>

                <div className="mt-5 space-y-3">
                  {recentHistory.map((item) => (
                    <div
                      key={item.year}
                      className={`rounded-[1.35rem] border px-4 py-4 ${
                        item.year === selectedYear ? "border-orange-200 bg-orange-50" : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.year}</div>
                          <div className="mt-2 text-xl font-semibold text-slate-950">#{item.rank}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Баллы</div>
                          <div className="mt-2 text-lg font-semibold text-slate-950">{formatScore(item.totalScore)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="#history-table"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                >
                  Полная таблица истории
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </aside>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div id="history-table" className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">История рейтинга</div>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-950">Динамика по годам</h2>
                </div>

                <div className="text-sm text-slate-500">
                  Доступно лет: <span className="font-semibold text-slate-900">{historyRows.length}</span>
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
                <div className="grid grid-cols-[120px_120px_minmax(0,1fr)] gap-4 bg-slate-100 px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 md:grid-cols-[140px_140px_minmax(0,1fr)] md:px-6">
                  <div>Год</div>
                  <div>Место</div>
                  <div>Итоговый балл</div>
                </div>

                <div className="divide-y divide-slate-200">
                  {historyRows.map((item) => (
                    <div
                      key={item.year}
                      className={`grid grid-cols-[120px_120px_minmax(0,1fr)] gap-4 px-5 py-5 md:grid-cols-[140px_140px_minmax(0,1fr)] md:px-6 ${
                        item.year === selectedYear ? "bg-orange-50" : "bg-white"
                      }`}
                    >
                      <div className="text-base font-semibold text-slate-950">{item.year}</div>
                      <div className="text-base font-semibold text-slate-950">#{item.rank}</div>
                      <div className="text-base font-semibold text-slate-950">{formatScore(item.totalScore)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="peer-positions" className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Контекст категории</div>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Соседние позиции</h2>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Срез по выбранному году показывает место вуза внутри своей институциональной категории.
              </p>

              <div className="mt-6 space-y-3">
                {peerRatings.map((peer) => {
                  const peerHref = peer.universityId
                    ? selectedYear
                      ? `/ranking/university/${peer.universityId}?year=${selectedYear}`
                      : `/ranking/university/${peer.universityId}`
                    : null;

                  return (
                    <div
                      key={peer.id}
                      className={`rounded-[1.35rem] border px-4 py-4 ${
                        peer.isCurrent ? "border-orange-200 bg-orange-50" : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Позиция #{peer.rank}</div>
                          {peerHref ? (
                            <Link
                              href={peerHref}
                              className="mt-2 inline-flex max-w-full items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-blue-700"
                            >
                              <span className="truncate">{peer.universityName ?? "Университет не указан"}</span>
                              <ArrowUpRight className="h-4 w-4 shrink-0" />
                            </Link>
                          ) : (
                            <div className="mt-2 text-sm font-semibold text-slate-950">
                              {peer.universityName ?? "Университет не указан"}
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-950 ring-1 ring-slate-200">
                            <Trophy className="h-4 w-4 text-blue-700" />
                            {formatScore(peer.totalScore)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {peerRatings.length === 0 ? (
                  <div className="rounded-[1.35rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                    Для выбранного года не найдено дополнительных строк по категории.
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

function QuickFact({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.2rem] bg-slate-50 px-4 py-3">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-right text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}
