import { Head, Link } from "@inertiajs/react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  Globe2,
  GraduationCap,
  LibraryBig,
  MonitorSmartphone,
  Microscope,
  Users,
} from "lucide-react";
import { useState } from "react";

type Questionnaire = {
  id: string;
  name: string;
  weight: number;
  maxPoints: number;
  audience: string;
  summary: string;
  details: string;
};

type Indicator = {
  id: string;
  name: string;
  points: number;
  weight: number;
  icon: typeof GraduationCap;
  description: string;
  criteria: Array<{
    code: string;
    title: string;
    points: number;
  }>;
};

const questionnaires: Questionnaire[] = [
  {
    id: "q1",
    name: "Анкета №1",
    weight: 80,
    maxPoints: 800,
    audience: "Заполняет вуз",
    summary: "Основная анкета с подтверждаемыми количественными показателями по ресурсам, результатам и институциональному развитию.",
    details:
      "Университет предоставляет исходные данные, после чего показатели дополнительно сверяются экспертами и независимыми источниками.",
  },
  {
    id: "q2",
    name: "Анкета №2",
    weight: 5,
    maxPoints: 50,
    audience: "Эксперты",
    summary: "Экспертная оценка деятельности университета как отдельный качественный слой рейтинга.",
    details: "Позволяет дополнить статистику профессиональной интерпретацией сильных и слабых сторон вуза.",
  },
  {
    id: "q3",
    name: "Анкета №3",
    weight: 5,
    maxPoints: 50,
    audience: "Работодатели",
    summary: "Оценка репутации вуза и качества подготовки выпускников с позиции рынка труда.",
    details: "Показывает, насколько университет воспринимается востребованным и полезным для профессиональной среды.",
  },
  {
    id: "q4",
    name: "Анкета №4",
    weight: 5,
    maxPoints: 50,
    audience: "Студенты",
    summary: "Оценка образовательного опыта и удовлетворенности качеством учебного процесса.",
    details: "Добавляет пользовательский взгляд на организацию обучения, инфраструктуру и академическую среду.",
  },
  {
    id: "q5",
    name: "Анкета №5",
    weight: 5,
    maxPoints: 50,
    audience: "Выпускники",
    summary: "Оценка качества полученного образования и результатов после завершения обучения.",
    details: "Позволяет увидеть обратную связь по карьерной траектории и практической отдаче от образования.",
  },
];

const indicators: Indicator[] = [
  {
    id: "students",
    name: "Контингент студентов",
    points: 80,
    weight: 10,
    icon: Users,
    description: "Показывает масштаб, структуру и социальную обеспеченность студенческого контингента.",
    criteria: [
      { code: "1.1", title: "Доля студентов по государственному образовательному заказу", points: 15 },
      { code: "1.2", title: "Доля магистрантов и обучающихся PhD", points: 15 },
      { code: "1.3", title: "Доля иногородних студентов", points: 15 },
      { code: "1.4", title: "Обеспеченность иногородних студентов общежитием", points: 15 },
      { code: "1.5", title: "Индекс масштабирования вуза", points: 20 },
    ],
  },
  {
    id: "learning",
    name: "Результаты обучения и образовательные программы",
    points: 80,
    weight: 10,
    icon: GraduationCap,
    description: "Оценивает плотность программ, достижения студентов и наличие инновационных и англоязычных программ.",
    criteria: [
      { code: "2.1", title: "Соотношение числа студентов и количества программ бакалавриата, магистратуры и PhD", points: 25 },
      { code: "2.2", title: "Победы студентов на конкурсах, конференциях, олимпиадах, спортивных и творческих событиях", points: 35 },
      { code: "2.3", title: "Доля новых и инновационных образовательных программ", points: 10 },
      { code: "2.4", title: "Доля образовательных программ на английском языке", points: 10 },
    ],
  },
  {
    id: "staff",
    name: "Академические кадры и научные сотрудники",
    points: 110,
    weight: 13.75,
    icon: LibraryBig,
    description: "Фокусируется на квалификации ППС и научных сотрудников, их структуре и профессиональных достижениях.",
    criteria: [
      { code: "3.1", title: "Доля докторов наук, кандидатов наук и PhD в штатном составе ППС", points: 25 },
      { code: "3.2", title: "Доля остепененных совместителей из отраслей экономики", points: 15 },
      { code: "3.3", title: "Доля ППС с дипломами и степенями вузов дальнего зарубежья", points: 10 },
      { code: "3.4", title: "Соотношение числа студентов на одного штатного ППС", points: 20 },
      { code: "3.5", title: "Доля остепененных штатных научных сотрудников", points: 10 },
      { code: "3.6", title: "Доля остепененных научных сотрудников-совместителей", points: 5 },
      { code: "3.7", title: "Грант «Лучший преподаватель вуза»", points: 15 },
      { code: "3.8", title: "Грант «Лучший научный работник»", points: 10 },
    ],
  },
  {
    id: "research",
    name: "Научно-исследовательская и инновационная работа",
    points: 170,
    weight: 21.25,
    icon: Microscope,
    description: "Самый весомый блок: публикации, цитируемость, патенты, финансирование НИР и диссертационные советы.",
    criteria: [
      { code: "4.1", title: "Объем финансирования НИР на одного преподавателя и научного сотрудника", points: 20 },
      { code: "4.2", title: "Публикации в казахстанских изданиях, рекомендованных КОКНВО", points: 5 },
      { code: "4.3", title: "Публикационная активность и цитирование в Science Index", points: 15 },
      { code: "4.4", title: "Публикации и h-index в Web of Science и Scopus", points: 80 },
      { code: "4.5", title: "Патенты на одного преподавателя и научного сотрудника", points: 30 },
      { code: "4.6", title: "Свидетельства о госрегистрации прав на объекты авторского права", points: 10 },
      { code: "4.7", title: "Количество диссертационных советов по подготовке PhD", points: 10 },
    ],
  },
  {
    id: "international",
    name: "Международное сотрудничество",
    points: 90,
    weight: 11.25,
    icon: Globe2,
    description: "Измеряет международную интеграцию университета через программы, мобильность и иностранных участников.",
    criteria: [
      { code: "5.1", title: "Совместные программы двудипломного образования", points: 20 },
      { code: "5.2", title: "Международные обмены, командировки и стажировки ППС и сотрудников", points: 20 },
      { code: "5.3", title: "Международная академическая мобильность студентов", points: 20 },
      { code: "5.4", title: "Доля иностранных студентов", points: 10 },
      { code: "5.5", title: "Доля иностранных и приглашенных преподавателей", points: 20 },
    ],
  },
  {
    id: "digital",
    name: "Цифровизация вуза",
    points: 110,
    weight: 13.75,
    icon: MonitorSmartphone,
    description: "Оценивает цифровую зрелость через сайт, соцсети, платформы и дистанционные образовательные технологии.",
    criteria: [
      { code: "6.1", title: "Оценка официального веб-сайта: контент, обновляемость, навигация, языки, ссылки и скорость", points: 50 },
      { code: "6.2", title: "Количество официальных аккаунтов в соцсетях с систематическими публикациями", points: 10 },
      { code: "6.3", title: "Дистанционные образовательные технологии, MOOC и внешние онлайн-платформы", points: 50 },
    ],
  },
  {
    id: "employment",
    name: "Результаты трудоустройства выпускников",
    points: 160,
    weight: 20,
    icon: BriefcaseBusiness,
    description: "Показывает итоговую отдачу вуза: трудоустройство, выпуск по программам и международные гранты выпускников.",
    criteria: [
      { code: "7.1", title: "Доля выпускников, трудоустроенных в первый год после окончания вуза", points: 100 },
      { code: "7.2", title: "Соотношение количества выпускников и количества программ бакалавриата, магистратуры и PhD", points: 30 },
      { code: "7.3", title: "Доля выпускников, получивших международные гранты и стипендии", points: 30 },
    ],
  },
];

const processSteps = [
  "Вуз заполняет Анкету №1 и подтверждает количественные показатели.",
  "Агентство и эксперты перепроверяют данные, включая независимые источники.",
  "Эксперты, работодатели, студенты и выпускники заполняют Анкеты №2–№5.",
  "Итоговый рейтинг складывается из 1000 баллов: 800 по Анкете №1 и 200 по опросным анкетам.",
];

const notes = [
  "Для медицинских и ветеринарных направлений студентов интернатуры относят к бакалавриату, а резидентуры — к магистратуре.",
  "Победы студентов на конференциях и олимпиадах собственного вуза не включаются в число достижений для расчета.",
  "Вузы искусства вместо НИР могут представлять результаты концертной деятельности, в том числе зарубежной.",
];

export default function MethodologyPage() {
  const [activeQuestionnaire, setActiveQuestionnaire] = useState(questionnaires[0].id);
  const [activeIndicator, setActiveIndicator] = useState(indicators[0].id);

  const questionnaire = questionnaires.find((item) => item.id === activeQuestionnaire) ?? questionnaires[0];
  const indicator = indicators.find((item) => item.id === activeIndicator) ?? indicators[0];
  const IndicatorIcon = indicator.icon;

  return (
    <>
      <Head title="Методология рейтинга" />

      <div className="min-h-screen bg-[#f7f7f2] text-slate-950">
        <section className="relative overflow-hidden bg-[#0f2d63] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.28),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(96,165,250,0.22),transparent_34%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:72px_72px]" />

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
                <Link href="/ranking" className="transition hover:text-slate-950">
                  Рейтинг вузов
                </Link>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-slate-950">Методология</span>
              </nav>
            </header>

            <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1.1fr)_370px] lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-blue-100">
                  <FileSpreadsheet className="h-4 w-4" />
                  Методология институционального рейтинга вузов Казахстана
                </div>

                <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">Как рассчитывается рейтинг IQAA</h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 md:text-lg">
                  Страница показывает структуру анкет, распределение баллов и ключевые индикаторы, из которых складывается институциональный
                  рейтинг вузов.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#questionnaires"
                    className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Изучить анкеты
                    <ChevronRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#indicators"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Перейти к индикаторам
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Всего анкет</div>
                    <div className="mt-3 text-4xl font-semibold">5</div>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Индикаторов в Анкете №1</div>
                    <div className="mt-3 text-4xl font-semibold">7</div>
                  </div>
                  <div className="col-span-2 rounded-3xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-blue-100">Максимум баллов</div>
                    <div className="mt-3 text-4xl font-semibold">1000</div>
                    <div className="mt-2 text-sm text-blue-100">800 баллов по Анкете №1 и еще 200 баллов по анкетам 2–5.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-6 py-12">
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Логика оценки</div>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Как устроен расчет</h2>

              <div className="mt-8 grid gap-4">
                {processSteps.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#fff7ed] p-6 shadow-sm ring-1 ring-orange-200">
              <div className="text-sm font-medium uppercase tracking-[0.24em] text-orange-700">Особые правила</div>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Методические оговорки</h2>

              <div className="mt-8 space-y-4">
                {notes.map((note) => (
                  <div key={note} className="flex gap-3 rounded-[1.5rem] bg-white/90 p-4 ring-1 ring-orange-100">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <p className="text-sm leading-6 text-slate-700">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] bg-[#0f172a] p-6 text-white shadow-sm ring-1 ring-slate-800">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-blue-100">
                  <Globe2 className="h-4 w-4" />
                  IREG
                </div>
                <h2 className="mt-5 text-3xl font-semibold md:text-4xl">Международные принципы вынесены в отдельную страницу</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                  Чтобы методология оставалась сфокусированной на расчете рейтинга, подробный материал об IREG и Берлинских принципах
                  вынесен отдельно. Так формула оценки не смешивается с международным историческим контекстом.
                </p>
              </div>

              <div className="rounded-[1.7rem] bg-white p-5 text-slate-950">
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Отдельная страница</div>
                <h3 className="mt-2 text-2xl font-semibold">IREG и Берлинские принципы</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Там собраны происхождение принципов, их смысл и интерактивная связь с логикой рейтинга IQAA.
                </p>
                <Link
                  href="/ireg"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Открыть страницу IREG
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          <section id="questionnaires" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Анкеты</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Интерактивная карта анкет</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Нажми на анкету, чтобы увидеть ее вес в модели, максимальный балл и роль в итоговом рейтинге.
              </p>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-5">
              {questionnaires.map((item) => {
                const isActive = item.id === activeQuestionnaire;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveQuestionnaire(item.id)}
                    className={`rounded-[1.6rem] border p-5 text-left transition ${
                      isActive ? "border-blue-200 bg-blue-50 shadow-sm" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.audience}</div>
                    <div className="mt-3 text-xl font-semibold text-slate-950">{item.name}</div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="text-sm text-slate-500">Вес</div>
                        <div className="text-3xl font-semibold text-slate-950">{item.weight}%</div>
                      </div>
                      <ArrowRight className={`h-5 w-5 ${isActive ? "text-blue-700" : "text-slate-400"}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
              <div className="rounded-[1.75rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">{questionnaire.audience}</div>
                <h3 className="mt-2 text-3xl font-semibold text-slate-950">{questionnaire.name}</h3>
                <p className="mt-4 text-base leading-7 text-slate-700">{questionnaire.summary}</p>
                <p className="mt-4 text-sm leading-6 text-slate-500">{questionnaire.details}</p>
              </div>

              <div className="rounded-[1.75rem] bg-[#0f2d63] p-6 text-white">
                <div className="text-xs uppercase tracking-[0.24em] text-blue-200">Максимальный балл</div>
                <div className="mt-3 text-5xl font-semibold">{questionnaire.maxPoints}</div>
                <div className="mt-6 text-xs uppercase tracking-[0.24em] text-blue-200">Доля в общем рейтинге</div>
                <div className="mt-3 text-5xl font-semibold">{questionnaire.weight}%</div>
              </div>
            </div>
          </section>

          <section id="indicators" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Анкета №1</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Распределение баллов по индикаторам</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Исследуй 7 основных индикаторов: в каждом блоке показаны вес, назначение и ключевые критерии оценки.
              </p>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-4">
              {indicators.map((item) => {
                const isActive = item.id === activeIndicator;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndicator(item.id)}
                    className={`rounded-[1.6rem] border p-5 text-left transition ${
                      isActive ? "border-orange-200 bg-orange-50 shadow-sm" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className={`rounded-2xl p-3 ${isActive ? "bg-orange-100 text-orange-700" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">{item.weight}%</div>
                        <div className="text-lg font-semibold text-slate-950">{item.points} б.</div>
                      </div>
                    </div>
                    <div className="mt-4 text-lg font-semibold leading-snug text-slate-950">{item.name}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
              <div className="rounded-[1.75rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                    <IndicatorIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">{indicator.weight}% веса Анкеты №1</div>
                    <h3 className="mt-2 text-3xl font-semibold text-slate-950">{indicator.name}</h3>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{indicator.description}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {indicator.criteria.map((criterion) => (
                    <div key={criterion.code} className="rounded-[1.4rem] bg-white p-4 ring-1 ring-slate-200">
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-sm font-medium uppercase tracking-[0.2em] text-blue-700">{criterion.code}</div>
                        <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{criterion.points} баллов</div>
                      </div>
                      <div className="mt-3 text-base leading-7 text-slate-900">{criterion.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-[#fff7ed] p-6 ring-1 ring-orange-200">
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-orange-700">Быстрый ориентир</div>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Где сосредоточен основной вес</h3>

                <div className="mt-6 space-y-4">
                  {indicators
                    .slice()
                    .sort((a, b) => b.points - a.points)
                    .map((item) => (
                      <div key={item.id}>
                        <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="font-semibold text-slate-950">{item.points} б.</span>
                        </div>
                        <div className="h-2 rounded-full bg-orange-100">
                          <div className="h-2 rounded-full bg-orange-500" style={{ width: `${(item.points / 170) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-8 rounded-[1.4rem] bg-white p-4 ring-1 ring-orange-100">
                  <div className="text-sm text-slate-500">Самый весомый блок</div>
                  <div className="mt-1 text-lg font-semibold text-slate-950">Научно-исследовательская и инновационная работа</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">Этот блок дает 170 баллов, то есть 21,25% всей Анкеты №1.</div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Итог</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Что важно понимать о методологии</h2>
              </div>

              <Link href="/ranking" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
                Открыть рейтинг
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">Количественная база</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Основа рейтинга — проверяемая анкета с показателями студентов, кадров, науки, международной активности, цифровизации и
                  трудоустройства.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">Репутационный слой</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Анкеты экспертов, работодателей, студентов и выпускников добавляют обратную связь о качестве вуза и его результатах.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">Баланс результата и потенциала</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Методология одновременно смотрит на ресурсы, процессы, исследовательскую продуктивность и конечный выход — качество
                  выпускников и их трудоустройство.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
