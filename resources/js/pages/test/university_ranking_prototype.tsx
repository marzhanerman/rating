import React, { useMemo, useState } from "react";

// UniversityRankingPrototype.jsx
// Single-file React component prototype for "Рейтинг вузов"
// Tailwind CSS classes are used for styling (no imports required here).
// Default export is the component.

const SAMPLE_UNIS = [
  {
    id: 1,
    rank: 1,
    name: "Национальный университет Алматы",
    city: "Алматы",
    type: "Государственный",
    industry: "Инженерия",
    scopus: 1245,
    employmentRate: 92,
    accreditation: "Есть",
    facultyCount: 320,
    contacts: "+7 (727) 123-45-67",
    website: "https://uni-almaty.example",
  },
  {
    id: 2,
    rank: 2,
    name: "Казахстанский технический университет",
    city: "Нур-Султан",
    type: "Государственный",
    industry: "Технологии",
    scopus: 980,
    employmentRate: 88,
    accreditation: "Есть",
    facultyCount: 210,
    contacts: "+7 (717) 765-43-21",
    website: "https://ktu.example",
  },
  {
    id: 3,
    rank: 3,
    name: "Частный университет Прогресс",
    city: "Алматы",
    type: "Частный",
    industry: "Бизнес",
    scopus: 120,
    employmentRate: 75,
    accreditation: "В процессе",
    facultyCount: 45,
    contacts: "+7 (727) 555-01-02",
    website: "https://progress.example",
  },
  {
    id: 4,
    rank: 4,
    name: "Гуманитарный университет Востока",
    city: "Шымкент",
    type: "Государственный",
    industry: "Гуманитарные науки",
    scopus: 210,
    employmentRate: 80,
    accreditation: "Есть",
    facultyCount: 110,
    contacts: "+7 (7252) 11-22-33",
    website: "https://vostokuni.example",
  },
];

export default function UniversityRankingPrototype() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Все");
  const [industry, setIndustry] = useState("Все");
  const [uniType, setUniType] = useState("Все");
  const [sortBy, setSortBy] = useState("rank");

  const cities = useMemo(() => ["Все", ...new Set(SAMPLE_UNIS.map((u) => u.city))], []);
  const industries = useMemo(() => ["Все", ...new Set(SAMPLE_UNIS.map((u) => u.industry))], []);
  const types = ["Все", "Государственный", "Частный"];

  const filtered = useMemo(() => {
    let list = SAMPLE_UNIS.filter((u) => {
      if (city !== "Все" && u.city !== city) return false;
      if (industry !== "Все" && u.industry !== industry) return false;
      if (uniType !== "Все" && u.type !== uniType) return false;
      if (query && !u.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });

    switch (sortBy) {
      case "scopus":
        list = list.sort((a, b) => b.scopus - a.scopus);
        break;
      case "employment":
        list = list.sort((a, b) => b.employmentRate - a.employmentRate);
        break;
      default:
        list = list.sort((a, b) => a.rank - b.rank);
    }

    return list;
  }, [city, industry, uniType, query, sortBy]);

  const stats = useMemo(() => {
    const total = SAMPLE_UNIS.length;
    const avgScopus = Math.round(SAMPLE_UNIS.reduce((s, u) => s + u.scopus, 0) / total || 0);
    const avgEmployment = Math.round(SAMPLE_UNIS.reduce((s, u) => s + u.employmentRate, 0) / total || 0);
    return { total, avgScopus, avgEmployment };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Рейтинг вузов</h1>
            <p className="text-sm text-gray-600">Актуальная сводка по показателям вузов — Scopus, трудоустройство, аккредитация</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Обновлено: <span className="font-medium">{new Date().toLocaleDateString()}</span></div>
            <div className="mt-1 text-sm">Пользователи: <span className="font-semibold">{stats.total}</span></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters + Analytics column */}
        <aside className="lg:col-span-1 bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-3">Фильтры</h2>

          <div className="space-y-3">
            <label className="block text-xs text-gray-600">Поиск по названию</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              placeholder="Например: университет Алматы"
            />

            <label className="block text-xs text-gray-600">Город</label>
            <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label className="block text-xs text-gray-600">Отрасль / направление</label>
            <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              {industries.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>

            <label className="block text-xs text-gray-600">Тип</label>
            <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" value={uniType} onChange={(e) => setUniType(e.target.value)}>
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <label className="block text-xs text-gray-600">Сортировать</label>
            <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="rank">По рангу (по умолчанию)</option>
              <option value="scopus">По публикациям (Scopus)</option>
              <option value="employment">По трудоустройству</option>
            </select>

            <button
              onClick={() => { setCity("Все"); setIndustry("Все"); setUniType("Все"); setQuery(""); setSortBy("rank"); }}
              className="w-full mt-2 text-sm py-2 rounded-xl border border-gray-200 bg-gray-50"
            >Сбросить фильтры</button>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium">Быстрая статистика</h3>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-gray-50 rounded-md">
                <div className="text-xs text-gray-500">Всего вузов</div>
                <div className="font-semibold">{stats.total}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded-md">
                <div className="text-xs text-gray-500">Avg Scopus</div>
                <div className="font-semibold">{stats.avgScopus}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded-md">
                <div className="text-xs text-gray-500">Avg трудоустр.</div>
                <div className="font-semibold">{stats.avgEmployment}%</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main listing */}
        <section className="lg:col-span-2">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Список рейтинга</h2>
              <div className="text-sm text-gray-500">Найдено: <span className="font-semibold">{filtered.length}</span></div>
            </div>

            <div className="grid gap-4">
              {filtered.map((u) => (
                <article key={u.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg text-sm font-semibold">#{u.rank}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{u.name}</h3>
                      <div className="text-sm text-gray-500">{u.city} · {u.type} · {u.industry}</div>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0 flex items-center gap-4">
                    <div className="text-sm text-gray-600 text-right">
                      <div>Scopus: <span className="font-medium">{u.scopus}</span></div>
                      <div>Трудоустр.: <span className="font-medium">{u.employmentRate}%</span></div>
                      <div>Аккр.: <span className="font-medium">{u.accreditation}</span></div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a href={u.website} target="_blank" rel="noreferrer" className="text-sm px-3 py-2 border rounded-md">Сайт</a>
                      <a href={`tel:${u.contacts}`} className="text-sm px-3 py-2 bg-gray-50 border rounded-md">Позвонить</a>
                    </div>
                  </div>
                </article>
              ))}

              {filtered.length === 0 && (
                <div className="text-center text-gray-500 py-8">По вашему запросу ничего не найдено.</div>
              )}
            </div>
          </div>
        </section>

        {/* News / Analytics column */}
        <aside className="lg:col-span-1 bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-3">Новости и аналитика</h2>
          <div className="space-y-3">
            <article className="p-3 border border-gray-100 rounded-md">
              <div className="text-xs text-gray-500">2 ноября 2025</div>
              <h4 className="font-medium">Анализ публикационной активности вузов</h4>
              <p className="text-sm text-gray-600">Краткий обзор: какие вузы прибавили публикаций в Scopus за последний год.</p>
            </article>

            <article className="p-3 border border-gray-100 rounded-md">
              <div className="text-xs text-gray-500">28 октября 2025</div>
              <h4 className="font-medium">Обновление критериев рейтинга</h4>
              <p className="text-sm text-gray-600">Добавлены новые метрики по трудоустройству и международному сотрудничеству.</p>
            </article>

            <a className="mt-3 inline-block text-sm text-indigo-600" href="#">Все новости →</a>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Короткая аналитика</h3>
            <div className="text-sm text-gray-600">По последним данным, технические вузы показывают рост публикационной активности, а гуманитарные — улучшили показатели трудоустройства.</div>
          </div>
        </aside>
      </main>

      <footer className="max-w-7xl mx-auto mt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Рейтинг вузов — демо-прототип. Данные примерные.
      </footer>
    </div>
  );
}
