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

            <p className="mt-10 text-blue-200 max-w-xl">
              IQAA-Ranking объявляет о начале ежегодного ранжирования. Приглашаем высшие учебные заведения страны принять участие в формировании национального рейтинга.
            </p>

            <div className="mt-10 flex gap-4">

              

              <Link
                href="/methodology"
                className="px-6 py-3 rounded-xl bg-[#F97316] text-white"
              >
                Подробнее
              </Link>

            </div>
          </div>

    {/* ПРАВАЯ КОЛОНКА: БЕЛАЯ КАРТОЧКА */}
    <div className="bg-white rounded-[48px] p-8 md:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.4)] border border-white/20 relative overflow-hidden group">
      
      <div className="flex flex-col gap-4 relative z-10">
        
        {/* ШАПКА КАРТОЧКИ: Текст и Сертификат */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex-1 space-y-4">
            <h3 className=" text-xl font-bold text-slate-800 mb-4 leading-tight">
              Независимая оценка и международное признание
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              IQAA-Ranking - соучредитель и полноправный член обсерватории <span className="text-[#1E40AF] font-bold underline decoration-blue-100 decoration-4 underline-offset-4">IREG</span>. Наша методология признана мировым сообществом.
            </p>
          </div>

          
          
        </div>

        {/* СПИСОК ПРЕИМУЩЕСТВ: Горизонтальная или компактная сетка */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex-1 space-y-4">
            <ul className="space-y-5">
  {[
    "Методология одобрена экспертами IREG",
    "Ежегодный аудит качества с 2008 года",
    "Прозрачные и независимые данные"
  ].map((text, i) => (
    <li key={i} className="flex items-center gap-4 group/item">
      {/* Стеклянная иконка */}
      <div className="relative flex-shrink-0 w-7 h-7 flex items-center justify-center">
        {/* Задний слой: эффект стекла */}
        <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px] rounded-lg border border-blue-200/50 shadow-sm transition-all group-hover/item:bg-orange-500/10 group-hover/item:border-orange-200/50"></div>
        
        {/* Внутреннее свечение (Glow) */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity bg-gradient-to-br from-orange-400/20 to-transparent"></div>

        {/* Сама галочка */}
        <svg 
          className="w-4 h-4 text-[#1E40AF] relative z-10 transition-colors group-hover/item:text-[#F97316]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="3" 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </div>

      {/* Текст буллита */}
      <span className="text-[13px] text-slate-700 font-bold leading-tight transition-colors group-hover/item:text-slate-900">
        {text}
      </span>
    </li>
  ))}
</ul>
          </div>

          {/* СЕРТИФИКАТ: Уменьшили и сделали аккуратнее */}
          <div 
            onClick={() => {/* Ваша логика Modal */}}
            className="w-full md:w-32 lg:w-40 flex-shrink-0 group/cert cursor-zoom-in"
          >
            <div className="relative p-1 bg-white rounded-xl shadow-md border border-slate-100 transform transition-transform group-hover/cert:scale-105 group-hover/cert:rotate-2">
              <img 
                src="\storage\images\ireg-certificate.png" 
                alt="IREG Certificate"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/cert:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            
          </div>
        </div>

        {/* НИЖНЯЯ ССЫЛКА */}
        <Link 
          href="/methodology" 
          className="inline-flex items-center justify-center py-3 px-6 rounded-xl bg-slate-50 text-[#1E40AF] font-bold text-sm hover:bg-blue-50 transition-all group w-full md:w-auto self-start"
        >
          Методология IQAA
          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* ФОНОВЫЙ ДЕКОР */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl group-hover:bg-blue-100/50 transition-colors"></div>
    </div>
  </div>
</section>
     

<section className="bg-white py-16">
  <div className="max-w-7xl mx-auto px-6">
    
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Лидеры рейтинга 2026</h2>
      <a className="text-[#1E40AF] text-sm font-bold hover:underline transition-all" href="/ranking">
        Весь рейтинг →
      </a>
    </div>

    {/* 🔘 ФИЛЬТР — Капсулы */}
    
<div className="flex w-full gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
  {categories.map((category) => {
    const isActive = selectedCategory === category;
    
    return (
      <button
        key={category}
        onClick={() => setSelectedCategory(category)}
        className={`
          flex-1 px-5 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 
          border leading-tight whitespace-nowrap min-w-max
          ${isActive 
            ? `bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] text-white border-blue-400/30 
                ring-1 ring-white/10` 
            : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
          }
        `}
      >
        <span className={isActive ? "drop-shadow-md" : ""}>
          {category === "all" ? "Все направления" : category}
        </span>
      </button>
    );
  })}
</div>
    {/* 🧩 КАРТОЧКИ */}
    <div className="grid md:grid-cols-3 gap-6">
      {filteredRatings.slice(0, 3).map((rating, index) => (
        <div
          key={rating.id}
          className="group bg-white rounded-[32px] border border-slate-200 hover:border-[#1E40AF]/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden flex flex-col"
        >
          {/* Фото и Индикатор места */}
          <div className="relative h-48 overflow-hidden border-b border-slate-100">
            <img
              src={`/storage/images/universities/${rating.university.id}.jpg`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Университет"
            />
            
            {/* ОРАНЖЕВЫЙ ИНДИКАТОР ДЛЯ №1 */}
            <div className={`absolute top-4 left-4 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border backdrop-blur-sm transition-transform group-hover:scale-110
              ${index === 0 
                ? 'bg-orange-500 border-orange-400' 
                : 'bg-white border-white/50'
              }`}>
              
              <span className={`font-black text-2xl 
                ${index === 0 
                  ? 'text-white' 
                  : 'text-[#1E40AF]'
                }`}>
                {index + 1}
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start gap-4">
              {/* Название вуза */}
              <h3 className="font-bold text-[17px] text-slate-800 leading-tight group-hover:text-[#1E40AF] transition-colors flex-grow min-h-[44px]">
                {rating.university.current_name}
              </h3>
              
              {/* Итоговый балл */}
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] uppercase tracking-wider font-black text-slate-400 mb-1">Итоговый балл</p>
                <p className="text-2xl font-black text-[#1E40AF] leading-none">
                  {Number(rating.total_score).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
<section className="py-20 bg-slate-50/50">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 items-stretch">
    
    {/* Блок 1: Новости */}
    <div className="bg-white rounded-3xl shadow-sm p-7 flex flex-col border border-slate-100 hover:shadow-md transition-all duration-300"> 
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-orange-500 font-bold text-xl">Новости</h3>
        <span className="text-[10px] bg-orange-100 px-2.5 py-1 rounded-lg text-orange-600 uppercase font-black tracking-wider">Свежее</span>
      </div>
      
      <div className="space-y-5 flex-grow">
        {[
          { date: "Сегодня, 12:40", title: "Опубликованы новые критерии оценки региональных вузов" },
          { date: "Вчера", title: "Старт ежегодного анкетного опроса студентов и выпускников" },
          { date: "28 мая", title: "Завершился этап сбора данных от участников рейтинга" }
        ].map((item, i) => (
          <div key={i} className="group cursor-pointer border-l-2 border-transparent hover:border-orange-500 pl-3 transition-all">
            <p className="text-[11px] text-slate-400 font-medium mb-1">{item.date}</p>
            <h4 className="text-[14px] font-bold leading-snug text-slate-800 group-hover:text-orange-600 transition-colors">
              {item.title}
            </h4>
          </div>
        ))}
      </div>

      <button className="mt-8 pt-4 border-t border-slate-50 text-orange-500 hover:text-orange-600 text-sm font-black flex items-center group transition-all">
        Все новости 
        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>

    {/* Блок 2: Сертификат IREG (ОБНОВЛЕННЫЙ) */}
    <div className="bg-white rounded-3xl shadow-sm p-7 flex flex-col border border-slate-100 hover:shadow-md transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-slate-900 font-bold text-xl">Признание IREG</h3>
        
      </div>

      {/* Контейнер с mix-blend-multiply убирает серый фон картинки */}
      <div className="flex-grow flex items-center justify-center bg-white rounded-2xl overflow-hidden group p-4 border border-slate-50 shadow-inner">
        <img
          src="/images/ireg-member.png"
          className="w-auto max-h-52 h-full object-contain transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
          alt="Сертификат IREG"
        />
      </div>

      
    </div>

    {/* Блок 3: СМИ (ОБНОВЛЕННЫЙ) */}
    <div className="bg-white rounded-3xl shadow-sm p-7 border border-slate-100 flex flex-col hover:shadow-md transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-slate-900 font-bold text-xl">СМИ о рейтинге</h3>
        
      </div>

      <div className="grid grid-cols-1 gap-3 flex-grow">
        {[
          { src: "/images/bilimdi_el.png", alt: "Bilim El" },
          { src: "/images/kp.jpg", alt: "КП" },
          { src: "/images/egemen.png", alt: "Egemen" }
        ].map((logo, i) => (
          <div key={i} className="flex items-center justify-center bg-slate-50 rounded-2xl px-6 py-4 h-16 border border-transparent hover:border-blue-100 hover:bg-white transition-all cursor-pointer group">
            <img 
              src={logo.src} 
              className="max-h-8 w-auto object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
              alt={logo.alt} 
            />
          </div>
        ))}
      </div>
      
      
    </div>

  </div>
</section>{/* ================= METHODOLOGY ================= */}
      <section className="py-20 bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">
    
    {/* Определение градиентов */}
    <svg width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        {/* Добавляем оранжевый градиент для ховера */}
        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>
      </defs>
    </svg>

    <div className="mb-20 text-left">
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
        Принципы методологии
      </h2>
      
    </div>

    <div className="grid md:grid-cols-4 gap-x-12 gap-y-16">
      
      {[
        {
          title: "Объективность показателей",
          desc: "Методология базируется исключительно на верифицируемых фактах.",
          path: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6.119c-.035.505-.05 1.014-.05 1.526 0 4.69 2.358 8.817 5.94 11.262l1.17.8 1.17-.8c3.582-2.445 5.94-6.572 5.94-11.262 0-.512-.015-1.02-.05-1.526z"
        },
        {
          title: "Прозрачность расчётов",
          desc: "Открытый доступ к математическим моделям и весам показателей.",
          path: "M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M12 15a3 3 0 100-6 3 3 0 000 6z"
        },
        {
          title: "Международные стандарты",
          desc: "Соответствие принципам Берлинской обсерватории (IREG).",
          path: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582"
        },
        {
          title: "Многофакторный анализ",
          desc: "Учет академической репутации, цитируемости и успеха выпускников.",
          path: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"
        }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center text-center group cursor-default">
          {/* Контейнер иконки */}
          <div className="relative mb-8">
            {/* Мягкое свечение на фоне при ховере */}
            <div className="absolute inset-0 bg-orange-100 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
            
            <div className="relative w-[88px] h-[88px] bg-white border border-slate-100 rounded-[24px] flex items-center justify-center shadow-[0_10px_40px_rgba(30,64,175,0.04)] 
                            transition-all duration-500 ease-out 
                            group-hover:-translate-y-3 group-hover:border-orange-200 group-hover:shadow-[0_20px_60px_rgba(249,115,22,0.15)] group-hover:rotate-3">
              
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                className="w-10 h-10 transition-all duration-500"
                style={{ stroke: 'url(#blueGradient)' }}
              >
                {/* CSS Inline style для динамической смены градиента через класс group-hover */}
                <style>{`.group:hover .icon-path-${i} { stroke: url(#orangeGradient); }`}</style>
                <path 
                  className={`icon-path-${i} transition-all duration-500`}
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d={item.path} 
                />
              </svg>
            </div>
          </div>

          <h4 className="font-bold text-slate-900 mb-3 text-lg leading-snug transition-colors duration-300 group-hover:text-[#F97316]">
            {item.title}
          </h4>
          <p className="text-sm text-slate-500 leading-relaxed max-w-[240px] transition-colors duration-300 group-hover:text-slate-600">
            {item.desc}
          </p>
        </div>
      ))}

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