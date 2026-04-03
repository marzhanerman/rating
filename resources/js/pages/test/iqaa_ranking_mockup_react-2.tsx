import React from "react";

export default function IQAARankingMockup() {
  const universities = [
    {
      rank: 1,
      name: "Казахский национальный университет им. аль-Фараби",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
      score: "61.27",
      a: "4.63",
      b: "4.10",
    },
    {
      rank: 2,
      name: "Восточно-Казахстанский университет им. С. Аманжолова",
      image: "https://images.unsplash.com/photo-1562774053-701939374585",
      score: "53.20",
      a: "4.39",
      b: "2.69",
    },
    {
      rank: 3,
      name: "Жетысуский университет им. И. Жансугурова",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
      score: "45.80",
      a: "3.96",
      b: "4.21",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg" />
            <div>
              <h1 className="font-bold text-lg">IQAA RANKING</h1>
              <p className="text-xs opacity-80">Рейтинг вузов</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#" className="hover:underline">Главная</a>
            <a href="#" className="hover:underline">Рейтинг вузов</a>
            <a href="#" className="hover:underline">Рейтинг программ</a>
            <a href="#" className="hover:underline">Методология</a>
            <a href="#" className="hover:underline">Контакты</a>
          </nav>

          <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-semibold shadow">
            Личный кабинет
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-blue-700 font-semibold mb-4">
          Независимость. Профессионализм. Объективность.
        </h2>

        <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row gap-3 items-stretch">
          <select className="border rounded-lg px-3 py-2 w-full">
            <option>Все города</option>
          </select>

          <select className="border rounded-lg px-3 py-2 w-full">
            <option>Все направления</option>
          </select>

          <input
            type="text"
            placeholder="Тип вуза"
            className="border rounded-lg px-3 py-2 w-full"
          />

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-medium">
            Поиск вуза
          </button>

          <button className="border border-blue-500 text-blue-600 px-5 py-2 rounded-lg font-medium">
            Сбросить
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Найдено вузов: {universities.length}
        </p>
      </section>

      {/* Ranking Cards */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {universities.map((u) => (
            <div
              key={u.rank}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative">
                <img
                  src={u.image}
                  alt={u.name}
                  className="w-full h-48 object-cover"
                />

                <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  #{u.rank}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-sm mb-3 min-h-[40px]">
                  {u.name}
                </h3>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-blue-600 font-bold text-lg">{u.score}</p>
                    <p className="text-xs text-gray-500">Итог</p>
                  </div>
                  <div>
                    <p className="text-orange-500 font-bold text-lg">{u.a}</p>
                    <p className="text-xs text-gray-500">Показатель A</p>
                  </div>
                  <div>
                    <p className="text-blue-500 font-bold text-lg">{u.b}</p>
                    <p className="text-xs text-gray-500">Показатель B</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
        {/* Methodology */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-orange-500 font-semibold mb-4">
            Методология рейтинга
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• О методике</li>
            <li>• Критерии и показатели</li>
            <li>• Анкетные опросы</li>
            <li>• Тип вуза</li>
          </ul>

          <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
            Подробнее
          </button>
        </div>

        {/* Certificate */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-center">
          <div className="w-full h-40 bg-slate-100 rounded-lg flex items-center justify-center text-gray-400">
            IREG Certificate
          </div>
        </div>

        {/* Partners */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-blue-700 font-semibold mb-4">IREG — Партнёры</h3>
          <div className="space-y-3">
            <div className="h-16 bg-slate-100 rounded-lg" />
            <div className="h-16 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </section>

      {/* News */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-blue-700 font-semibold mb-4">Новости</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition"
            >
              <p className="font-medium text-sm mb-2">
                Объявлены результаты нового рейтинга вузов
              </p>
              <p className="text-xs text-orange-500 mb-3">24.04.2024</p>

              <button className="text-blue-600 text-sm hover:underline">
                Читать далее
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm opacity-90">
          © {new Date().getFullYear()} IQAA Ranking. Все права защищены.
        </div>
      </footer>
    </div>
  );
}
