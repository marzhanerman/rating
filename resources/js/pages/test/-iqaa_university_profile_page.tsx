import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

// IQAA Full Prototype: Main + University Profile + Languages + Branding
// Requires: react-router-dom

const universities = [
  {
    id: 1,
    rank: 1,
    name: "КазНУ им. аль-Фараби",
    city: "Алматы",
    score: 61.27,
    scopus: 4.63,
    type: "Многопрофильные вузы",
    reputation: 4.1,
    image: "https://picsum.photos/400/250?1",
    description: "Ведущий национальный университет Казахстана.",
    website: "https://kaznu.kz",
  },
  {
    id: 2,
    rank: 2,
    name: "ВКУ им. С. Аманжолова",
    city: "Усть-Каменогорск",
    score: 53.2,
    scopus: 4.39,
    type: "Многопрофильные вузы",
    reputation: 2.69,
    image: "https://picsum.photos/400/250?2",
    description: "Крупный региональный научный центр.",
    website: "https://vku.edu.kz",
  },
  {
    id: 3,
    rank: 3,
    name: "Жетысуский университет",
    city: "Талдыкорган",
    score: 45.8,
    scopus: 3.96,
    type: "Многопрофильные вузы",
    reputation: 4.21,
    image: "https://picsum.photos/400/250?3",
    description: "Многопрофильный региональный вуз.",
    website: "https://zhetysu.edu.kz",
  },
];
interface Props {
  lang: string;
  setLang: (lang: string) => void;
}


/* ---------------- Layout Components ---------------- */

function Header({ 
  lang = "RUS", 
  setLang = () => {} 
 }: Props) {
  const [open, setOpen] = useState(null);

  const menu = [
    { name: "Главная", link: "/" },
    {
      name: "Рейтинги",
      children: [
        { name: "Все рейтинги", link: "/rankings" },
        { name: "Рейтинг вузов", link: "/rankings/universities" },
        { name: "По регионам", link: "/rankings/regions" },
      ],
    },
    {
      name: "Программы",
      children: [
        { name: "Каталог программ", link: "/programs" },
        { name: "Бакалавриат", link: "/programs/bachelor" },
        { name: "Магистратура", link: "/programs/master" },
        { name: "PhD", link: "/programs/phd" },
      ],
    },
    { name: "Аналитика", link: "/analytics" },
    { name: "Методология", link: "/methodology" },
    { name: "О нас", link: "/about" },
    { name: "Контакты", link: "/contacts" },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/logo-iqaa.png"
            alt="IQAA"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="font-semibold text-lg">IQAA Ranking</h1>
            <p className="text-xs text-blue-200">Независимое агентство</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-sm">
          <Link to="/" className="hover:text-orange-300">Главная</Link>
          <Link to="/" className="hover:text-orange-300">Рейтинг вузов</Link>
          <Link to="#" className="hover:text-orange-300">Программы</Link>
          <Link to="#" className="hover:text-orange-300">Методология</Link>
          <Link to="#" className="hover:text-orange-300">Контакты</Link>
        </nav>

        {/* Language + Cabinet */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex gap-2">
            {['KAZ','RUS','ENG'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 rounded ${lang===l?'bg-orange-500':'bg-blue-800'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded">
            Кабинет
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Pages ---------------- */

function Home() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return universities.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-semibold text-blue-900 mb-2">
            Рейтинг вузов Казахстана
          </h2>
          <p className="text-slate-600 mb-6">
            Независимость · Профессионализм · Объективность
          </p>

          <div className="grid md:grid-cols-4 gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск вуза"
              className="border px-3 py-2 rounded"
            />

            <select className="border px-3 py-2 rounded">
              <option>Все города</option>
              <option>Алматы</option>
              <option>Астана</option>
            </select>

            <select className="border px-3 py-2 rounded">
              <option>Все направления</option>
            </select>

            <button className="bg-orange-500 text-white rounded">
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
            <Link
              key={u.id}
              to={`/university/${u.id}`}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative">
                <img src={u.image} alt="" className="w-full h-40 object-cover" />
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                  #{u.rank}
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-semibold text-lg">{u.name}</h4>
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
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

/* ---------------- Rankings Page ---------------- */

function RankingsPage() {
  const [year, setYear] = useState("2025");
  const [type, setType] = useState("all");
  const [city, setCity] = useState("all");

  const filtered = useMemo(() => {
    return universities.filter((u) => {
      return (
        (type === "all" || u.type === type) &&
        (city === "all" || u.city === city)
      );
    });
  }, [type, city]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">
        Рейтинги вузов
      </h2>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 grid md:grid-cols-4 gap-4">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option>2025</option>
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Все типы</option>
          <option value="national">Национальные</option>
          <option value="regional">Региональные</option>
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Все города</option>
          <option>Алматы</option>
          <option>Астана</option>
          <option>Усть-Каменогорск</option>
        </select>

        <button className="bg-orange-500 text-white rounded px-4 py-2">
          Применить
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Вуз</th>
              <th className="p-3">Город</th>
              <th className="p-3">Итог</th>
              <th className="p-3">Scopus</th>
              <th className="p-3">Репутация</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b hover:bg-blue-50">
                <td className="p-3">{u.rank}</td>
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-center">{u.city}</td>
                <td className="p-3 text-center font-semibold">{u.score}</td>
                <td className="p-3 text-center">{u.scopus}</td>
                <td className="p-3 text-center">{u.reputation}</td>
                <td className="p-3 text-right">
                  <Link
                    to={`/university/${u.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Профиль →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

/* ---------------- University Profile ---------------- */

function UniversityProfile() {
  const { id } = useParams();

  const uni = universities.find((u) => u.id === Number(id));

  if (!uni) return <div className="p-10">Вуз не найден</div>;

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <Link to="/" className="text-sm text-blue-600">← Назад</Link>

      <div className="bg-white rounded-2xl shadow p-6 mt-4">
        <h2 className="text-2xl font-semibold text-blue-900 mb-2">
          {uni.name}
        </h2>

        <p className="text-slate-600 mb-3">{uni.description}</p>

        <div className="flex gap-3 mb-4 text-sm">
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded">
            {uni.city}
          </span>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded">
            Ранг #{uni.rank}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-50 rounded">
            <div className="text-sm text-slate-500">Итог</div>
            <div className="text-xl font-semibold">{uni.score}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded">
            <div className="text-sm text-slate-500">Scopus</div>
            <div className="text-xl font-semibold">{uni.scopus}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded">
            <div className="text-sm text-slate-500">Репутация</div>
            <div className="text-xl font-semibold">{uni.reputation}</div>
          </div>
        </div>

        <a
          href={uni.website}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline"
        >
          Перейти на сайт вуза →
        </a>
      </div>
    </main>
  );
}

/* ---------------- App ---------------- */

/* ---------------- Mobile Menu ---------------- */
interface MobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function MobileMenu({ open, setOpen }: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/40 z-50 transition ${open ? "block" : "hidden"}`}
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white w-64 h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-blue-900 mb-4">Меню</h3>

        <nav className="flex flex-col gap-3 text-sm">
          <Link to="/" onClick={() => setOpen(false)}>Главная</Link>
          <Link to="/rankings" onClick={() => setOpen(false)}>Рейтинги</Link>
          <Link to="/programs" onClick={() => setOpen(false)}>Программы</Link>
          <Link to="/analytics" onClick={() => setOpen(false)}>Аналитика</Link>
          <Link to="/methodology" onClick={() => setOpen(false)}>Методология</Link>
          <Link to="/about" onClick={() => setOpen(false)}>О нас</Link>
          <Link to="/contacts" onClick={() => setOpen(false)}>Контакты</Link>
        </nav>
      </div>
    </div>
  );
}

/* ---------------- App ---------------- */

export default function App() {
  const [lang, setLang] = useState("RUS");
  const [mobileOpen, setMobileOpen] = useState(false);("RUS");

  return (
    <Router>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Header lang={lang} setLang={setLang} />
        
        {/* Mobile button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-4 right-4 z-40 bg-blue-900 text-white px-3 py-2 rounded"
        >
          ☰
        </button>

        <MobileMenu open={mobileOpen} setOpen={setMobileOpen} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/university/:id" element={<UniversityProfile />} />
        </Routes>

        <footer className="bg-blue-900 text-blue-100 mt-10">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm">
            © 2026 IQAA · Независимое агентство обеспечения качества
          </div>
        </footer>
      </div>
    </Router>
  );
}
