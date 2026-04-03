// resources/js/Pages/University/Show.jsx

import React from "react";
import { Link } from "@inertiajs/react";

export default function University() {

  const university = {
    name: "Казахский национальный университет им. аль-Фараби",
    city: "Алматы",
    type: "Национальный университет",
    rank: 1,
    score: 92.4,
    trend: +2,
  };

  const stats = [
    { label: "Студенты", value: "21 340" },
    { label: "Преподаватели", value: "1 820" },
    { label: "Год основания", value: "1934" },
    { label: "Международные программы", value: "78" },
  ];

  const indicators = [
    { name: "Академическая репутация", value: 95 },
    { name: "Публикации", value: 89 },
    { name: "Международность", value: 84 },
    { name: "Трудоустройство", value: 91 },
    { name: "Кадровый потенциал", value: 88 },
  ];

  return (
    <div className="bg-[#F5F7FB] text-[#0F172A]">

      {/* HERO */}
      <section className="bg-[#0B2E6B] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row justify-between gap-10">

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/10 rounded-2xl" />

            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {university.name}
              </h1>

              <p className="text-blue-200 mt-2">
                {university.city} · {university.type}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-blue-200">
              Место в национальном рейтинге
            </div>

            <div className="text-6xl font-bold text-[#F97316] mt-2">
              {university.rank}
            </div>

            <div className="text-xl font-semibold mt-2">
              {university.score} балла
            </div>

            <div className="mt-2 text-green-400 font-medium">
              +{university.trend} позиции
            </div>

            <div className="mt-6">
              <Link
                href="/compare"
                className="px-6 py-3 rounded-2xl bg-[#F97316] text-white font-medium hover:bg-orange-600 transition"
              >
                Сравнить с другим вузом
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK STATS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6">

          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100"
            >
              <div className="text-sm text-[#64748B]">
                {stat.label}
              </div>
              <div className="text-2xl font-bold mt-3 text-[#1E40AF]">
                {stat.value}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* SCORE STRUCTURE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-semibold mb-12">
            Структура итогового балла
          </h2>

          <div className="space-y-8">
            {indicators.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">
                    {item.name}
                  </span>
                  <span className="text-[#1E40AF] font-semibold">
                    {item.value}
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-[#1E40AF]"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* TREND */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-semibold mb-10">
            Динамика позиции за 5 лет
          </h2>

          <div className="bg-white rounded-3xl shadow-sm p-12 flex items-center justify-center text-slate-400">
            Здесь будет график динамики (Recharts)
          </div>

        </div>
      </section>

      {/* PUBLICATIONS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-semibold mb-12">
            Научная активность
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-[#F5F7FB] rounded-3xl p-8">
              <div className="text-sm text-[#64748B]">
                Публикации (Scopus)
              </div>
              <div className="text-3xl font-bold text-[#1E40AF] mt-4">
                4 382
              </div>
            </div>

            <div className="bg-[#F5F7FB] rounded-3xl p-8">
              <div className="text-sm text-[#64748B]">
                Цитируемость
              </div>
              <div className="text-3xl font-bold text-[#1E40AF] mt-4">
                18 920
              </div>
            </div>

            <div className="bg-[#F5F7FB] rounded-3xl p-8">
              <div className="text-sm text-[#64748B]">
                H-index
              </div>
              <div className="text-3xl font-bold text-[#1E40AF] mt-4">
                64
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B2E6B] text-blue-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between flex-col md:flex-row gap-6">

          <div>
            © 2026 IQAA Ranking
          </div>

          <div className="flex gap-6">
            <Link href="/about">О рейтинге</Link>
            <Link href="/methodology">Методология</Link>
            <Link href="/contact">Контакты</Link>
          </div>

        </div>
      </footer>

    </div>
  );
}