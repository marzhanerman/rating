import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowUpRight,
    BookOpenText,
    Building2,
    ChevronRight,
    Cpu,
    FileText,
    GraduationCap,
    Layers3,
    LayoutGrid,
    MapPin,
    Palette,
    Scale,
    Search,
    Sparkles,
    Stethoscope,
    Trophy,
    Waypoints,
    type LucideIcon,
} from 'lucide-react';
import { useDeferredValue, useMemo, useState } from 'react';

import RankingHero, {
    RankingHeroPanel,
    RankingHeroStat,
} from '@/components/hero/ranking-hero';

type Criterion = {
    number: string | null;
    title: string;
    points: number | null;
};

type RankingRow = {
    id: number;
    place: number;
    universityName: string;
    city?: string | null;
    universityId?: number | null;
    total: number | null;
};

type RankingCategory = {
    key: string;
    label: string;
    themeKey: string;
    entryCount: number;
    topScore: number | null;
    rows: RankingRow[];
};

type Methodology = {
    title: string;
    criteria: Criterion[];
} | null;

type SelectedRating = {
    year: number;
    title: string;
    entryCount: number;
    categoryCount: number;
    topScore: number | null;
    categories: RankingCategory[];
    methodology: Methodology;
} | null;

type YearOption = {
    year: number;
    entryCount: number;
    categoryCount: number;
    topScore: number | null;
    hasMethodology: boolean;
    criteriaCount: number;
};

type Props = {
    selectedYear: number;
    selectedRating?: SelectedRating;
    yearOptions?: YearOption[];
};

type CategoryMeta = {
    icon: LucideIcon;
    chipClassName: string;
    ringClassName: string;
    shadowClassName: string;
    surface: string;
};

const EMPTY_CATEGORIES: RankingCategory[] = [];
const EMPTY_CRITERIA: Criterion[] = [];

const categoryMetaMap: Record<string, CategoryMeta> = {
    multi: {
        icon: Layers3,
        chipClassName: 'bg-blue-50 text-blue-700 ring-blue-200',
        ringClassName: 'ring-blue-200/80',
        shadowClassName: 'shadow-blue-200/70',
        surface:
            'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 45%, #0f172a 100%)',
    },
    technical: {
        icon: Cpu,
        chipClassName: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
        ringClassName: 'ring-cyan-200/80',
        shadowClassName: 'shadow-cyan-200/70',
        surface:
            'linear-gradient(135deg, #0f766e 0%, #0891b2 48%, #164e63 100%)',
    },
    humanitarian: {
        icon: Scale,
        chipClassName: 'bg-amber-50 text-amber-700 ring-amber-200',
        ringClassName: 'ring-amber-200/80',
        shadowClassName: 'shadow-amber-200/70',
        surface:
            'linear-gradient(135deg, #b45309 0%, #f59e0b 48%, #7c2d12 100%)',
    },
    pedagogical: {
        icon: GraduationCap,
        chipClassName: 'bg-sky-50 text-sky-700 ring-sky-200',
        ringClassName: 'ring-sky-200/80',
        shadowClassName: 'shadow-sky-200/70',
        surface:
            'linear-gradient(135deg, #0f766e 0%, #38bdf8 50%, #1e3a8a 100%)',
    },
    medical: {
        icon: Stethoscope,
        chipClassName: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        ringClassName: 'ring-emerald-200/80',
        shadowClassName: 'shadow-emerald-200/70',
        surface:
            'linear-gradient(135deg, #047857 0%, #10b981 45%, #064e3b 100%)',
    },
    creative: {
        icon: Palette,
        chipClassName: 'bg-rose-50 text-rose-700 ring-rose-200',
        ringClassName: 'ring-rose-200/80',
        shadowClassName: 'shadow-rose-200/70',
        surface:
            'linear-gradient(135deg, #be185d 0%, #fb7185 48%, #7c2d12 100%)',
    },
    overall: {
        icon: LayoutGrid,
        chipClassName: 'bg-slate-100 text-slate-700 ring-slate-200',
        ringClassName: 'ring-slate-200/80',
        shadowClassName: 'shadow-slate-200/70',
        surface:
            'linear-gradient(135deg, #334155 0%, #475569 48%, #0f172a 100%)',
    },
};

const featuredThemes = [
    'from-amber-300 via-orange-400 to-pink-400',
    'from-cyan-300 via-sky-400 to-blue-400',
    'from-violet-300 via-fuchsia-400 to-rose-400',
] as const;

const getCategoryMeta = (themeKey: string) =>
    categoryMetaMap[themeKey] ?? categoryMetaMap.overall;

const formatScore = (value: number | null) =>
    value === null ? 'н/д' : value.toFixed(2);

const getUniversityImage = (universityId?: number | null) =>
    universityId ? `/storage/images/universities/${universityId}.jpg` : '';

const getUniversityProfileHref = (universityId?: number | null) =>
    universityId ? `/ranking/university/${universityId}` : undefined;

const compareRows = (left: RankingRow, right: RankingRow) => {
    if (left.place !== right.place) return left.place - right.place;

    return left.universityName.localeCompare(right.universityName, 'ru-RU');
};

export default function PublicationRankingPage({
    selectedYear,
    selectedRating = null,
    yearOptions = [],
}: Props) {
    const categories = selectedRating?.categories ?? EMPTY_CATEGORIES;
    const methodology = selectedRating?.methodology ?? null;
    const criteria = methodology?.criteria ?? EMPTY_CRITERIA;

    const [selectedCategoryKey, setSelectedCategoryKey] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const deferredQuery = useDeferredValue(
        searchQuery.trim().toLocaleLowerCase('ru-RU'),
    );

    const selectedYearMeta = useMemo(
        () =>
            yearOptions.find((option) => option.year === selectedYear) ?? null,
        [selectedYear, yearOptions],
    );

    const resolvedCategoryKey = useMemo(() => {
        if (
            selectedCategoryKey &&
            categories.some((category) => category.key === selectedCategoryKey)
        ) {
            return selectedCategoryKey;
        }

        return categories[0]?.key ?? '';
    }, [categories, selectedCategoryKey]);

    const activeCategory = useMemo(
        () =>
            categories.find(
                (category) => category.key === resolvedCategoryKey,
            ) ??
            categories[0] ??
            null,
        [categories, resolvedCategoryKey],
    );

    const visibleRows = useMemo(() => {
        const baseRows = [...(activeCategory?.rows ?? [])].sort(compareRows);

        if (!deferredQuery) {
            return baseRows;
        }

        return baseRows.filter((row) =>
            [row.universityName, row.city ?? '']
                .join(' ')
                .toLocaleLowerCase('ru-RU')
                .includes(deferredQuery),
        );
    }, [activeCategory, deferredQuery]);

    const categoryCards = useMemo(
        () =>
            categories.map((category) => ({
                ...category,
                leader: [...category.rows].sort(compareRows)[0] ?? null,
                meta: getCategoryMeta(category.themeKey),
            })),
        [categories],
    );

    const leaders = visibleRows.slice(0, 3);
    const bestVisibleScore = useMemo(() => {
        const scores = visibleRows
            .map((row) => row.total)
            .filter((value): value is number => value !== null);

        return scores.length > 0 ? Math.max(...scores) : null;
    }, [visibleRows]);

    const totalMethodologyPoints = useMemo(
        () =>
            criteria.reduce(
                (sum, criterion) => sum + (criterion.points ?? 0),
                0,
            ),
        [criteria],
    );

    const archiveRange =
        yearOptions.length > 0
            ? `${yearOptions[yearOptions.length - 1]?.year}-${yearOptions[0]?.year}`
            : `${selectedYear}`;

    const activeCategoryMeta = getCategoryMeta(
        activeCategory?.themeKey ?? 'overall',
    );
    const ActiveCategoryIcon = activeCategoryMeta.icon;
    const hasCities = visibleRows.some((row) => Boolean(row.city));
    const hasMultipleCategories = categories.length > 1;
    const visibleShare = activeCategory?.entryCount
        ? Math.round((visibleRows.length / activeCategory.entryCount) * 100)
        : 0;

    return (
        <>
            <Head title={`Рейтинг публикаций - ${selectedYear}`} />

            <div className="min-h-screen bg-[#0a1530]">
                <RankingHero
                    currentPath="/publication-ranking"
                    badge={
                        <>
                            <FileText className="h-4 w-4 text-blue-300" />
                            Архив рейтинга публикаций {archiveRange}
                        </>
                    }
                    title="Рейтинг вузов по научным публикациям"
                    description="Новая вкладка собирает выпуски рейтинга научных публикаций в одном экране: год публикации, профиль выпуска, лидеры, методология и полная таблица результатов."
                    actions={
                        <>
                            <a
                                href="#publication-controls"
                                className="btn-orange inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
                            >
                                Открыть навигатор
                                <ChevronRight className="h-4 w-4" />
                            </a>
                            <a
                                href="#publication-table"
                                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
                            >
                                Смотреть таблицу
                            </a>
                        </>
                    }
                    aside={
                        <div className="space-y-4 lg:ml-auto lg:max-w-md">
                            <div className="grid grid-cols-2 gap-3">
                                <RankingHeroStat
                                    label="Год"
                                    value={selectedYear}
                                    valueClassName="text-3xl"
                                />
                                <RankingHeroStat
                                    label="Записей"
                                    value={selectedRating?.entryCount ?? 0}
                                    valueClassName="text-3xl"
                                />
                                <RankingHeroStat
                                    label="Категорий"
                                    value={selectedRating?.categoryCount ?? 0}
                                    valueClassName="text-3xl"
                                />
                                <RankingHeroStat
                                    label="Критериев"
                                    value={criteria.length}
                                    valueClassName="text-3xl"
                                />
                            </div>

                            <RankingHeroPanel className="rounded-[1.75rem] p-5">
                                <div className="text-[11px] font-semibold tracking-[0.16em] text-blue-300/70 uppercase">
                                    Лучший балл выпуска
                                </div>
                                <div className="mt-3 text-3xl font-semibold text-white">
                                    {formatScore(
                                        selectedRating?.topScore ?? null,
                                    )}
                                </div>
                                <p className="mt-3 text-sm leading-6 text-blue-100/65">
                                    {selectedYearMeta?.hasMethodology
                                        ? 'Для выбранного года доступна методология с критериями оценки публикационной активности.'
                                        : 'Для выбранного года сохранена таблица результатов, но методология в архиве не найдена.'}
                                </p>
                            </RankingHeroPanel>
                        </div>
                    }
                />

                <div className="relative overflow-hidden bg-white">
                    <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
                        <div className="absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-[100px]" />
                        <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-indigo-100/40 blur-[80px]" />
                    </div>

                    <main className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                        <section
                            id="publication-controls"
                            className="rounded-[2rem] border border-gray-200/60 bg-white p-6 shadow-xl shadow-gray-200/50"
                        >
                            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                                <div>
                                    <div className="text-sm font-medium tracking-[0.24em] text-blue-700 uppercase">
                                        Навигатор архива
                                    </div>
                                    <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">
                                        Год, категория и публикационный лидер на
                                        одном экране
                                    </h2>
                                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                                        Логика страницы повторяет визуальный
                                        подход `v2`: сначала выбираем выпуск,
                                        затем профиль рейтинга, после чего сразу
                                        видим методологию, лидеров и полную
                                        таблицу результатов.
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3 xl:w-[420px]">
                                    <div className="rounded-[1.5rem] bg-slate-50 p-4">
                                        <div className="text-xs tracking-[0.22em] text-slate-500 uppercase">
                                            Диапазон архива
                                        </div>
                                        <div className="mt-2 text-lg font-semibold text-slate-950">
                                            {archiveRange}
                                        </div>
                                    </div>

                                    <div className="rounded-[1.5rem] bg-slate-50 p-4">
                                        <div className="text-xs tracking-[0.22em] text-slate-500 uppercase">
                                            Лучший балл
                                        </div>
                                        <div className="mt-2 text-lg font-semibold text-slate-950">
                                            {formatScore(
                                                selectedRating?.topScore ??
                                                    null,
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-[1.5rem] bg-slate-50 p-4">
                                        <div className="text-xs tracking-[0.22em] text-slate-500 uppercase">
                                            Методология
                                        </div>
                                        <div className="mt-2 text-lg font-semibold text-slate-950">
                                            {selectedYearMeta?.hasMethodology
                                                ? `${selectedYearMeta.criteriaCount} критериев`
                                                : 'Архив без методики'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                                <div className="space-y-6">
                                    <div>
                                        <div className="mb-3 text-sm font-medium text-slate-700">
                                            Год публикации
                                        </div>
                                        <div className="flex flex-wrap gap-2 rounded-2xl bg-gray-100 p-2">
                                            {yearOptions.map((option) => (
                                                <button
                                                    key={option.year}
                                                    type="button"
                                                    onClick={() =>
                                                        router.get(
                                                            '/publication-ranking',
                                                            {
                                                                year: option.year,
                                                            },
                                                            {
                                                                preserveScroll: true,
                                                                preserveState: false,
                                                            },
                                                        )
                                                    }
                                                    className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                                                        selectedYear ===
                                                        option.year
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                            : 'text-gray-500 hover:bg-white hover:text-gray-800'
                                                    }`}
                                                >
                                                    {option.year}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {hasMultipleCategories ? (
                                        <div>
                                            <div className="mb-3 text-sm font-medium text-slate-700">
                                                Активная категория
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {categoryCards.map(
                                                    (category) => {
                                                        const CategoryIcon =
                                                            category.meta.icon;

                                                        return (
                                                            <button
                                                                key={
                                                                    category.key
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedCategoryKey(
                                                                        category.key,
                                                                    )
                                                                }
                                                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                                                                    activeCategory?.key ===
                                                                    category.key
                                                                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                                                                        : 'border border-gray-200/70 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                                }`}
                                                            >
                                                                <CategoryIcon className="h-4 w-4" />
                                                                {category.label}
                                                                <span
                                                                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                                                        activeCategory?.key ===
                                                                        category.key
                                                                            ? 'bg-white/20 text-white'
                                                                            : 'bg-white text-gray-400'
                                                                    }`}
                                                                >
                                                                    {
                                                                        category.entryCount
                                                                    }
                                                                </span>
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                                        <div className="relative">
                                            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="search"
                                                value={searchQuery}
                                                onChange={(event) =>
                                                    setSearchQuery(
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Поиск по вузу или городу"
                                                className="w-full rounded-2xl border border-gray-200/70 bg-gray-50 py-3 pr-4 pl-11 text-sm text-gray-700 transition-all outline-none placeholder:text-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>

                                        <div className="rounded-2xl border border-gray-200/70 bg-gray-50 px-4 py-3 text-sm text-slate-600">
                                            {activeCategory ? (
                                                <>
                                                    Сейчас открыт профиль{' '}
                                                    <span className="font-semibold text-slate-950">
                                                        {activeCategory.label}
                                                    </span>
                                                    . Поиск и таблица работают
                                                    только внутри выбранной
                                                    категории.
                                                </>
                                            ) : (
                                                'Выберите год публикации, чтобы открыть архив.'
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="rounded-[1.75rem] p-5 text-white shadow-xl shadow-blue-950/10"
                                    style={{
                                        backgroundImage:
                                            activeCategoryMeta.surface,
                                    }}
                                >
                                    <div className="text-[11px] font-semibold tracking-[0.18em] text-blue-100/70 uppercase">
                                        Сводка выбранного экрана
                                    </div>

                                    <div className="mt-4 flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-3xl font-semibold">
                                                {selectedYear}
                                            </div>
                                            <p className="mt-2 text-sm leading-6 text-blue-100/75">
                                                {hasMultipleCategories
                                                    ? 'В этом году рейтинг опубликован по отдельным профилям вузов, поэтому основной сценарий начинается с выбора категории.'
                                                    : 'В этом году рейтинг опубликован единым списком, поэтому акцент сделан на лидерах, поиске и полном архиве результатов.'}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-white/10 p-3">
                                            <Sparkles className="h-5 w-5 text-blue-100" />
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                                            <div className="text-xs tracking-[0.2em] text-blue-100/70 uppercase">
                                                Показано строк
                                            </div>
                                            <div className="mt-2 text-2xl font-semibold">
                                                {visibleRows.length}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                                            <div className="text-xs tracking-[0.2em] text-blue-100/70 uppercase">
                                                Видимость
                                            </div>
                                            <div className="mt-2 text-2xl font-semibold">
                                                {visibleShare}%
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                                            <div className="text-xs tracking-[0.2em] text-blue-100/70 uppercase">
                                                Категория
                                            </div>
                                            <div className="mt-2 text-sm leading-6 font-semibold">
                                                {activeCategory?.label ??
                                                    'Архив'}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                                            <div className="text-xs tracking-[0.2em] text-blue-100/70 uppercase">
                                                Лучший балл
                                            </div>
                                            <div className="mt-2 text-2xl font-semibold">
                                                {formatScore(bestVisibleScore)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {hasMultipleCategories ? (
                            <section className="mt-10">
                                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <div className="text-sm font-medium tracking-[0.24em] text-blue-700 uppercase">
                                            Профили выпуска
                                        </div>
                                        <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                                            Карточки категорий работают как
                                            навигация
                                        </h2>
                                    </div>

                                    <div className="max-w-2xl text-sm leading-6 text-slate-500">
                                        Каждая карточка показывает лидера
                                        профиля, объем выборки и лучший балл.
                                        Переключение сразу перестраивает блок
                                        лидеров и таблицу ниже.
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {categoryCards.map((category) => {
                                        const isActive =
                                            activeCategory?.key ===
                                            category.key;
                                        const Icon = category.meta.icon;

                                        return (
                                            <button
                                                key={category.key}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedCategoryKey(
                                                        category.key,
                                                    )
                                                }
                                                className={`overflow-hidden rounded-[1.75rem] bg-white text-left transition-all duration-300 ${
                                                    isActive
                                                        ? `-translate-y-1 ring-2 ${category.meta.ringClassName} shadow-xl ${category.meta.shadowClassName}`
                                                        : 'border border-gray-200/70 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/60'
                                                }`}
                                            >
                                                <div
                                                    className="p-5 text-white"
                                                    style={{
                                                        backgroundImage:
                                                            category.meta
                                                                .surface,
                                                    }}
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="rounded-2xl bg-white/15 p-3">
                                                            <Icon className="h-5 w-5" />
                                                        </div>

                                                        <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-white uppercase">
                                                            {
                                                                category.entryCount
                                                            }{' '}
                                                            вузов
                                                        </div>
                                                    </div>

                                                    <h3 className="mt-4 text-xl leading-snug font-semibold">
                                                        {category.label}
                                                    </h3>
                                                    <p className="mt-3 text-sm leading-6 text-blue-100/80">
                                                        Лучший результат:{' '}
                                                        {formatScore(
                                                            category.topScore,
                                                        )}
                                                        . Лидер категории уже
                                                        вынесен в отдельную
                                                        карточку ниже.
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between px-5 py-4">
                                                    <div>
                                                        <div className="text-xs tracking-[0.2em] text-slate-400 uppercase">
                                                            Лидер категории
                                                        </div>
                                                        <div className="mt-1 text-sm font-semibold text-slate-950">
                                                            {category.leader
                                                                ?.universityName ??
                                                                'Нет данных'}
                                                        </div>
                                                    </div>

                                                    <ChevronRight
                                                        className={`h-4 w-4 transition-transform ${
                                                            isActive
                                                                ? 'translate-x-1 text-blue-600'
                                                                : 'text-slate-300'
                                                        }`}
                                                    />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        ) : null}
                        <section className="mt-10 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
                            <aside
                                className="rounded-[2rem] p-6 text-white shadow-2xl shadow-blue-950/10"
                                style={{
                                    backgroundImage: activeCategoryMeta.surface,
                                }}
                            >
                                <div className="text-[11px] font-semibold tracking-[0.18em] text-blue-100/70 uppercase">
                                    Активный профиль
                                </div>

                                <div className="mt-4 flex items-center gap-4">
                                    <div className="rounded-2xl bg-white/15 p-3">
                                        <ActiveCategoryIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-semibold">
                                            {activeCategory?.label ?? 'Архив'}
                                        </h2>
                                        <p className="mt-1 text-sm text-blue-100/75">
                                            {selectedRating?.title ??
                                                'Архивный выпуск рейтинга публикаций'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                    <div className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4">
                                        <div className="text-xs tracking-[0.2em] text-blue-100/70 uppercase">
                                            В категории
                                        </div>
                                        <div className="mt-2 text-2xl font-semibold">
                                            {activeCategory?.entryCount ?? 0}
                                        </div>
                                    </div>

                                    <div className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4">
                                        <div className="text-xs tracking-[0.2em] text-blue-100/70 uppercase">
                                            В таблице
                                        </div>
                                        <div className="mt-2 text-2xl font-semibold">
                                            {visibleRows.length}
                                        </div>
                                    </div>

                                    <div className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4">
                                        <div className="text-xs tracking-[0.2em] text-blue-100/70 uppercase">
                                            Критериев
                                        </div>
                                        <div className="mt-2 text-2xl font-semibold">
                                            {criteria.length}
                                        </div>
                                    </div>

                                    <div className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4">
                                        <div className="text-xs tracking-[0.2em] text-blue-100/70 uppercase">
                                            Баллов в методике
                                        </div>
                                        <div className="mt-2 text-2xl font-semibold">
                                            {formatScore(
                                                totalMethodologyPoints,
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {activeCategory?.rows[0] ? (
                                    <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
                                        <div className="text-xs tracking-[0.2em] text-blue-100/70 uppercase">
                                            Лидер категории
                                        </div>
                                        <div className="mt-3 text-lg font-semibold">
                                            {
                                                activeCategory.rows[0]
                                                    .universityName
                                            }
                                        </div>
                                        {activeCategory.rows[0].city ? (
                                            <div className="mt-2 inline-flex items-center gap-2 text-sm text-blue-100/80">
                                                <MapPin className="h-4 w-4" />
                                                {activeCategory.rows[0].city}
                                            </div>
                                        ) : null}
                                        <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3">
                                            <div>
                                                <div className="text-xs tracking-[0.2em] text-blue-100/70 uppercase">
                                                    Итоговый балл
                                                </div>
                                                <div className="mt-1 text-2xl font-semibold">
                                                    {formatScore(
                                                        activeCategory.rows[0]
                                                            .total,
                                                    )}
                                                </div>
                                            </div>

                                            {getUniversityProfileHref(
                                                activeCategory.rows[0]
                                                    .universityId,
                                            ) ? (
                                                <Link
                                                    href={
                                                        getUniversityProfileHref(
                                                            activeCategory
                                                                .rows[0]
                                                                .universityId,
                                                        )!
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-blue-50"
                                                >
                                                    Профиль
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </Link>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}
                            </aside>

                            <div className="rounded-[2rem] border border-gray-200/70 bg-white p-6 shadow-xl shadow-gray-200/40">
                                <div className="flex flex-col gap-3 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <div className="inline-flex items-center gap-2 text-sm font-medium tracking-[0.24em] text-blue-700 uppercase">
                                            <BookOpenText className="h-4 w-4" />
                                            Методология
                                        </div>
                                        <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                                            Как читать публикационный рейтинг
                                        </h2>
                                    </div>

                                    <div className="max-w-2xl text-sm leading-6 text-slate-500">
                                        {methodology?.title ??
                                            'Для этого года методология в архиве не найдена, но таблица результатов и навигация по категориям остаются доступными.'}
                                    </div>
                                </div>

                                {criteria.length > 0 ? (
                                    <div className="mt-8 space-y-6">
                                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
                                            <div className="rounded-[1.75rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <div className="text-xs tracking-[0.24em] text-blue-700 uppercase">
                                                            Архив критериев
                                                        </div>
                                                        <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                                                            {methodology?.title ??
                                                                'Публикационная активность'}
                                                        </h3>
                                                    </div>

                                                    <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 ring-1 ring-slate-200">
                                                        {formatScore(
                                                            totalMethodologyPoints,
                                                        )}{' '}
                                                        балла
                                                    </div>
                                                </div>

                                                <p className="mt-4 text-base leading-7 text-slate-600">
                                                    Методология показывает,
                                                    какие параметры учитывались
                                                    при ранжировании:
                                                    публикационная активность,
                                                    вес критериев и общая
                                                    структура итогового балла.
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="rounded-[1.5rem] border border-gray-200 bg-gray-50 p-5">
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <Waypoints className="h-4 w-4 text-blue-700" />
                                                        Критериев в выпуске
                                                    </div>
                                                    <div className="mt-2 text-3xl font-semibold text-slate-950">
                                                        {criteria.length}
                                                    </div>
                                                </div>

                                                <div className="rounded-[1.5rem] border border-gray-200 bg-gray-50 p-5">
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <Trophy className="h-4 w-4 text-blue-700" />
                                                        Лучший результат
                                                    </div>
                                                    <div className="mt-2 text-lg font-semibold text-slate-950">
                                                        {formatScore(
                                                            bestVisibleScore,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                            {criteria.map((criterion) => (
                                                <article
                                                    key={`${criterion.number ?? criterion.title}`}
                                                    className="rounded-[1.5rem] border border-gray-200 bg-slate-50 p-5"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="text-xs tracking-[0.24em] text-blue-700 uppercase">
                                                            {criterion.number
                                                                ? `Критерий ${criterion.number}`
                                                                : 'Критерий'}
                                                        </div>
                                                        {criterion.points !==
                                                        null ? (
                                                            <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 ring-1 ring-slate-200">
                                                                {formatScore(
                                                                    criterion.points,
                                                                )}
                                                            </div>
                                                        ) : null}
                                                    </div>

                                                    <p className="mt-4 text-sm leading-6 text-slate-600">
                                                        {criterion.title}
                                                    </p>
                                                </article>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-8 rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">
                                        Для выбранного года методология не
                                        найдена. Ниже все равно доступна полная
                                        таблица публикационного рейтинга.
                                    </div>
                                )}
                            </div>
                        </section>
                        <section className="mt-10">
                            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <div className="text-sm font-medium tracking-[0.24em] text-blue-700 uppercase">
                                        Лидеры категории
                                    </div>
                                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                                        Первые позиции по текущим фильтрам
                                    </h2>
                                </div>

                                <div className="max-w-2xl text-sm leading-6 text-slate-500">
                                    Карточки пересчитываются после смены года,
                                    категории и поискового запроса. Так экран
                                    сразу показывает лидеров именно в том срезе,
                                    который выбран сейчас.
                                </div>
                            </div>

                            <div className="grid gap-5 xl:grid-cols-3">
                                {leaders.length > 0 ? (
                                    leaders.map((row, index) => {
                                        const imageSrc = getUniversityImage(
                                            row.universityId,
                                        );
                                        const profileHref =
                                            getUniversityProfileHref(
                                                row.universityId,
                                            );
                                        const scoreWidth = bestVisibleScore
                                            ? Math.max(
                                                  12,
                                                  Math.round(
                                                      ((row.total ?? 0) /
                                                          bestVisibleScore) *
                                                          100,
                                                  ),
                                              )
                                            : 0;

                                        return (
                                            <article
                                                key={row.id}
                                                className="group overflow-hidden rounded-[2rem] bg-[#071327] text-white shadow-xl shadow-blue-950/10 transition hover:-translate-y-1"
                                            >
                                                <div className="relative h-64 overflow-hidden">
                                                    <div
                                                        className={`absolute inset-0 bg-gradient-to-br ${featuredThemes[index % featuredThemes.length]}`}
                                                    />
                                                    <div className="absolute inset-0 bg-slate-950/45" />
                                                    {imageSrc ? (
                                                        <img
                                                            src={imageSrc}
                                                            alt={
                                                                row.universityName
                                                            }
                                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                            onError={(
                                                                event,
                                                            ) => {
                                                                event.currentTarget.style.display =
                                                                    'none';
                                                            }}
                                                        />
                                                    ) : null}

                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050b16] via-[#050b16]/25 to-transparent" />

                                                    <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-white uppercase backdrop-blur">
                                                        <Trophy className="h-4 w-4 text-amber-300" />
                                                        {index === 0
                                                            ? 'Лидер категории'
                                                            : `Позиция ${row.place}`}
                                                    </div>

                                                    <div className="absolute top-5 right-5 rounded-2xl bg-white/12 px-4 py-3 text-right backdrop-blur">
                                                        <div className="text-xs tracking-[0.2em] text-blue-100/75 uppercase">
                                                            Место
                                                        </div>
                                                        <div className="mt-1 text-3xl font-semibold">
                                                            #{row.place}
                                                        </div>
                                                    </div>

                                                    <div className="absolute right-5 bottom-5 left-5">
                                                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-blue-100/85 backdrop-blur">
                                                            <ActiveCategoryIcon className="h-4 w-4" />
                                                            {activeCategory?.label ??
                                                                'Категория'}
                                                        </div>

                                                        <h3 className="mt-4 max-w-[22rem] text-2xl leading-snug font-semibold">
                                                            {row.universityName}
                                                        </h3>

                                                        {row.city ? (
                                                            <div className="mt-3 inline-flex items-center gap-2 text-sm text-blue-100/80">
                                                                <MapPin className="h-4 w-4" />
                                                                {row.city}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="space-y-5 p-6">
                                                    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div>
                                                                <div className="text-xs tracking-[0.2em] text-blue-100/70 uppercase">
                                                                    Итоговый
                                                                    балл
                                                                </div>
                                                                <div className="mt-2 text-4xl font-semibold">
                                                                    {formatScore(
                                                                        row.total,
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="rounded-2xl bg-white/10 p-3">
                                                                <FileText className="h-5 w-5 text-blue-100" />
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 h-2.5 rounded-full bg-white/10">
                                                            <div
                                                                className={`h-full rounded-full bg-gradient-to-r ${featuredThemes[index % featuredThemes.length]}`}
                                                                style={{
                                                                    width: `${scoreWidth}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="text-sm leading-6 text-blue-100/70">
                                                            {profileHref
                                                                ? 'Карточка ведет на профиль вуза с полной институциональной информацией.'
                                                                : 'Для этого вуза профиль пока не привязан, но позиция сохранена в архиве.'}
                                                        </div>

                                                        {profileHref ? (
                                                            <Link
                                                                href={
                                                                    profileHref
                                                                }
                                                                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-blue-50"
                                                            >
                                                                Профиль
                                                                <ArrowUpRight className="h-4 w-4" />
                                                            </Link>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })
                                ) : (
                                    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500 xl:col-span-3">
                                        По текущим фильтрам ничего не найдено.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section
                            id="publication-table"
                            className="mt-10 overflow-hidden rounded-[2rem] border border-gray-200/60 bg-white shadow-xl shadow-gray-200/40"
                        >
                            <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-7 py-6 text-white">
                                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <div className="text-sm font-medium tracking-[0.24em] text-blue-200/80 uppercase">
                                            Полная таблица
                                        </div>
                                        <h2 className="mt-2 text-3xl font-semibold">
                                            {activeCategory?.label ??
                                                'Рейтинг публикаций'}{' '}
                                            · {selectedYear}
                                        </h2>
                                    </div>

                                    <div className="max-w-2xl text-sm leading-6 text-blue-100/70">
                                        Таблица следует активной категории и
                                        поиску. Если нужен другой профиль,
                                        переключите карточку выше и список сразу
                                        перестроится без отдельного экрана.
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 border-b border-gray-200 bg-gray-50 px-7 py-5 md:grid-cols-4">
                                <div className="rounded-[1.25rem] bg-white p-4">
                                    <div className="text-sm text-slate-500">
                                        Строк в таблице
                                    </div>
                                    <div className="mt-2 text-3xl font-semibold text-slate-950">
                                        {visibleRows.length}
                                    </div>
                                </div>

                                <div className="rounded-[1.25rem] bg-white p-4">
                                    <div className="text-sm text-slate-500">
                                        Категорий в году
                                    </div>
                                    <div className="mt-2 text-3xl font-semibold text-slate-950">
                                        {selectedRating?.categoryCount ?? 0}
                                    </div>
                                </div>

                                <div className="rounded-[1.25rem] bg-white p-4">
                                    <div className="text-sm text-slate-500">
                                        Критериев
                                    </div>
                                    <div className="mt-2 text-3xl font-semibold text-slate-950">
                                        {criteria.length}
                                    </div>
                                </div>

                                <div className="rounded-[1.25rem] bg-white p-4">
                                    <div className="text-sm text-slate-500">
                                        Лучший балл
                                    </div>
                                    <div className="mt-2 text-3xl font-semibold text-slate-950">
                                        {formatScore(bestVisibleScore)}
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-white text-left text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                                            <th className="px-6 py-4">Место</th>
                                            <th className="px-6 py-4">Вуз</th>
                                            {hasCities ? (
                                                <th className="px-6 py-4">
                                                    Город
                                                </th>
                                            ) : null}
                                            <th className="px-6 py-4">
                                                Итоговый балл
                                            </th>
                                            <th className="px-6 py-4">
                                                Профиль
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {visibleRows.length > 0 ? (
                                            visibleRows.map((row) => {
                                                const profileHref =
                                                    getUniversityProfileHref(
                                                        row.universityId,
                                                    );

                                                return (
                                                    <tr
                                                        key={row.id}
                                                        className="border-t border-gray-100 transition-colors hover:bg-blue-50/40"
                                                    >
                                                        <td className="px-6 py-5 align-top">
                                                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                                                                #{row.place}
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-5 align-top">
                                                            <div className="font-semibold text-slate-950">
                                                                {
                                                                    row.universityName
                                                                }
                                                            </div>
                                                            <div className="mt-2 text-sm text-slate-500">
                                                                {activeCategory?.label ??
                                                                    'Архивный выпуск'}
                                                            </div>
                                                        </td>

                                                        {hasCities ? (
                                                            <td className="px-6 py-5 align-top text-sm text-slate-600">
                                                                {row.city ??
                                                                    'Не указан'}
                                                            </td>
                                                        ) : null}

                                                        <td className="px-6 py-5 align-top font-semibold text-slate-950">
                                                            {formatScore(
                                                                row.total,
                                                            )}
                                                        </td>

                                                        <td className="px-6 py-5 align-top">
                                                            {profileHref ? (
                                                                <Link
                                                                    href={
                                                                        profileHref
                                                                    }
                                                                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 transition hover:text-blue-900"
                                                                >
                                                                    Профиль вуза
                                                                    <ArrowUpRight className="h-4 w-4" />
                                                                </Link>
                                                            ) : (
                                                                <span className="text-sm text-slate-400">
                                                                    Не привязан
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={hasCities ? 5 : 4}
                                                    className="px-6 py-14 text-center text-slate-500"
                                                >
                                                    По текущим параметрам нет
                                                    строк для отображения.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="rounded-[2rem] border border-gray-200/60 bg-white p-6 shadow-xl shadow-gray-200/40">
                                <div className="text-sm font-medium tracking-[0.24em] text-blue-700 uppercase">
                                    Что важно читать
                                </div>
                                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                                    Не только итог, но и структуру
                                    публикационной активности
                                </h2>

                                <div className="mt-8 grid gap-6 md:grid-cols-3">
                                    <div className="border-l-2 border-blue-100 pl-5">
                                        <div className="inline-flex items-center gap-2 text-lg font-semibold text-slate-950">
                                            <FileText className="h-5 w-5 text-blue-700" />
                                            Архив по годам
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">
                                            Переключение между годами помогает
                                            увидеть, как менялись выпуски,
                                            количество критериев и состав
                                            университетов в рейтинге.
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-emerald-100 pl-5">
                                        <div className="inline-flex items-center gap-2 text-lg font-semibold text-slate-950">
                                            <Building2 className="h-5 w-5 text-emerald-600" />
                                            Категориальный срез
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">
                                            Если выпуск разбит по профилям,
                                            стоит смотреть не только абсолютного
                                            лидера года, но и первого в каждой
                                            категории.
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-orange-100 pl-5">
                                        <div className="inline-flex items-center gap-2 text-lg font-semibold text-slate-950">
                                            <BookOpenText className="h-5 w-5 text-orange-500" />
                                            Вес критериев
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">
                                            Методология помогает понять, как
                                            сформирован итоговый балл и какие
                                            показатели влияли на публикационную
                                            позицию вуза.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2rem] bg-[#102e5e] p-6 text-white shadow-xl shadow-blue-950/10">
                                <div className="text-sm font-medium tracking-[0.24em] text-blue-200 uppercase">
                                    Сводка года
                                </div>
                                <h2 className="mt-2 text-3xl font-semibold">
                                    {selectedYear}
                                </h2>
                                <p className="mt-4 text-sm leading-6 text-blue-100">
                                    Выпуск собран в одной странице: активная
                                    категория, лидеры, критерии методологии и
                                    полная таблица без лишних переходов по
                                    архиву.
                                </p>

                                <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-blue-100">
                                            Источник
                                        </span>
                                        <span className="font-medium">
                                            Архив IQAA
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-blue-100">
                                            Диапазон
                                        </span>
                                        <span className="font-medium">
                                            {archiveRange}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-blue-100">
                                            Методология
                                        </span>
                                        <span className="font-medium">
                                            {selectedYearMeta?.hasMethodology
                                                ? 'доступна'
                                                : 'не найдена'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-blue-100">
                                            Активная категория
                                        </span>
                                        <span className="text-right font-medium">
                                            {activeCategory?.label ?? 'Архив'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
