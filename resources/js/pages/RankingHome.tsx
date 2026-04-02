import React from "react";
import { Link, usePage } from "@inertiajs/react";
import SystemTrendChart from "@/components/charts/SystemTrendChart";
import KazakhstanMap from "@/components/background/KazakhstanMap";
import { useState } from 'react';
import MediaCoverage from "@/Components/media/media-coverage";
import Logo from "@/Components/header/logo/logo";

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
    { name: "О нас", href: "/ranking" },
    { name: "Рейтинг вузов", href: "/analytics" },
    { name: "Рейтинг ОП", href: "/methodology" },
    { name: "Новости", href: "/news" },
    { name: "Контакты", href: "/about" },
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


  const categories = [...new Set(ratings.map(r => r.institutional_category))];
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
          <Logo />

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
            
<div class="relative inline-block text-left group w-20">
  
  <button class="flex items-center justify-center gap-1 w-full text-sm text-slate-500 hover:text-[#1E40AF] py-1">
    <span>РУС</span>
    <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
  
  <div class="absolute left-0 hidden group-hover:block w-full bg-white border border-slate-100 rounded-md shadow-lg py-1 z-10 text-center">
    <a href="#" class="block px-2 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF]">ҚАЗ</a>
    <a href="#" class="block px-2 py-2 text-xs text-[#1E40AF] bg-slate-50 font-bold border-y border-slate-50">РУС</a>
    <a href="#" class="block px-2 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF]">ENG</a>
  </div>
</div>

            <Link
              href="/ranking"
              className="px-5 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-medium hover:bg-orange-600 transition"
            >
              Войти
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
      <section className="bg-white py-10 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-6 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-3xl font-semibold mb-4">Лидеры рейтинга 2026</h2>
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
                            ${selectedCategory === category
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

        </div>
      </section>

      {/* <section className="">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="">
            <MediaCoverage />
          </div>
        </div>
      </section> */}

      {/* Info Section */}
      
      {/* <section>
        <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">

          {/* Methodology */}
          {/* <div className="bg-white rounded-2xl shadow p-6">
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
          </div> */}

          {/* Certificate */}
          {/* <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-center">
            <div className="w-full h-40 rounded-lg flex items-center justify-center text-gray-400">
              <img
                src={`/images/kratkaya.png`}
                className="w-full object-cover"
              />
            </div>
          </div> */}

          {/* Partners */}
          {/* <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-blue-700 font-semibold mb-4">СМИ о рейтинге</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-center bg-slate-50 rounded-xl p-4 h-24">
                <img
                  src="/images/bilimdi_el.png"
                  className="max-h-12 object-contain"
                  alt="Bilim El"
                />
              </div>

              <div className="flex items-center justify-center rounded-xl p-4 h-24">
                <img
                  src="/images/kp.jpg"
                  className="max-h-12 object-contain"
                  alt="Казахстанская правда"
                />
              </div>
            </div>
          </div>
        </div>
      </section> */} 
      <section class="py-10">
  <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
    {/* Первый блок: Теперь лента новостей */}
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col h-[320px]"> 
      <h3 className="text-orange-500 font-semibold mb-4 flex justify-between items-center">
        Новости
        <span className="text-[10px] bg-orange-100 px-2 py-1 rounded text-orange-600 uppercase">Свежее</span>
      </h3>
      
      {/* Контейнер со списком новостей */}
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        <div className="border-l-2 border-orange-500 pl-3 py-1 hover:bg-orange-50 transition-colors cursor-pointer">
          <p className="text-[10px] text-gray-400">Сегодня, 12:40</p>
          <h4 className="text-sm font-medium leading-tight text-gray-800">Опубликованы новые критерии оценки региональных вузов</h4>
        </div>

        <div className="border-l-2 border-transparent pl-3 py-1 hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer">
          <p className="text-[10px] text-gray-400">Вчера</p>
          <h4 className="text-sm font-medium leading-tight text-gray-800">Старт ежегодного анкетного опроса студентов и выпускников</h4>
        </div>

        <div className="border-l-2 border-transparent pl-3 py-1 hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer">
          <p className="text-[10px] text-gray-400">28 мая</p>
          <h4 className="text-sm font-medium leading-tight text-gray-800">Завершился этап сбора данных от участников рейтинга</h4>
        </div>
      </div>

      <button className="mt-auto pt-4 text-orange-500 hover:text-orange-600 text-sm font-bold flex items-center">
        Все новости 
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 5l7 7-7 7"></path></svg>
      </button>
    </div>

    {/* Certificate (Оставляем без изменений) */}
    <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-center">
      <div className="w-full h-40 rounded-lg flex items-center justify-center text-gray-400">
        <img
          src={`/images/kratkaya.png`}
          className="w-full object-cover"
          alt="Краткая информация"
        />
      </div>
    </div>

    {/* Partners (Оставляем без изменений) */}
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-blue-700 font-semibold mb-4">СМИ о рейтинге</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-center bg-slate-50 rounded-xl p-4 h-24">
          <img
            src="/images/bilimdi_el.png"
            className="max-h-12 object-contain"
            alt="Bilim El"
          />
        </div>
        <div className="flex items-center justify-center rounded-xl p-4 h-24">
          <img
            src="/images/kp.jpg"
            className="max-h-12 object-contain"
            alt="Казахстанская правда"
          />
        </div>
      </div>
    </div>

  </div>
</section>
      {/* News */}
      {/* <section>
        <div className="max-w-7xl mx-auto px-4 py-8">
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
        </div>
      </section> */}







      {/* ================= METHODOLOGY ================= */}
      <section className="py-24 bg-white">
        
  <div className="">
  <div className="max-w-7xl mx-auto px-6 text-center">
    
    {/* Определение градиента (нужно добавить один раз в начале секции) */}
    <svg width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" /> {/* Темно-синий (ваш цвет) */}
          <stop offset="100%" stopColor="#60A5FA" /> {/* Светло-голубой для перехода */}
        </linearGradient>
      </defs>
    </svg>

    <h2 className="text-3xl font-semibold mb-20 text-slate-900">
      Принципы методологии
    </h2>

    <div className="grid md:grid-cols-4 gap-x-10 gap-y-16">
      
      {/* Элемент 1 - Объективность */}
      <div className="flex flex-col items-center group">
        <div className="w-[84px] h-[84px] bg-white border border-slate-100 rounded-full flex items-center justify-center mb-8 shadow-[0_10px_40px_rgba(30,64,175,0.03)] group-hover:border-blue-200 transition-all duration-300 group-hover:shadow-[0_15px_50px_rgba(30,64,175,0.06)] group-hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="url(#blueGradient)" className="w-9 h-9">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6.119c-.035.505-.05 1.014-.05 1.526 0 4.69 2.358 8.817 5.94 11.262l1.17.8 1.17-.8c3.582-2.445 5.94-6.572 5.94-11.262 0-.512-.015-1.02-.05-1.526z" />
          </svg>
        </div>
        <h4 className="font-semibold text-slate-900 mb-3 text-lg leading-snug">
          Объективность показателей
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
          Методология основана на проверяемых данных.
        </p>
      </div>

      {/* Элемент 2 - Прозрачность */}
      <div className="flex flex-col items-center group">
        <div className="w-[84px] h-[84px] bg-white border border-slate-100 rounded-full flex items-center justify-center mb-8 shadow-[0_10px_40px_rgba(30,64,175,0.03)] group-hover:border-blue-200 transition-all duration-300 group-hover:shadow-[0_15px_50px_rgba(30,64,175,0.06)] group-hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="url(#blueGradient)" className="w-9 h-9">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <h4 className="font-semibold text-slate-900 mb-3 text-lg leading-snug">
          Прозрачность расчётов
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
          Методология основана на проверяемых данных.
        </p>
      </div>

      {/* Элемент 3 - Международные стандарты */}
      <div className="flex flex-col items-center group">
        <div className="w-[84px] h-[84px] bg-white border border-slate-100 rounded-full flex items-center justify-center mb-8 shadow-[0_10px_40px_rgba(30,64,175,0.03)] group-hover:border-blue-200 transition-all duration-300 group-hover:shadow-[0_15px_50px_rgba(30,64,175,0.06)] group-hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="url(#blueGradient)" className="w-9 h-9">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
          </svg>
        </div>
        <h4 className="font-semibold text-slate-900 mb-3 text-lg leading-snug">
          Международные стандарты
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
          Методология основана на проверяемых данных.
        </p>
      </div>

      {/* Элемент 4 - Многофакторный анализ */}
      <div className="flex flex-col items-center group">
        <div className="w-[84px] h-[84px] bg-white border border-slate-100 rounded-full flex items-center justify-center mb-8 shadow-[0_10px_40px_rgba(30,64,175,0.03)] group-hover:border-blue-200 transition-all duration-300 group-hover:shadow-[0_15px_50px_rgba(30,64,175,0.06)] group-hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="url(#blueGradient)" className="w-9 h-9">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
          </svg>
        </div>
        <h4 className="font-semibold text-slate-900 mb-3 text-lg leading-snug">
          Многофакторный анализ
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
          Методология основана на проверяемых данных.
        </p>
      </div>

    </div>

  </div>
</div>
      </section>



      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0B2E6B] text-blue-200  ">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm opacity-90">
          © {new Date().getFullYear()} IQAA Ranking. Все права защищены.
        </div>
      </footer>


    </div>
  );
}