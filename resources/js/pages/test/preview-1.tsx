// resources/js/Pages/Home.jsx

import React from "react";
import { Link } from "@inertiajs/react";

export default function Home() {

  const topUniversities = [
    { rank: 1, name: "КазНУ им. аль-Фараби", score: 92.4 },
    { rank: 2, name: "ЕНУ им. Л.Н. Гумилева", score: 89.7 },
    { rank: 3, name: "Satbayev University", score: 87.2 },
    { rank: 4, name: "КБТУ", score: 85.9 },
    { rank: 5, name: "КазНПУ им. Абая", score: 84.1 },
  ];

  return (
    <div className="bg-[#F5F7FB] text-[#0F172A]">

      {/* HERO */}
      <section className="bg-[#0B2E6B] text-white">
        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h1 className="text-5xl font-bold tracking-tight leading-tight">
              Национальный рейтинг вузов Республики Казахстан 2026
            </h1>

            <p className="mt-6 text-blue-200 text-lg">
              Независимая аналитическая оценка университетов
              на основе прозрачной методологии и международных стандартов.
            </p>

            <div className="mt-10 flex gap-6">
              <Link
                href="/ranking"
                className="px-8 py-4 rounded-2xl bg-[#F97316] text-white font-medium hover:bg-orange-600 transition"
              >
                Смотреть рейтинг
              </Link>

              <Link
                href="/methodology"
                className="px-8 py-4 rounded-2xl border border-white/40 hover:bg-white/10 transition"
              >
                Методология
              </Link>
            </div>
          </div>

          {/* Placeholder графика */}
          <div className="bg-white/10 rounded-3xl p-12 flex items-center justify-center">
            <div className="text-blue-200">
              Здесь будет интерактивный график рейтинга
            </div>
          </div>

        </div>
      </section>

      {/* TOP 5 */}
      <section className="py-24">
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

            {topUniversities.map((uni) => (
              <div
                key={uni.rank}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition"
              >
                <div className="text-4xl font-bold text-[#F97316]">
                  {uni.rank}
                </div>

                <div className="mt-4 font-medium text-sm text-slate-700">
                  {uni.name}
                </div>

                <div className="mt-6 text-xl font-semibold text-[#1E40AF]">
                  {uni.score}
                </div>

                <div className="text-sm text-slate-500">
                  итоговый балл
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* METHODOLOGY PREVIEW */}
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
                  Методология основана на проверяемых и количественных данных.
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* ANALYTICS PREVIEW */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <div>
            <h2 className="text-3xl font-semibold mb-6">
              Интерактивная аналитика
            </h2>

            <p className="text-slate-600 mb-8">
              Сравнение вузов, динамика показателей,
              публикационная активность и отраслевые данные.
            </p>

            <Link
              href="/analytics"
              className="px-6 py-3 rounded-2xl bg-[#1E40AF] text-white font-medium hover:bg-blue-900 transition"
            >
              Перейти к аналитике
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-12 text-slate-400 flex items-center justify-center">
            Здесь будет диаграмма
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B2E6B] text-blue-200 py-14">
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