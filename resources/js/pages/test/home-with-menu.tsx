import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Home() {

  const { url } = usePage();

  const navLinks = [
    { name: "Рейтинг", href: "/ranking" },
    { name: "Аналитика", href: "/analytics" },
    { name: "Методология", href: "/methodology" },
    { name: "Новости", href: "/news" },
    { name: "О рейтинге", href: "/about" },
  ];

  const topUniversities = [
    { rank: 1, name: "КазНУ им. аль-Фараби", score: 92.4 },
    { rank: 2, name: "ЕНУ им. Л.Н. Гумилева", score: 89.7 },
    { rank: 3, name: "Satbayev University", score: 87.2 },
    { rank: 4, name: "КБТУ", score: 85.9 },
    { rank: 5, name: "КазНПУ им. Абая", score: 84.1 },
  ];

  return (
    <div className="bg-[#F5F7FB] text-[#0F172A] min-h-screen flex flex-col">

      {/* ================= NAVBAR ================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1E40AF] rounded-xl flex items-center justify-center text-white font-bold">
              IQ
            </div>
            <div>
              <div className="font-semibold text-[#0F172A]">
                IQAA Ranking
              </div>
              <div className="text-xs text-slate-500">
                Национальный рейтинг вузов
              </div>
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
                  className={`text-sm font-medium transition ${
                    isActive
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

          {/* Placeholder chart */}
          <div className="bg-white/10 rounded-3xl p-12 flex items-center justify-center text-blue-200">
            Интерактивная аналитика
          </div>
        </div>
      </section>

      {/* ================= TOP 5 ================= */}
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