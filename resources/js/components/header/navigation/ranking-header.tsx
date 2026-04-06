import { Link } from '@inertiajs/react';
import {
    Award,
    BookOpenText,
    ChevronRight,
    FileText,
    Globe,
    GraduationCap,
    Home,
    Menu,
    Trophy,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

type RankingPath =
    | '/'
    | '/ranking'
    | '/program-ranking'
    | '/program-ranking-v2'
    | '/publication-ranking'
    | '/website-ranking'
    | '/methodology'
    | '/ireg';

type RankingHeaderProps = {
    currentPath: RankingPath;
    className?: string;
    forceSolid?: boolean;
};

type NavItem = {
    href:
        | '/'
        | '/ranking'
        | '/program-ranking'
        | '/publication-ranking'
        | '/website-ranking'
        | '/methodology'
        | '/ireg';
    label: string;
    icon: typeof Home;
};

const navItems: NavItem[] = [
    {
        href: '/',
        label: '\u0413\u043b\u0430\u0432\u043d\u0430\u044f',
        icon: Home,
    },
    {
        href: '/ranking',
        label: '\u0420\u0435\u0439\u0442\u0438\u043d\u0433 \u0432\u0443\u0437\u043e\u0432',
        icon: Trophy,
    },
    {
        href: '/program-ranking',
        label: '\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u043d\u044b\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433',
        icon: GraduationCap,
    },
    {
        href: '/publication-ranking',
        label: '\u0420\u0435\u0439\u0442\u0438\u043d\u0433 \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0439',
        icon: FileText,
    },
    {
        href: '/website-ranking',
        label: '\u0420\u0435\u0439\u0442\u0438\u043d\u0433 \u0441\u0430\u0439\u0442\u043e\u0432',
        icon: Globe,
    },
    {
        href: '/methodology',
        label: '\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f',
        icon: BookOpenText,
    },
    { href: '/ireg', label: 'IREG', icon: Award },
];

const isItemActive = (currentPath: RankingPath, href: NavItem['href']) => {
    if (href === '/program-ranking') {
        return (
            currentPath === '/program-ranking' ||
            currentPath === '/program-ranking-v2'
        );
    }

    return currentPath === href;
};

export default function RankingHeader({
    currentPath,
    className,
    forceSolid = false,
}: RankingHeaderProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const solidMode = forceSolid || scrolled;

    const activeItem = useMemo(() => {
        return (
            navItems.find((item) => isItemActive(currentPath, item.href)) ??
            navItems[0]
        );
    }, [currentPath]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);

        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    return (
        <>
            <header
                className={cn(
                    'fixed inset-x-0 top-0 z-50 transition-all duration-500',
                    solidMode
                        ? 'bg-white py-3 shadow-lg shadow-black/5'
                        : 'bg-transparent py-5',
                    className,
                )}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            onClick={() => setMobileOpen(false)}
                            className="flex shrink-0 items-center gap-3"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                                <img
                                    src="/images/logos/logo.svg"
                                    alt="IQAA"
                                    className="h-6 w-auto object-contain brightness-0 invert"
                                />
                            </div>

                            <div className="hidden sm:block">
                                <h1
                                    className={cn(
                                        'text-sm font-bold tracking-wider uppercase transition-colors duration-500',
                                        solidMode
                                            ? 'text-slate-800'
                                            : 'text-white',
                                    )}
                                >
                                    IQAA Ranking
                                </h1>
                                <p
                                    className={cn(
                                        'max-w-[220px] text-[10px] leading-tight transition-colors duration-500',
                                        solidMode
                                            ? 'text-slate-400'
                                            : 'text-blue-300/60',
                                    )}
                                >
                                    {
                                        '\u041d\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0435 \u0430\u0433\u0435\u043d\u0442\u0441\u0442\u0432\u043e \u043f\u043e \u043e\u0431\u0435\u0441\u043f\u0435\u0447\u0435\u043d\u0438\u044e \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0430 \u0432 \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u0438'
                                    }
                                </p>
                            </div>
                        </Link>

                        <nav className="hidden items-center lg:flex">
                            <div
                                className={cn(
                                    'flex items-center gap-1 rounded-2xl px-2 py-1.5 transition-all duration-500',
                                    solidMode
                                        ? 'border border-slate-200/80 bg-slate-100'
                                        : 'glass',
                                )}
                            >
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isItemActive(
                                        currentPath,
                                        item.href,
                                    );

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium whitespace-nowrap transition-all duration-300',
                                                active
                                                    ? 'nav-item-active text-white'
                                                    : solidMode
                                                      ? 'text-slate-500 hover:bg-slate-200/60 hover:text-slate-800'
                                                      : 'nav-item-hover text-blue-100/70 hover:text-white',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'transition-transform duration-300',
                                                    active ? 'scale-110' : '',
                                                )}
                                            >
                                                <Icon size={16} />
                                            </span>
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setMobileOpen((value) => !value)}
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 lg:hidden',
                                    solidMode
                                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        : 'glass text-white hover:bg-white/10',
                                )}
                                aria-label={
                                    '\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e'
                                }
                            >
                                {mobileOpen ? (
                                    <X size={20} />
                                ) : (
                                    <Menu size={20} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div
                className={cn(
                    'fixed inset-0 z-40 transition-all duration-500 lg:hidden',
                    mobileOpen
                        ? 'pointer-events-auto opacity-100'
                        : 'pointer-events-none opacity-0',
                )}
            >
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />

                <div
                    className={cn(
                        'absolute top-0 right-0 h-full w-[300px] max-w-[85vw] bg-gradient-to-b from-[#0f172a] to-[#1e293b] shadow-2xl transition-transform duration-500 ease-out',
                        mobileOpen ? 'translate-x-0' : 'translate-x-full',
                    )}
                >
                    <div className="p-6 pt-20">
                        <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                                <img
                                    src="/images/logos/logo.svg"
                                    alt="IQAA"
                                    className="h-6 w-auto object-contain brightness-0 invert"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold tracking-wider text-white uppercase">
                                    IQAA Ranking
                                </h2>
                                <p className="text-[10px] text-blue-300/50">
                                    {
                                        '\u0420\u0435\u0439\u0442\u0438\u043d\u0433 \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f'
                                    }
                                </p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {navItems.map((item, index) => {
                                const Icon = item.icon;
                                const active = isItemActive(
                                    currentPath,
                                    item.href,
                                );

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-xl px-4 py-3.5 text-[14px] font-medium transition-all duration-300',
                                            active
                                                ? 'nav-item-active text-white'
                                                : 'text-blue-100/60 hover:bg-white/5 hover:text-white',
                                        )}
                                        style={{
                                            animationDelay: `${index * 50}ms`,
                                        }}
                                    >
                                        <Icon size={16} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-8 border-t border-white/10 pt-6">
                            <Link
                                href={activeItem.href}
                                onClick={() => setMobileOpen(false)}
                                className="btn-orange flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white"
                            >
                                {activeItem.label}
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
