import React from "react";
import { Link, usePage } from "@inertiajs/react";
import SystemTrendChart from "@/components/charts/SystemTrendChart";
import KazakhstanMap from "@/components/background/KazakhstanMap";
import { useState } from 'react';

type InstitutionalRating = {
  rank: number
  total_score: number
}

type University = {
  image: string | undefined;
  id: number
  current_name: string
  institutional_ratings?: InstitutionalRating[]
}

type Rating = {
  id: number
  rank: number
  total_score: number
  category: string
  university: {
    id: number
    current_name: string
    image?: string
    logo?: string
  }
}

type Props = {
  universities?: University[]
  ratings?: Rating[]
}

export default function RankingHome() {
  const { url, props } = usePage<Props>();
  const { universities = [], ratings = [] } = props;
  const top1 = universities[0]
  const top2 = universities[1]
  const top3 = universities[2]
  const rest = universities.slice(3, 5)

  const navLinks = [
    { name: "Рейтинг", href: "/ranking" },
    { name: "Аналитика", href: "/analytics" },
    { name: "Методология", href: "/methodology" },
    { name: "Новости", href: "/news" },
    { name: "О рейтинге", href: "/about" },
  ];

  const universities1 = [
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

  const topUniversities = [
    { rank: 1, name: "КазНУ им. аль-Фараби", score: 92.4 },
    { rank: 2, name: "ЕНУ им. Л.Н. Гумилева", score: 89.7 },
    { rank: 3, name: "Satbayev University", score: 87.2 },
    { rank: 4, name: "КБТУ", score: 85.9 },
    { rank: 5, name: "КазНПУ им. Абая", score: 84.1 },
  ];

  const categoryColors = {
    'Многопрофильные вузы': 'bg-orange-500',
    'Технические вузы': 'bg-blue-500',
    'Гуманитарно-экономические вузы': 'bg-yellow-500',
    'Педагогические вузы': 'bg-yellow-500',
    'Медицинские вузы': 'bg-emerald-500',
    'Вузы искусства и спорта': 'bg-emerald-500',
};
  
const getCategoryColor = (category) =>
    categoryColors[category] || 'bg-gray-500';

const topByCategory = Object.values(
    ratings.reduce((acc, item) => {
        const category = item.institutional_category;

        if (
            !acc[category] ||
            Number(item.total_score) > Number(acc[category].total_score)
        ) {
            acc[category] = item;
        }

        return acc;
    }, {})
);


    const categories = [ ...new Set(ratings.map(r => r.institutional_category))];
const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const filteredRatings =
    /*selectedCategory === "all"
        ? topByCategory
        : */
        ratings.filter(
              r => r.institutional_category === selectedCategory
          );

  return (
    <div className="bg-[#F5F7FB] text-[#0F172A] min-h-screen flex flex-col">
      {/* ================= NAVBAR ================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logos/iqaa-logo.PNG"
              alt="IQAA"
              className="h-20 object-contain bg-white rounded-md p-1"
            />
            <div className="max-w-[320px]">
              <h1 className="font-bold text-lg text-[#0B2E6B]">IQAA RANKING</h1>
              <p className="text-xs opacity-80 tracking-wide ">Независимое агентство по обеспечению качества <br />в образовании - Рейтинг</p>

            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = url.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition ${isActive
                    ? "text-[#1E40AF]"
                    : "text-slate-600 hover:text-[#1E40AF]"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button className="text-sm text-slate-500 hover:text-[#1E40AF]">
              ENG
            </button>

            <Link
              href="/ranking"
              className="px-5 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-medium hover:bg-orange-600 transition"
            >
              Смотреть рейтинг
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden text-white">
        {/* BASE GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#005499] via-[#102E5E] to-[#005499]"></div>

        {/* SOFT GLOW */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-[#2563EB] opacity-20 blur-3xl rounded-full animate-pulseSlow"></div>
        <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-[#1E40AF] opacity-20 blur-3xl rounded-full animate-pulseSlow delay-[3000ms]"></div>

        {/* DATA GRID */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.2]">
          <div className="absolute inset-0 animate-gridMove bg-[linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>
        {/* FLOATING DOTS */}
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white rounded-full opacity-40 animate-float"></div>
        <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-white rounded-full opacity-30 animate-float delay-1000"></div>
        <KazakhstanMap />
        <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Национальный рейтинг вузов Казахстана 2026
            </h1>

            <p className="mt-4 text-blue-200 max-w-xl">
              Независимая оценка университетов на основе прозрачной методологии
              и международных стандартов.
            </p>

            <div className="mt-6 flex gap-4">

              <Link
                href="/ranking"
                className="px-6 py-3 rounded-xl bg-[#F97316] text-white"
              >
                Смотреть рейтинг
              </Link>

              <Link
                href="/methodology"
                className="px-6 py-3 rounded-xl border border-white/40"
              >
                Методология
              </Link>

            </div>
          </div>

          <div>
            <div className="animate-fadeUp delay-200">
              <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-100 transition duration-700 hover:-translate-y-2 hover:shadow-blue-900/40">

                <div className="text-sm text-slate-500 uppercase tracking-wide">
                  Международное признание
                </div>

                <div className="mt-8 flex items-center gap-6">

                  <img
                    src="/images/ireg-logo.png"
                    alt="IREG Observatory"
                    className="h-16 object-contain"
                  />

                  <div>
                    <div className="text-lg font-semibold">
                      Признано IREG Observatory
                    </div>

                    <div className="text-sm text-slate-500 mt-1">
                      Соответствие международным стандартам академических рейтингов
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-sm text-slate-600">
                  Методология рейтинга соответствует принципам прозрачности,
                  независимости и международной экспертизы.
                </div>

                <div className="mt-6">
                  <Link
                    href="/about/accreditation"
                    className="text-[#1E40AF] font-medium hover:underline"
                  >
                    Подробнее →
                  </Link>
                </div>

              </div>
            </div>
          </div>

        </div>

      </section>
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold mb-4">Лидеры рейтинга 2026</h2>
              <a class="text-[#1E40AF] font-medium hover:underline" href="/ranking">Полная таблица →</a>
            </div>

            {/* 🔘 ФИЛЬТР */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => {
    console.log("selected:", selectedCategory);
console.log("ratings:", ratings);
    setSelectedCategory(category);
}}
                        className={`px-4 py-2 rounded-full text-sm transition
                            ${
        selectedCategory === category
            ? `${categoryColors[category] || 'bg-gray-500'} text-white`
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
                    >
                        {category === "all" ? "Все" : category}
                    </button>
                ))}
            </div>

            {/* 🧩 КАРТОЧКИ */}
            <div className="grid md:grid-cols-3 gap-6">
                {filteredRatings.slice(0, 3).map(rating => (
                    <div
                        key={rating.id}
                        className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
                    >
                        <div className="relative">
                            <img
                                src={`/storage/images/universities/${rating.university.id}.jpg`}
                                className="w-full h-40 object-cover"
                            />

                            {/* 🏷 БЕЙДЖ */}
                            <div className={`absolute top-3 left-3 text-white px-3 py-1 rounded-lg text-sm font-bold ${getCategoryColor(rating.institutional_category)}`}>
                                #{rating.rank}
                            </div>
                        </div>

                        {/*<div className="p-4 text-center">
                            <div className="text-sm text-gray-500 uppercase">
                                {rating.institutional_category}
                            </div>

                            <div className="mt-2 font-medium text-gray-800">
                                {rating.university.current_name}
                            </div>

                            <div className="mt-2 text-xl font-bold text-blue-600">
                                {Number(rating.total_score).toFixed(2)}
                            </div>

                            <div className="text-xs text-gray-400">
                                итоговый балл
                            </div>
                        </div>*/}

                        <div className="p-4">
                <h3 className="font-semibold text-sm mb-3 min-h-[40px]">
                  {rating.university.current_name}
                </h3>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-blue-600 font-bold text-lg">{Number(rating.total_score).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Итоговый балл</p>
                  </div>
                  <div>
                    <p className="text-orange-500 font-bold text-lg">71.71</p>
                    <p className="text-xs text-gray-500">Показатель A</p>
                  </div>
                  <div>
                    <p className="text-blue-500 font-bold text-lg">28.32</p>
                    <p className="text-xs text-gray-500">Показатель B</p>
                  </div>
                </div>
              </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-6">

           

          <div className="flex justify-between items-center mb-14">
            <h2 className="text-3xl font-semibold">
              Лидеры рейтинга 2026
            </h2>

            <Link
              href="/ranking"
              className="text-[#1E40AF] font-medium hover:underline"
            >
              Полная таблица →
            </Link>
          </div>
          <div className="grid md:grid-cols-5 gap-6">            

            {ratings.map((rating) => (

              <div
                key={rating.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
             
                <div className="relative">
                    {/* Фото */}
                    <img
                        src={`/storage/images/universities/${rating.university.id}.jpg`}
                        className="w-full h-40 object-cover"
                    />

                    <div className={`absolute top-2 left-2 text-white text-xs px-3 py-1 rounded-full ${getCategoryColor(rating.institutional_category)}`}>
                        {rating.institutional_category}
                    </div>
                </div>

                <div className="p-6 text-center">

                  {/* категория 
                  <div className="text-xs uppercase tracking-wide text-orange-500 font-semibold">
                    {rating.institutional_category}
                  </div>*/}

                  {/* название */}
                  <div className="mt-2">
                    <h3 className="font-semibold text-sm mb-3 min-h-[40px]">
                      {rating.university.current_name}
                    </h3>                    
                  </div>

                  {/* балл */}
                  <div className="mt-4 text-xl font-semibold text-blue-600">
                    {Number(rating.total_score).toFixed(2)}
                  </div>

                  <div className="text-sm text-slate-500">
                    итоговый балл
                  </div>

                </div>

              </div>

            ))}

          </div>
        </div>
      </section>
      
      {/* ================= METHODOLOGY ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-semibold mb-14">
            Принципы методологии
          </h2>

          <div className="grid md:grid-cols-4 gap-10">

            {[
              "Объективность показателей",
              "Прозрачность расчётов",
              "Международные стандарты",
              "Многофакторный анализ"
            ].map((item, index) => (
              <div key={index} className="space-y-4">
                <div className="w-14 h-14 bg-[#1E40AF]/10 rounded-2xl" />
                <div className="font-semibold">
                  {item}
                </div>
                <div className="text-sm text-slate-500">
                  Методология основана на проверяемых данных.
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0B2E6B] text-blue-200 py-14 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">

          <div>
            <div className="text-white font-semibold">
              IQAA Ranking
            </div>
            <div className="text-sm mt-2">
              Национальный рейтинг вузов Республики Казахстан
            </div>
          </div>

          <div className="flex gap-8">
            <Link href="/about">О рейтинге</Link>
            <Link href="/methodology">Методология</Link>
            <Link href="/contact">Контакты</Link>
          </div>
        </div>
      </footer>


    </div>
  );
}