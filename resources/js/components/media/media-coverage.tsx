import { useState } from "react";

type Article = {
  title: string;
  date: string;
  link: string;
};

type Media = {
  name: string;
  logo: string;
  articles: Article[];
};

export default function MediaCoverage() {
  const [active, setActive] = useState<number>(0);

  const media: Media[] = [
    {
      name: "Egemen Kazakhstan",
      logo: "/images/egemen.png",
      articles: [
        {
          title: "Қазақстан жоғары оқу орындарының ұлттық рейтингі жарияланды",
          date: "2024",
          link: "#",
        },
        {
          title: "Білім сапасын бағалаудың жаңа кезеңі",
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
          title: "Опубликован национальный рейтинг вузов Казахстана",
          date: "2024",
          link: "#",
        },
      ],
    },
    {
      name: "Bilimdi El",
      logo: "/images/bilimdi_el.png",
      articles: [
        {
          title: "Қазақстандық ЖОО рейтингі нәтижелері жарияланды",
          date: "2024",
          link: "#",
        },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl  p-6">
      
      {/* Заголовок */}
      <h3 className="text-blue-700 font-semibold mb-2">
        Авторитетные публикации о рейтинге
      </h3>

      <p className="text-sm text-gray-500 mb-6">
        Публикации в ведущих СМИ Казахстана
      </p>

      {/* Логотипы */}
      <div className="flex gap-6 mb-6 flex-wrap">
        {media.map((item, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`p-3 rounded-xl transition 
              ${
                active === i
                  ? "bg-blue-50 shadow"
                  : "opacity-60 hover:opacity-100"
              }
            `}
          >
            <img
              src={item.logo}
              alt={item.name}
              className="h-10 grayscale hover:grayscale-0 transition"
            />
          </button>
        ))}
      </div>

      {/* Статьи */}
      <div className="space-y-3">
        {media[active].articles.map((article, i) => (
          <a
            key={i}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block border rounded-xl p-4 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="font-medium text-gray-800">
              {article.title}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {article.date}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}