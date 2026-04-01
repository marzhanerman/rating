import { Head, Link } from "@inertiajs/react";
import { CheckCircle2, ChevronRight, FileSpreadsheet, Globe2, Scale, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";

type Principle = {
  id: string;
  name: string;
  icon: typeof Globe2;
  summary: string;
  principle: string;
  iqaa: string;
  bullets: string[];
};

type ConferenceHighlight = {
  id: string;
  year: string;
  city: string;
  country: string;
  dates: string;
  title: string;
  theme: string;
  officialUrl: string;
  summary: string;
  photos: Array<{
    src: string;
    alt: string;
  }>;
};

const timeline = [
  {
    year: "2004",
    title: "Формирование IREG",
    text: "Международная экспертная группа появилась как площадка для обсуждения качества академических рейтингов и надежности их методологии.",
  },
  {
    year: "2006",
    title: "Берлинские принципы",
    text: "В Берлине были зафиксированы принципы добросовестного ранжирования: цель, прозрачность, корректный сбор данных и понятная публикация результатов.",
  },
  {
    year: "Сегодня",
    title: "Практика для IQAA",
    text: "На этой странице акцент сделан не на старых биографиях и составах комитетов, а на тех идеях IREG, которые реально объясняют логику рейтинга IQAA.",
  },
];

const conferenceHighlights: ConferenceHighlight[] = [
  {
    id: "2019",
    year: "2019",
    city: "Bologna",
    country: "Italy",
    dates: "8-10 May 2019",
    title: "IREG 2019 Conference",
    theme: "Rankings: A Challenge to Higher Education?",
    officialUrl: "https://www.ireg-observatory.org/en/ireg-2019",
    summary:
      "На официальном сайте IREG эта конференция указана как очное событие в Болонье. Для страницы использованы найденные фотографии с участием руководства IQAA именно за этот год.",
    photos: [
      {
        src: "/storage/images/ireg-conferences/ireg-2019-bologna-46.jpg",
        alt: "Участие руководства IQAA в IREG 2019 Conference in Bologna, Italy",
      },
      {
        src: "/storage/images/ireg-conferences/ireg-2019-bologna-3.jpg",
        alt: "Фотография руководства IQAA на IREG 2019 в Болонье",
      },
      {
        src: "/storage/images/ireg-conferences/ireg-2019-bologna-16.jpg",
        alt: "Групповая фотография участников IREG 2019 в Болонье",
      },
    ],
  },
  {
    id: "2023",
    year: "2023",
    city: "Tashkent / Samarkand",
    country: "Uzbekistan",
    dates: "26-28 April 2023",
    title: "IREG 2023 Conference",
    theme: "Rankings and University International Exposure",
    officialUrl: "https://www.ireg-observatory.org/en/ireg-2023",
    summary:
      "На официальном сайте IREG эта конференция обозначена как событие в Ташкенте и Самарканде. Для страницы использовано найденное подтвержденное фото участия руководства IQAA.",
    photos: [
      {
        src: "/storage/images/ireg-conferences/ireg-2023-tashkent.jpg",
        alt: "Участие руководства IQAA в IREG 2023 Conference in Tashkent and Samarkand",
      },
    ],
  },
];

const historical2010 = [
  {
    id: "warsaw-2010",
    year: "2010",
    location: "Warsaw, Poland",
    dates: "March 2010",
    title: "Inaugural IREG Observatory General Assembly",
    sourceLabel: "Архивный материал IREG",
    sourceUrl: "https://ireg-observatory.org/wp-content/uploads/2019/12/IREG_Berlin.pdf",
    description:
      "Исторический кадр из раннего этапа становления IREG Observatory. Датировка и контекст опираются на архивный программный материал IREG, где упоминается Inaugural IREG Observatory General Assembly, Warsaw, March 2010.",
    photo: {
      src: "/storage/images/ireg-conferences/ireg-2010-warsaw.jpg",
      alt: "Архивное фото General Assembly Round Table IREG, Warsaw, 2010",
    },
  },
  {
    id: "berlin-2010",
    year: "2010",
    location: "Berlin, Germany",
    dates: "6-8 October 2010",
    title: "IREG-5 Conference",
    sourceLabel: "Официальная страница IREG 2010",
    sourceUrl: "https://www.ireg-observatory.org/en/ireg-2010",
    description:
      "Официальный сайт IREG фиксирует конференцию IREG-5 в Берлине как событие 6-8 октября 2010 года под темой 'The Academic Rankings from Popularity to Reliability'.",
    photo: {
      src: "/storage/images/ireg-conferences/ireg-2010-berlin.jpg",
      alt: "Архивное фото IREG-5 Conference, Berlin, 2010",
    },
  },
];

const principles: Principle[] = [
  {
    id: "purpose",
    name: "Цель и аудитория",
    icon: FileSpreadsheet,
    summary: "Ранжирование должно быть инструментом анализа и сравнения, а не единственным способом оценки качества.",
    principle: "Пользователь должен понимать, для кого создается рейтинг, какие задачи он решает и как корректно читать результаты.",
    iqaa: "В IQAA рейтинг работает как аналитический инструмент, который дополняет аккредитацию и экспертную оценку, но не подменяет их.",
    bullets: [
      "рейтинг читается как аналитический инструмент, а не как единственный вердикт",
      "метрики подбираются под институциональную оценку, а не под случайный набор показателей",
      "пользователь лучше понимает границы и смысл результатов",
    ],
  },
  {
    id: "diversity",
    name: "Разнообразие вузов",
    icon: Users,
    summary: "Принципы IREG требуют учитывать различие миссий, профилей и контекста университетов.",
    principle: "Исследовательский, региональный, отраслевой и многопрофильный вуз нельзя оценивать как полностью одинаковые модели.",
    iqaa: "Это видно через баланс индикаторов: кроме науки учитываются обучение, цифровизация, международное сотрудничество и трудоустройство.",
    bullets: [
      "качество не сводится только к науке или репутации",
      "оценка ближе к реальному профилю университета",
      "сравнение становится аккуратнее и справедливее",
    ],
  },
  {
    id: "transparency",
    name: "Прозрачность методики",
    icon: Scale,
    summary: "Открытость источников, индикаторов и весов — один из ключевых принципов добросовестного ранжирования.",
    principle: "Пользователь должен видеть, из чего складывается итоговый балл и почему именно эти показатели включены в модель.",
    iqaa: "В методологии IQAA это выражено через 5 анкет, веса 80/5/5/5/5 и подробную раскладку Анкеты №1 по 7 индикаторам.",
    bullets: [
      "каждый блок оценки имеет понятный максимальный балл",
      "структура рейтинга прослеживается от общего результата до конкретного критерия",
      "методология становится объяснимой, а не скрытой",
    ],
  },
  {
    id: "verification",
    name: "Проверяемость данных",
    icon: ShieldCheck,
    summary: "Берлинские принципы рекомендуют опираться на верифицируемые данные и комбинировать несколько источников.",
    principle: "Доверие к рейтингу возникает тогда, когда данные можно перепроверить, а ошибки — обнаружить и скорректировать.",
    iqaa: "В IQAA вуз предоставляет основную анкету, затем данные перепроверяются экспертами и сопоставляются с независимыми источниками и результатами опросов.",
    bullets: [
      "соединяются количественные данные и внешняя обратная связь",
      "снижается зависимость только от самоотчета вуза",
      "итоговая позиция становится устойчивее и понятнее",
    ],
  },
];

const archivePhotos = [
  {
    src: "/storage/images/ireg-archive/image5.jpeg",
    alt: "Архивное фото исполнительного комитета IREG, 2009 год",
  },
  {
    src: "/storage/images/ireg-archive/image6.jpeg",
    alt: "Архивное фото из материалов IREG, 2009 год",
  },
  {
    src: "/storage/images/ireg-archive/image7.jpeg",
    alt: "Архивное фото из старой версии сайта IREG, 2009 год",
  },
];

export default function IregPage() {
  const [activePrinciple, setActivePrinciple] = useState(principles[0].id);
  const principle = principles.find((item) => item.id === activePrinciple) ?? principles[0];
  const PrincipleIcon = principle.icon;

  return (
    <>
      <Head title="IREG и Берлинские принципы" />

      <div className="min-h-screen bg-[#f7f7f2] text-slate-950">
        <section className="relative overflow-hidden bg-[#0f172a] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.18),transparent_34%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-6">
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
                <Link href="/methodology" className="transition hover:text-slate-950">
                  Методология
                </Link>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-slate-950">IREG</span>
              </nav>
            </header>

            <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-blue-100">
                  <Globe2 className="h-4 w-4" />
                  IREG и Берлинские принципы
                </div>

                <h1 className="text-4xl font-semibold leading-tight md:text-6xl">Международная рамка доверия к рейтингу</h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                  Эта страница объясняет, почему IREG и Берлинские принципы важны для понимания методологии рейтинга IQAA, и отдельно
                  показывает подтвержденное участие руководства IQAA в конференциях IREG.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#conferences"
                    className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Смотреть конференции IQAA
                    <ChevronRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#archive"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Открыть архивный блок
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.8rem] bg-white p-5 text-slate-950 shadow-2xl shadow-slate-950/20">
                  <div className="text-xs uppercase tracking-[0.24em] text-blue-700">Логотип IREG</div>
                  <div className="mt-4 flex min-h-[96px] items-center justify-center rounded-[1.3rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                    <img src="/images/ireg-logo.png" alt="Логотип IREG" className="h-auto w-full max-w-[200px] object-contain" />
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.8rem] bg-white shadow-2xl shadow-slate-950/20">
                  <img
                    src="/storage/images/ireg-certificate.png"
                    alt="Архивный документ IREG и Берлинских принципов"
                    className="h-[260px] w-full object-cover object-center"
                  />
                  <div className="p-5 text-slate-950">
                    <div className="text-xs uppercase tracking-[0.24em] text-orange-700">Документ / скан</div>
                    <div className="mt-2 text-xl font-semibold">Визуальный документ из архива IREG</div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Нейтральный визуал, который поддерживает разговор о международных принципах качества и историческом контексте
                      ранжирования.
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.8rem] ring-1 ring-white/10">
                  <img
                    src="/storage/images/ireg-conferences/ireg-2023-tashkent.jpg"
                    alt="Участники IREG 2023 в Ташкенте и Самарканде"
                    className="h-[180px] w-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-6 py-12">
          <section className="border-b border-slate-200 pb-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Таймлайн</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Короткая хронология IREG</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                История здесь показана только в том объеме, который помогает понять происхождение принципов и их связь с методологией IQAA.
              </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {timeline.map((item) => (
                <article key={item.year} className="relative pl-6">
                  <div className="absolute bottom-0 left-2 top-0 w-px bg-slate-200" />
                  <div className="absolute left-0 top-7 h-4 w-4 rounded-full border-4 border-[#f7f7f2] bg-orange-500 shadow-sm shadow-orange-500/30" />

                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                      {item.year}
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="conferences" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">IQAA на конференциях IREG</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Подтвержденные конференции с участием руководства IQAA</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Здесь показаны только те конференции, для которых есть и официальный след на сайте IREG, и найденные фотографии участия
                руководства IQAA.
              </p>
            </div>

            <div className="mt-8 space-y-10">
              {conferenceHighlights.map((conference) => (
                <section key={conference.id} className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                  <div className="rounded-[1.7rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                    <div className="text-xs uppercase tracking-[0.24em] text-blue-700">
                      {conference.year} • {conference.city}, {conference.country}
                    </div>
                    <h3 className="mt-3 text-3xl font-semibold text-slate-950">{conference.title}</h3>
                    <div className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-orange-700">{conference.dates}</div>
                    <p className="mt-4 text-lg leading-7 text-slate-800">{conference.theme}</p>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{conference.summary}</p>

                    <div className="mt-6 rounded-[1.4rem] bg-white p-4 ring-1 ring-slate-200">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Официальный источник IREG</div>
                      <a
                        href={conference.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                      >
                        Открыть страницу конференции
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  <div className={`grid gap-4 ${conference.photos.length > 1 ? "md:grid-cols-2" : ""}`}>
                    {conference.photos.map((photo, index) => (
                      <div
                        key={photo.src}
                        className={`overflow-hidden rounded-[1.7rem] bg-white shadow-sm ring-1 ring-slate-200 ${
                          conference.photos.length === 3 && index === 2 ? "md:col-span-2" : ""
                        }`}
                      >
                        <img src={photo.src} alt={photo.alt} className="h-[260px] w-full object-cover object-center" />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Исторический контекст 2010</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Берлин и Варшава в архиве IREG</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Эти фотографии оставлены как отдельный исторический слой: они показывают ранние события IREG в 2010 году и не смешиваются
                с подтвержденным блоком участия IQAA в 2019 и 2023 годах.
              </p>
            </div>

            <div className="mt-8 space-y-10">
              {historical2010.map((item) => (
                <section key={item.id} className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
                  <div className="overflow-hidden rounded-[1.8rem] bg-slate-50 ring-1 ring-slate-200">
                    <img src={item.photo.src} alt={item.photo.alt} className="h-[320px] w-full object-cover object-center" />
                  </div>

                  <div className="rounded-[1.8rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                    <div className="text-xs uppercase tracking-[0.24em] text-blue-700">
                      {item.year} • {item.location}
                    </div>
                    <h3 className="mt-3 text-3xl font-semibold text-slate-950">{item.title}</h3>
                    <div className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-orange-700">{item.dates}</div>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>

                    <div className="mt-6 rounded-[1.3rem] bg-white p-4 ring-1 ring-slate-200">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.sourceLabel}</div>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                      >
                        Открыть источник
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section id="principles" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Интерактивный обзор</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Как принципы IREG читаются в методологии IQAA</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Выбери принцип, чтобы увидеть его исходную идею, отражение в методологии IQAA и практический смысл для пользователя.
              </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
              <div className="space-y-3">
                {principles.map((item) => {
                  const isActive = item.id === activePrinciple;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActivePrinciple(item.id)}
                      className={`w-full rounded-[1.4rem] border p-4 text-left transition ${
                        isActive ? "border-blue-200 bg-blue-50 shadow-sm" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-2xl p-3 ${isActive ? "bg-blue-100 text-blue-700" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="text-sm font-semibold text-slate-950">{item.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[1.6rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                    <PrincipleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">{principle.name}</div>
                    <p className="mt-3 text-base leading-7 text-slate-700">{principle.summary}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.3rem] bg-white p-4 ring-1 ring-slate-200">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Принцип IREG</div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{principle.principle}</p>
                  </div>

                  <div className="rounded-[1.3rem] bg-[#fff7ed] p-4 ring-1 ring-orange-200">
                    <div className="text-xs uppercase tracking-[0.24em] text-orange-700">Как это видно в IQAA</div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{principle.iqaa}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.3rem] bg-white p-4 ring-1 ring-slate-200">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Что это значит для пользователя рейтинга</div>
                  <div className="mt-4 space-y-3">
                    {principle.bullets.map((bullet) => (
                      <div key={bullet} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                        <p className="text-sm leading-6 text-slate-700">{bullet}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
              <img
                src="/storage/images/ireg-conferences/ireg-2019-bologna-16.jpg"
                alt="Групповой кадр IREG 2019 в Болонье"
                className="h-[340px] w-full object-cover object-center"
              />
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Нейтральные визуалы</div>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Визуальный материал без перегруза персоналиями</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Для страницы использованы логотип IREG, архивный документ, таймлайн, иконки и подтвержденные конференционные фотографии.
                Исторический и современный контент разделен, чтобы архив не воспринимался как актуальный состав органов IREG.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex gap-3 rounded-[1.4rem] bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                  <p className="text-sm leading-6 text-slate-700">Логотип IREG работает как нейтральный визуальный якорь международной рамки.</p>
                </div>
                <div className="flex gap-3 rounded-[1.4rem] bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                  <p className="text-sm leading-6 text-slate-700">Архивный документ усиливает разговор о Берлинских принципах и культуре прозрачного ранжирования.</p>
                </div>
                <div className="flex gap-3 rounded-[1.4rem] bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                  <p className="text-sm leading-6 text-slate-700">Фотографии вынесены в отдельный конференционный и архивный контур, а не смешаны в один общий исторический поток.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="archive" className="mt-10 rounded-[2rem] bg-[#111827] p-6 text-white shadow-sm ring-1 ring-slate-800">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-200">Историческая справка</div>
                <h2 className="mt-2 text-3xl font-semibold">Фото исполнительного комитета IREG, 2009 год</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-300">
                Архивный фотоблок сохранен как исторический контекст. Эти изображения не следует воспринимать как актуальный состав или
                действующую структуру IREG сегодня.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {archivePhotos.map((photo) => (
                <div key={photo.src} className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5">
                  <img src={photo.src} alt={photo.alt} className="h-[230px] w-full object-cover object-center" />
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-blue-200">Архивный дисклеймер</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Блок оставлен как архивная справка: он показывает исторический визуальный материал из старой версии сайта и дополняет
                страницу, но не заменяет актуальную институциональную информацию об IREG.
              </p>
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Связь со страницей методологии</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Где это встречается в рейтинге IQAA</h2>
              </div>

              <Link href="/methodology" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
                Вернуться к методологии
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">Прозрачная структура</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  5 анкет, открытые веса и детальная раскладка Анкеты №1 делают модель понятной и проверяемой.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">Многоисточниковая оценка</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  В рейтинге соединяются данные вуза, экспертная оценка и обратная связь от работодателей, студентов и выпускников.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">Аккуратная интерпретация</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Принципы IREG помогают объяснять результаты как аналитический инструмент, а не как единственный критерий качества.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
