import { useState, useEffect } from "react";
import {
  Home,
  GraduationCap,
  Layers,
  Globe,
  BookOpen,
  Award,
  Menu,
  X,
  ChevronRight,
  PenTool,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: "Главная", icon: <Home size={16} />, href: "#" },
  { label: "Рейтинг вузов", icon: <GraduationCap size={16} />, href: "#" },
  {
    label: "Программный рейтинг",
    icon: <Layers size={16} />,
    href: "#",
    active: true,
  },
  { label: "Рейтинг сайтов", icon: <Globe size={16} />, href: "#" },
  { label: "Методология", icon: <BookOpen size={16} />, href: "#" },
  { label: "IREG", icon: <Award size={16} />, href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-nav shadow-2xl shadow-black/20 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <PenTool size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-white tracking-wider uppercase">
                  IQAA Ranking
                </h1>
                <p className="text-[10px] text-blue-300/60 leading-tight max-w-[200px]">
                  Независимое агентство по обеспечению качества в образовании
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center gap-1 glass rounded-2xl px-2 py-1.5">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 whitespace-nowrap ${
                      item.active
                        ? "nav-item-active text-white"
                        : "text-blue-100/70 nav-item-hover hover:text-white"
                    }`}
                  >
                    <span
                      className={`transition-transform duration-300 ${
                        item.active ? "scale-110" : "group-hover:scale-110"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>

            {/* Right side: CTA + Mobile burger */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="hidden md:flex items-center gap-1.5 text-[12px] font-semibold text-orange-400 hover:text-orange-300 transition-colors duration-300 uppercase tracking-wider"
              >
                Все страницы рейтинга
                <ChevronRight size={14} />
              </a>

              {/* Mobile burger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-[300px] max-w-[85vw] bg-gradient-to-b from-[#0f172a] to-[#1e293b] shadow-2xl transition-transform duration-500 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 pt-20">
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <PenTool size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wider uppercase">
                  IQAA Ranking
                </h2>
                <p className="text-[10px] text-blue-300/50">
                  Рейтинг образования
                </p>
              </div>
            </div>

            {/* Mobile Nav Items */}
            <nav className="space-y-1">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-300 ${
                    item.active
                      ? "nav-item-active text-white"
                      : "text-blue-100/60 hover:text-white hover:bg-white/5"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Mobile CTA */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href="#"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl btn-orange text-white text-sm font-semibold"
              >
                Все страницы рейтинга
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}