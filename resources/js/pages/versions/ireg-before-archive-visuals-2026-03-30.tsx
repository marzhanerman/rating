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

const facts = [
  {
    year: "2004",
    title: "Формирование экспертной группы IREG",
    text: "IREG появилась как международная площадка для обсуждения качества академических рейтингов и надежности их методологии.",
  },
  {
    year: "2006",
    title: "Принятие Берлинских принципов",
    text: "На конференции в Берлине были зафиксированы принципы добросовестного ранжирования: цель, прозрачность, корректный сбор данных и понятная презентация результатов.",
  },
  {
    year: "Сегодня",
    title: "Почему это важно для IQAA",
    text: "Для этой страницы взяты не архивные биографии и старые составы комитетов, а те идеи IREG, которые действительно помогают объяснить логику методологии рейтинга сегодня.",
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
      "появляется ясная логика публикации рейтинга",
      "метрики подбираются под институциональную оценку",
      "результаты легче интерпретировать без ложных ожиданий",
    ],
  },
  {
    id: "diversity",
    name: "Разнообразие вузов",
    icon: Users,
    summary: "Принципы IREG требуют учитывать различие миссий, профилей и контекста университетов.",
    principle: "Исследовательский, региональный, отраслевой и многопрофильный вуз нельзя оценивать как полностью одинаковые модели.",
    iqaa: "Это отражено через баланс индикаторов: кроме науки учитываются обучение, цифровизация, международное сотрудничество и трудоустройство.",
    bullets: [
      "качество не сводится только к науке или репутации",
      "оценка ближе к реальному профилю университета",
      "сравнение становится более справедливым",
    ],
  },
  {
    id: "transparency",
    name: "Прозрачность методики",
    icon: Scale,
    summary: "Открытость источников, индикаторов и весов — один из центральных принципов добросовестного ранжирования.",
    principle: "Пользователь должен видеть, из чего складывается итоговый балл и почему именно эти показатели включены в модель.",
    iqaa: "В методологии IQAA это видно через 5 анкет, веса 80/5/5/5/5 и подробную раскладку Анкеты №1 по 7 индикаторам.",
    bullets: [
      "каждый блок имеет понятный максимальный балл",
      "структура рейтинга прослеживается от общего результата до критерия",
      "методология становится объяснимой, а не «черным ящиком»",
    ],
  },
  {
    id: "verification",
    name: "Проверяемость данных",
    icon: ShieldCheck,
    summary: "Берлинские принципы рекомендуют опираться на верифицируемые данные и комбинировать несколько источников.",
    principle: "Доверие к рейтингу возникает тогда, когда данные можно перепроверить, а ошибки обнаружить и скорректировать.",
    iqaa: "В IQAA вуз предоставляет основную анкету, затем данные перепроверяются экспертами и сопоставляются с независимыми источниками и результатами опросов.",
    bullets: [
      "соединяются количественные данные и внешняя обратная связь",
      "снижается зависимость только от самоотчета вуза",
      "итоговая позиция становится устойчивее и понятнее",
    ],
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

            <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-blue-100">
                  <Globe2 className="h-4 w-4" />
                  IREG и Берлинские принципы
                </div>

                <h1 className="text-4xl font-semibold leading-tight md:text-6xl">Международная рамка доверия к рейтингу</h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                  Эта страница объясняет, почему IREG и Берлинские принципы важны для понимания методологии рейтинга IQAA, но без перегруза
                  архивными материалами, которые уже потеряли актуальность.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Главная идея</div>
                <div className="mt-3 text-3xl font-semibold">Не история ради истории</div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Здесь оставлены только те элементы IREG, которые реально помогают понять прозрачность, валидность и проверяемость
                  рейтинга.
                </p>
              </div>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-6 py-12">
          <section className="grid gap-6 lg:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.year} className="rounded-[1.7rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="text-xs uppercase tracking-[0.24em] text-blue-700">{fact.year}</div>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">{fact.title}</h2>
                <p className="mt-4 text-sm leading-6 text-slate-600">{fact.text}</p>
              </div>
            ))}
          </section>

          <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Интерактивный обзор</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Как принципы IREG читаются в методологии IQAA</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Выбери принцип, чтобы увидеть его исходную идею, отражение в методологии IQAA и практический смысл для пользователя рейтинга.
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
                <p className="mt-3 text-sm leading-6 text-slate-600">5 анкет, открытые веса и детальная раскладка Анкеты №1 делают модель понятной и проверяемой.</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">Многоисточниковая оценка</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">В рейтинге соединяются данные вуза, экспертная оценка и обратная связь от работодателей, студентов и выпускников.</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">Аккуратная интерпретация</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">Принципы IREG помогают объяснять результаты как аналитический инструмент, а не как единственный критерий качества.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
