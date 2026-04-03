import React, { useState, useMemo } from "react";

// University Ranking – Interactive Presentation Template (With Colors)
// Academic + modern blue/indigo palette

const universitiesData = [
  {
    id: 1,
    rank: 1,
    name: "Национальный университет Алматы",
    city: "Алматы",
    type: "Государственный",
    field: "Инженерия",
    scopus: 1245,
    employment: 92,
    accreditation: "Есть",
  },
  {
    id: 2,
    rank: 2,
    name: "Казахстанский технический университет",
    city: "Астана",
    type: "Государственный",
    field: "Технологии",
    scopus: 980,
    employment: 88,
    accreditation: "Есть",
  },
  {
    id: 3,
    rank: 3,
    name: "Университет Прогресс",
    city: "Алматы",
    type: "Частный",
    field: "Бизнес",
    scopus: 210,
    employment: 75,
    accreditation: "В процессе",
  },
  {
    id: 4,
    rank: 4,
    name: "Медицинский университет Юг",
    city: "Шымкент",
    type: "Государственный",
    field: "Медицина",
    scopus: 430,
    employment: 85,
    accreditation: "Есть",
  },
];

export default function App() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Все");
  const [field, setField] = useState("Все");
  const [type, setType] = useState("Все");

  const cities = ["Все", ...new Set(universitiesData.map((u) => u.city))];
  const fields = ["Все", ...new Set(universitiesData.map((u) => u.field))];
  const types = ["Все", "Государственный", "Частный"];

  const filteredUniversities = useMemo(() => {
    return universitiesData.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (city !== "Все" && u.city !== city) return false;
      if (field !== "Все" && u.field !== field) return false;
      if (type !== "Все" && u.type !== type) return false;
      return true;
    });
  }, [search, city, field, type]);

  function resetFilters() {
    setSearch("");
    setCity("Все");
    setField("Все");
    setType("Все");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="bg-indigo-900 text-white px-6 py-4 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Рейтинг вузов Казахстана</h1>
          <nav className="flex gap-5 text-sm text-indigo-100">
            <a href="#" className="hover:text-white">О нас</a>
            <a href="#" className="hover:text-white">Методология</a>
            <a href="#" className="hover:text-white">Новости</a>
            <a href="#" className="hover:text-white">Контакты</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-3xl font-semibold mb-2 text-indigo-900">
              Рейтинг вузов Казахстана
            </h2>
            <p className="text-slate-600">
              Интерактивная база университетов с аналитикой и фильтрацией
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="text-2xl font-semibold text-indigo-700">{filteredUniversities.length}</div>
              <div className="text-xs text-slate-500">Найдено вузов</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="text-2xl font-semibold text-indigo-700">145</div>
              <div className="text-xs text-slate-500">Всего в базе</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="text-2xl font-semibold text-indigo-700">2026</div>
              <div className="text-xs text-slate-500">Обновлено</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-4 gap-6">
        {/* Filters */}
        <aside className="bg-white p-5 rounded-2xl shadow-md border-t-4 border-indigo-600">
          <h3 className="font-semibold mb-4 text-indigo-800">Фильтры</h3>

          <div className="space-y-3 text-sm">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию"
              className="w-full border border-slate-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-400"
            />

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2 rounded"
            >
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2 rounded"
            >
              {fields.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2 rounded"
            >
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <button
              onClick={resetFilters}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
            >
              Сбросить фильтры
            </button>
          </div>
        </aside>

        {/* Ranking */}
        <section className="lg:col-span-2">
          <div className="bg-white p-5 rounded-2xl shadow-md">
            <h3 className="font-semibold mb-4 text-indigo-800">Рейтинг вузов</h3>

            <div className="space-y-4">
              {filteredUniversities.map((u) => (
                <div
                  key={u.id}
                  className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:justify-between hover:shadow transition"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-semibold">
                      #{u.rank}
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg text-slate-800">{u.name}</h4>
                      <p className="text-sm text-slate-500">
                        {u.city} · {u.type} · {u.field}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0 text-sm text-slate-600 text-right">
                    <div>Scopus: <span className="font-medium">{u.scopus}</span></div>
                    <div>Работа: <span className="font-medium">{u.employment}%</span></div>
                    <div>Аккр.: <span className="font-medium">{u.accreditation}</span></div>
                  </div>
                </div>
              ))}

              {filteredUniversities.length === 0 && (
                <div className="text-center text-slate-500 py-6">
                  Ничего не найдено
                </div>
              )}
            </div>
          </div>
        </section>

        {/* News */}
        <aside className="bg-white p-5 rounded-2xl shadow-md border-t-4 border-indigo-600">
          <h3 className="font-semibold mb-4 text-indigo-800">Новости</h3>

          <div className="space-y-3 text-sm">
            <div className="border border-slate-200 rounded p-3">
              <div className="text-xs text-slate-500">02.11.2026</div>
              <div className="font-medium">Рост публикаций вузов</div>
            </div>

            <div className="border border-slate-200 rounded p-3">
              <div className="text-xs text-slate-500">28.10.2026</div>
              <div className="font-medium">Обновление методологии</div>
            </div>

            <a href="#" className="text-indigo-600 hover:underline text-sm">
              Все новости →
            </a>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-900 text-indigo-100 py-4 text-center text-sm">
        © 2026 Рейтинг вузов Казахстана · Интерактивный прототип
      </footer>
    </div>
  );
}
