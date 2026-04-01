import { ExternalLink, Newspaper } from "lucide-react";
import { useState } from "react";

type Article = {
  title: string;
  date: string;
  link: string;
};

type MediaOutlet = {
  name: string;
  logo: string;
  articles: Article[];
};

type MediaCoverageProps = {
  title?: string;
  description?: string;
  items?: MediaOutlet[];
};

const defaultMediaItems: MediaOutlet[] = [
  {
    name: "Egemen Kazakhstan",
    logo: "/images/egemen.png",
    articles: [
      {
        title: "Опубликован национальный рейтинг вузов Казахстана",
        date: "2024",
        link: "#",
      },
      {
        title: "Новый этап независимой оценки качества высшего образования",
        date: "2023",
        link: "#",
      },
    ],
  },
  {
    name: "Казахстанская правда",
    logo: "/images/kp.jpg",
    articles: [
      {
        title: "Эксперты представили результаты институционального рейтинга вузов",
        date: "2024",
        link: "#",
      },
    ],
  },
  {
    name: "Bilimdi EL",
    logo: "/images/bilimdi_el.png",
    articles: [
      {
        title: "Опубликованы результаты рейтинга высших учебных заведений Казахстана",
        date: "2024",
        link: "#",
      },
    ],
  },
];

export default function MediaCoverage({
  title = "СМИ о рейтинге",
  description = "Подборка публикаций и новостей в ведущих медиа Казахстана.",
  items = defaultMediaItems,
}: MediaCoverageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeOutlet = items[activeIndex] ?? items[0];

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Медиа</div>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">{title}</h2>
        </div>

        <p className="max-w-xl text-sm leading-6 text-slate-500">{description}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-3">
          {items.map((outlet, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={outlet.name}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`flex w-full items-center gap-4 rounded-[1.5rem] border px-4 py-4 text-left transition ${
                  isActive
                    ? "border-blue-200 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div className="flex h-14 w-25 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200">
                  <img src={outlet.logo} alt={outlet.name} className="max-h-10 max-w-[100px] object-contain" />
                </div>

                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-slate-950">{outlet.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{outlet.articles.length} публикаций</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-[1.75rem] bg-slate-50 p-5 ring-1 ring-slate-200">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Выбрано издание</div>
              <div className="text-lg font-semibold text-slate-950">{activeOutlet?.name}</div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {activeOutlet?.articles.map((article) => (
              <a
                key={`${activeOutlet.name}-${article.title}`}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-[1.5rem] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-[0.2em] text-blue-700">{article.date}</div>
                    <h3 className="mt-2 text-lg font-semibold leading-snug text-slate-950">{article.title}</h3>
                  </div>

                  <div className="rounded-full bg-slate-100 p-2 text-slate-500">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
