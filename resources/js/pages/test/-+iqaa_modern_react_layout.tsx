import React, { useState, useMemo } from "react";

// IQAA Modern React Layout
// Brand-based redesign: Blue + Orange + White
// Presentation + MVP-ready

const universities = [
  {
    id: 1,
    rank: 1,
    name: "КазНУ им. аль-Фараби",
    city: "Алматы",
    score: 61.27,
    scopus: 4.63,
    reputation: 4.1,
    image: "https://picsum.photos/400/250?1",
  },
  {
    id: 2,
    rank: 2,
    name: "ВКУ им. С. Аманжолова",
    city: "Усть-Каменогорск",
    score: 53.2,
    scopus: 4.39,
    reputation: 2.69,
    image: "https://picsum.photos/400/250?2",
  },
  {
    id: 3,
    rank: 3,
    name: "Жетысуский университет",
    city: "Талдыкорган",
    score: 45.8,
    scopus: 3.96,
    reputation: 4.21,
    image: "https://picsum.photos/400/250?3",
  },
];

export default function App() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return universities.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg" />
            <div>
              <h1 className="font-semibold text-lg">IQAA Ranking</h1>
              <p className="text-xs text-blue-200">Независимое агентство</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 text-sm">
            <a className="hover:text-orange-300" href="#">Главная</a>
            <a className="hover:text-orange-300" href="#">Рейтинг вузов</a>
            <a className="hover:text-orange-300" href="#">Программы</a>
            <a className="hover:text-orange-300" href="#">Методология</a>
            <a className="hover:text-orange-300" href="#">Контакты</a>
          </nav>

          <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm">
            Личный кабинет
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-semibold text-blue-900 mb-2">
            Рейтинг вузов Казахстана
          </h2>
          <p className="text-slate-600 mb-6">
            Независимость · Профессионализм · Объективность
          </p>

          <div className="grid md:grid-cols-5 gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск вуза"
              className="md:col-span-2 border px-3 py-2 rounded"
            />

            <select className="border px-3 py-2 rounded">
              <option>Все города</option>
              <option>Алматы</option>
              <option>Астана</option>
            </select>

            <select className="border px-3 py-2 rounded">
              <option>Все направления</option>
              <option>Инженерия</option>
              <option>Медицина</option>
            </select>

            <button className="bg-orange-500 hover:bg-orange-600 text-white rounded">
              Найти
            </button>
          </div>
        </div>
      </section>

      {/* Ranking */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h3 className="text-xl font-semibold text-blue-900 mb-6">
          Топ университетов
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative">
                <img src={u.image} alt="" className="w-full h-40 object-cover" />
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                  #{u.rank}
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-semibold text-lg text-slate-800">
                  {u.name}
                </h4>
                <p className="text-sm text-slate-500 mb-3">{u.city}</p>

                <div className="grid grid-cols-3 text-center text-sm">
                  <div>
                    <div className="font-semibold text-blue-800">{u.score}</div>
                    <div className="text-xs text-slate-500">Итог</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">{u.scopus}</div>
                    <div className="text-xs text-slate-500">Scopus</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">{u.reputation}</div>
                    <div className="text-xs text-slate-500">Репутация</div>
                  </div>
                </div>

                <button className="mt-4 w-full border border-blue-700 text-blue-700 py-2 rounded hover:bg-blue-50">
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-100 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm">
          © 2026 IQAA · Независимое агентство обеспечения качества
        </div>
      </footer>
    </div>
  );
}
