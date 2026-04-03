import { Head, router } from "@inertiajs/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Star, X, type LucideIcon, GraduationCap, Palette, Globe2, Scale, FlaskConical, Laptop2, Cog, Leaf, PawPrint, Stethoscope, UtensilsCrossed, Shield, BookOpenText } from "lucide-react";

import RankingHero, { RankingHeroPanel, RankingHeroStat } from "@/components/hero/ranking-hero";

type DegreeValue = "bachelor" | "master" | "phd" | string | null;

type YearOption = {
  year: number;
  levelType: "program" | "group";
  entryCount: number;
  levelCount: number;
  universityCount: number;
  scoredCount: number;
  hasScores: boolean;
  label: string;
  shortLabel: string;
};

type RatingItem = {
  id: number;
  rank: number;
  totalScore: number | null;
  levelType: "program" | "group";
  degree: {
    value: DegreeValue;
    label: string;
    shortLabel: string;
  };
  field: {
    id: number | null;
    code?: string | null;
    name: string;
    label: string;
  };
  direction: {
    id: number;
    code?: string | null;
    name: string;
  } | null;
  university: {
    id: number;
    currentName: string;
    city?: string | null;
  } | null;
  level: {
    id: number;
    code?: string | null;
    name?: string | null;
    label: string;
  };
  programs: Array<{
    code?: string | null;
    name?: string | null;
  }>;
};

type Props = {
  selectedYear: number;
  selectedMeta: YearOption | null;
  yearOptions: YearOption[];
  ratings: RatingItem[];
};

type DegreeOption = {
  value: string;
  label: string;
};

type DirectionView = {
  key: string;
  code: string;
  name: string;
  icon: LucideIcon;
  color: string;
  subdirs: Array<{
    key: string;
    name: string;
    rows: RatingItem[];
  }>;
};

const TEXT = {
  title: "\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f",
  ratingYear: "\u0420\u0435\u0439\u0442\u0438\u043d\u0433",
  subtitle:
    "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u0430 \u0434\u0435\u0442\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0435\u0439\u0442\u0438\u043d\u0433\u0430 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c",
  subtitlePrograms:
    "\u0414\u043e 2020 \u0433\u043e\u0434\u0430 \u0440\u0430\u043d\u0436\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0448\u043b\u043e \u043f\u043e \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u043c \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u043c \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430\u043c.",
  subtitleGroups:
    "\u0421 2020 \u0433\u043e\u0434\u0430 \u0440\u0435\u0439\u0442\u0438\u043d\u0433 \u043f\u0443\u0431\u043b\u0438\u043a\u0443\u0435\u0442\u0441\u044f \u043f\u043e \u0433\u0440\u0443\u043f\u043f\u0430\u043c \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c.",
  records: "\u0417\u0430\u043f\u0438\u0441\u0435\u0439",
  noDataForLevel:
    "\u0414\u0430\u043d\u043d\u044b\u0435 \u0434\u043b\u044f \u044d\u0442\u043e\u0433\u043e \u0443\u0440\u043e\u0432\u043d\u044f \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u043f\u043e\u043a\u0430 \u043d\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u044b",
  statsGroups: "\u0413\u0440\u0443\u043f\u043f\u044b \u041e\u041f",
  statsPrograms: "\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b",
  statsUniversities: "\u0412\u0443\u0437\u043e\u0432",
  statsScores: "\u0411\u0430\u043b\u043b\u044b",
  scoresYes: "\u0435\u0441\u0442\u044c",
  scoresNo: "\u043d\u0435\u0442",
  yearFormat: "\u0413\u0440\u0443\u043f\u043f\u044b \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c",
  yearFormatPrograms: "\u041e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u0435 \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b",
  yearFormatProgramsDescription:
    "\u0414\u043e 2020 \u0433\u043e\u0434\u0430 \u0440\u0435\u0439\u0442\u0438\u043d\u0433\u0438 \u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043b\u0438\u0441\u044c \u043f\u043e \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u043c \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u043c \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430\u043c.",
  yearFormatGroupsDescription:
    "\u041d\u0430\u0447\u0438\u043d\u0430\u044f \u0441 2020 \u0433\u043e\u0434\u0430 \u0440\u0435\u0439\u0442\u0438\u043d\u0433\u0438 \u043f\u0443\u0431\u043b\u0438\u043a\u0443\u044e\u0442\u0441\u044f \u043f\u043e \u0433\u0440\u0443\u043f\u043f\u0430\u043c \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c.",
  place: "\u041c\u0435\u0441\u0442\u043e",
  universityAndPrograms: "\u0412\u0443\u0437 \u0438 \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b",
  score: "\u0411\u0430\u043b\u043b",
  groupsWord1: "\u0433\u0440\u0443\u043f\u043f\u0430",
  groupsWord2: "\u0433\u0440\u0443\u043f\u043f\u044b",
  groupsWord5: "\u0433\u0440\u0443\u043f\u043f",
  missingUniversity: "\u2014",
  bachelor: "\u0431\u0430\u043a\u0430\u043b\u0430\u0432\u0440\u0438\u0430\u0442",
  master: "\u043c\u0430\u0433\u0438\u0441\u0442\u0440\u0430\u0442\u0443\u0440\u0430",
  phd: "\u0434\u043e\u043a\u0442\u043e\u0440\u0430\u043d\u0442\u0443\u0440\u0430",
  notAvailable: "\u043d/\u0434",
};

const degreeOrder: Record<string, number> = {
  bachelor: 1,
  master: 2,
  phd: 3,
};

const pluralGroups = (count: number) => {
  if (count === 1) return TEXT.groupsWord1;
  if (count >= 2 && count <= 4) return TEXT.groupsWord2;
  return TEXT.groupsWord5;
};

const degreeLabelRu = (value?: string | null) => {
  if (value === "bachelor") return TEXT.bachelor;
  if (value === "master") return TEXT.master;
  if (value === "phd") return TEXT.phd;
  return "";
};

function PlaceBadge({ place }: { place: number }) {
  if (place === 1) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-[12px] font-bold text-white shadow-lg shadow-yellow-400/40">
        {place}
      </span>
    );
  }

  if (place === 2) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-[12px] font-bold text-white shadow-lg shadow-gray-400/30">
        {place}
      </span>
    );
  }

  if (place === 3) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-[12px] font-bold text-white shadow-lg shadow-amber-500/30">
        {place}
      </span>
    );
  }

  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[12px] font-bold text-gray-400">
      {place}
    </span>
  );
}

const compareRatings = (left: RatingItem, right: RatingItem) => {
  if (left.rank !== right.rank) return left.rank - right.rank;
  return (left.university?.currentName ?? "").localeCompare(
    right.university?.currentName ?? "",
    "ru",
  );
};

const resolveFieldIcon = (
  fieldName: string,
  fieldCode?: string | null,
): LucideIcon => {
  const value = `${fieldCode ?? ""} ${fieldName}`.toLocaleLowerCase("ru-RU");

  if (value.includes("\u043f\u0435\u0434\u0430\u0433\u043e\u0433")) return GraduationCap;
  if (value.includes("\u0438\u0441\u043a\u0443\u0441") || value.includes("\u0433\u0443\u043c\u0430\u043d\u0438\u0442\u0430\u0440")) return Palette;
  if (value.includes("\u0441\u043e\u0446\u0438\u0430\u043b\u044c") || value.includes("\u0436\u0443\u0440\u043d\u0430\u043b\u0438\u0441\u0442")) return Globe2;
  if (value.includes("\u0431\u0438\u0437\u043d\u0435\u0441") || value.includes("\u043f\u0440\u0430\u0432\u043e")) return Scale;
  if (value.includes("\u0435\u0441\u0442\u0435\u0441\u0442\u0432\u0435\u043d") || value.includes("\u043c\u0430\u0442\u0435\u043c\u0430\u0442")) return FlaskConical;
  if (value.includes("\u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u043e\u043d") || value.includes("\u0438\u043a\u0442")) return Laptop2;
  if (value.includes("\u0438\u043d\u0436\u0435\u043d\u0435\u0440") || value.includes("\u0441\u0442\u0440\u043e\u0438\u0442\u0435\u043b")) return Cog;
  if (value.includes("\u0441\u0435\u043b\u044c\u0441\u043a") || value.includes("\u0431\u0438\u043e\u0440\u0435\u0441\u0443\u0440\u0441")) return Leaf;
  if (value.includes("\u0432\u0435\u0442\u0435\u0440\u0438\u043d")) return PawPrint;
  if (value.includes("\u0437\u0434\u0440\u0430\u0432\u043e\u043e\u0445\u0440\u0430\u043d")) return Stethoscope;
  if (value.includes("\u0443\u0441\u043b\u0443\u0433")) return UtensilsCrossed;
  if (value.includes("\u0431\u0435\u0437\u043e\u043f\u0430\u0441") || value.includes("\u0432\u043e\u0435\u043d\u043d")) return Shield;

  return BookOpenText;
};

const resolveFieldColor = (fieldName: string, fieldCode?: string | null) => {
  const value = `${fieldCode ?? ""} ${fieldName}`.toLocaleLowerCase("ru-RU");

  if (value.includes("\u043f\u0435\u0434\u0430\u0433\u043e\u0433")) return "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)";
  if (value.includes("\u0438\u0441\u043a\u0443\u0441") || value.includes("\u0433\u0443\u043c\u0430\u043d\u0438\u0442\u0430\u0440")) return "linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%)";
  if (value.includes("\u0441\u043e\u0446\u0438\u0430\u043b\u044c") || value.includes("\u0436\u0443\u0440\u043d\u0430\u043b\u0438\u0441\u0442")) return "linear-gradient(135deg, #dcfce7 0%, #86efac 100%)";
  if (value.includes("\u0431\u0438\u0437\u043d\u0435\u0441") || value.includes("\u043f\u0440\u0430\u0432\u043e")) return "linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%)";
  if (value.includes("\u0435\u0441\u0442\u0435\u0441\u0442\u0432\u0435\u043d") || value.includes("\u043c\u0430\u0442\u0435\u043c\u0430\u0442")) return "linear-gradient(135deg, #cffafe 0%, #67e8f9 100%)";
  if (value.includes("\u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u043e\u043d") || value.includes("\u0438\u043a\u0442")) return "linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 100%)";
  if (value.includes("\u0438\u043d\u0436\u0435\u043d\u0435\u0440") || value.includes("\u0441\u0442\u0440\u043e\u0438\u0442\u0435\u043b")) return "linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)";
  if (value.includes("\u0441\u0435\u043b\u044c\u0441\u043a") || value.includes("\u0431\u0438\u043e\u0440\u0435\u0441\u0443\u0440\u0441")) return "linear-gradient(135deg, #dcfce7 0%, #4ade80 100%)";
  if (value.includes("\u0432\u0435\u0442\u0435\u0440\u0438\u043d")) return "linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)";
  if (value.includes("\u0437\u0434\u0440\u0430\u0432\u043e\u043e\u0445\u0440\u0430\u043d")) return "linear-gradient(135deg, #fee2e2 0%, #fb7185 100%)";
  if (value.includes("\u0443\u0441\u043b\u0443\u0433")) return "linear-gradient(135deg, #fef9c3 0%, #facc15 100%)";
  if (value.includes("\u0431\u0435\u0437\u043e\u043f\u0430\u0441") || value.includes("\u0432\u043e\u0435\u043d\u043d")) return "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)";

  return "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)";
};

const scoreBarStyle = (score: number | null) => {
  if (score === null) {
    return {
      width: "0%",
      background: "linear-gradient(90deg, #cbd5e1, #e2e8f0)",
      textClass: "text-gray-400",
      value: TEXT.notAvailable,
    };
  }

  if (score >= 90) {
    return {
      width: `${score}%`,
      background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
      textClass: "text-blue-700",
      value: score.toFixed(2),
    };
  }

  if (score >= 70) {
    return {
      width: `${score}%`,
      background: "linear-gradient(90deg, #3b82f6, #93c5fd)",
      textClass: "text-blue-500",
      value: score.toFixed(2),
    };
  }

  return {
    width: `${score}%`,
    background: "linear-gradient(90deg, #9ca3af, #d1d5db)",
    textClass: "text-gray-400",
    value: score.toFixed(2),
  };
};

export default function ProgramRankingVariantTwoPage({
  selectedYear,
  selectedMeta,
  yearOptions = [],
  ratings = [],
}: Props) {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [activeDir, setActiveDir] = useState<string | null>(null);
  const [activeSubdir, setActiveSubdir] = useState(0);
  const detailRef = useRef<HTMLDivElement>(null);

  const years = useMemo(
    () => [...new Set(yearOptions.map((option) => option.year))].sort((a, b) => b - a),
    [yearOptions],
  );

  const educationLevels = useMemo<DegreeOption[]>(() => {
    const map = new Map<string, DegreeOption>();

    ratings.forEach((rating) => {
      if (!rating.degree.value || map.has(rating.degree.value)) return;

      map.set(rating.degree.value, {
        value: rating.degree.value,
        label: degreeLabelRu(rating.degree.value),
      });
    });

    return [...map.values()].sort((left, right) => {
      const leftOrder = degreeOrder[left.value] ?? 99;
      const rightOrder = degreeOrder[right.value] ?? 99;
      return leftOrder - rightOrder;
    });
  }, [ratings]);

  useEffect(() => {
    if (!educationLevels.length) {
      setSelectedLevel("");
      return;
    }

    if (!selectedLevel || !educationLevels.some((level) => level.value === selectedLevel)) {
      setSelectedLevel(educationLevels[0].value);
    }
  }, [educationLevels, selectedLevel]);

  const directions = useMemo<DirectionView[]>(() => {
    const directionMap = new Map<string, DirectionView>();

    ratings
      .filter((rating) => !selectedLevel || rating.degree.value === selectedLevel)
      .forEach((rating) => {
        const directionKey = `${rating.field.id ?? "none"}:${rating.field.code ?? rating.field.name}`;
        const currentDirection = directionMap.get(directionKey);

        if (!currentDirection) {
          directionMap.set(directionKey, {
            key: directionKey,
            code: rating.field.code ?? "",
            name: rating.field.name,
            icon: resolveFieldIcon(rating.field.name, rating.field.code),
            color: resolveFieldColor(rating.field.name, rating.field.code),
            subdirs: [],
          });
        }
      });

    ratings
      .filter((rating) => !selectedLevel || rating.degree.value === selectedLevel)
      .forEach((rating) => {
        const directionKey = `${rating.field.id ?? "none"}:${rating.field.code ?? rating.field.name}`;
        const direction = directionMap.get(directionKey);
        if (!direction) return;

        const subdirKey = `${rating.levelType}-${rating.level.id}`;
        const existingSubdir = direction.subdirs.find((subdir) => subdir.key === subdirKey);

        if (existingSubdir) {
          existingSubdir.rows.push(rating);
          return;
        }

        direction.subdirs.push({
          key: subdirKey,
          name: rating.level.label,
          rows: [rating],
        });
      });

    return [...directionMap.values()]
      .map((direction) => ({
        ...direction,
        subdirs: direction.subdirs
          .map((subdir) => ({
            ...subdir,
            rows: [...subdir.rows].sort(compareRatings),
          }))
          .sort((left, right) => left.name.localeCompare(right.name, "ru")),
      }))
      .sort((left, right) => {
        if (left.code && right.code) return left.code.localeCompare(right.code, "ru");
        return left.name.localeCompare(right.name, "ru");
      });
  }, [ratings, selectedLevel]);

  useEffect(() => {
    setActiveDir(directions.length > 0 ? directions[0].key : null);
    setActiveSubdir(0);
  }, [selectedLevel, directions]);

  const openDir = (key: string) => {
    if (activeDir === key) {
      setActiveDir(null);
      return;
    }

    setActiveDir(key);
    setActiveSubdir(0);

    window.setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  };

  const closeDetail = () => setActiveDir(null);

  const currentDirection = useMemo(
    () => directions.find((direction) => direction.key === activeDir) ?? null,
    [activeDir, directions],
  );

  const currentSubdir = currentDirection?.subdirs[activeSubdir] ?? null;
  const CurrentDirectionIcon = currentDirection?.icon ?? BookOpenText;
  const selectedLevelLabel =
    educationLevels.find((level) => level.value === selectedLevel)?.label ?? "";
  const levelScopedRatings = useMemo(
    () => ratings.filter((rating) => !selectedLevel || rating.degree.value === selectedLevel),
    [ratings, selectedLevel],
  );
  const uniqueUniversitiesCount = useMemo(() => {
    const ids = new Set<number | string>();

    levelScopedRatings.forEach((rating) => {
      if (rating.university?.id) {
        ids.add(rating.university.id);
      } else if (rating.university?.currentName) {
        ids.add(rating.university.currentName);
      }
    });

    return ids.size;
  }, [levelScopedRatings]);
  const groupCount = useMemo(
    () => directions.reduce((sum, direction) => sum + direction.subdirs.length, 0),
    [directions],
  );
  const heroStats = [
    { label: TEXT.records, value: String(levelScopedRatings.length) },
    {
      label: selectedMeta?.levelType === "program" ? TEXT.statsPrograms : TEXT.statsGroups,
      value: String(groupCount),
    },
    { label: TEXT.statsUniversities, value: String(uniqueUniversitiesCount) },
    {
      label: TEXT.statsScores,
      value: levelScopedRatings.some((rating) => rating.totalScore !== null)
        ? TEXT.scoresYes
        : TEXT.scoresNo,
    },
  ];
  const yearFormatTitle =
    selectedMeta?.levelType === "program"
      ? TEXT.yearFormatPrograms
      : TEXT.yearFormat;
  const yearFormatDescription =
    selectedMeta?.levelType === "program"
      ? TEXT.yearFormatProgramsDescription
      : TEXT.yearFormatGroupsDescription;

  return (
    <>
      <Head title={"\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u043d\u044b\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433 - v2"} />

      <div className="min-h-screen bg-white">
        <RankingHero
          currentPath="/program-ranking-v2"
          content={
            <>
              <div className="animate-fade-up">
                <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-blue-200/80">
                  <Star size={14} className="text-blue-300" fill="currentColor" />
                  {`${TEXT.ratingYear} ${selectedYear}`}
                </span>
              </div>

              <h1 className="animate-fade-up-delay-1 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                Рейтинг образовательных
                <br />
                программ и групп
                <br />
                <span className="text-gradient">образовательных программ</span>
              </h1>

              <p className="animate-fade-up-delay-2 max-w-xl text-base leading-relaxed text-blue-200/50 sm:text-lg">
                {selectedMeta?.levelType === "group"
                  ? "Начиная с 2020 года рейтинги публикуются по группам образовательных программ. Выберите уровень образования и направление, чтобы открыть детальный срез по вузам."
                  : "До 2020 года ранжирование шло по отдельным образовательным программам. Выберите уровень образования и направление, чтобы просмотреть детальный рейтинг внутри выбранной области."}
              </p>

              <div className="animate-fade-up-delay-3 flex flex-wrap gap-3 pt-2">
                <a
                  href="#ranking-section"
                  className="btn-orange inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
                >
                  Смотреть направления
                  <ChevronRight size={16} />
                </a>
              </div>
            </>
          }
          aside={
            <div className="space-y-4 lg:ml-auto lg:max-w-md">
              <div className="grid grid-cols-2 gap-3">
                {heroStats.map((stat) => (
                  <RankingHeroStat
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    valueClassName="text-3xl"
                  />
                ))}
              </div>

              <RankingHeroPanel className="rounded-[1.75rem] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300/70">
                  Формат выбранного года
                </div>
                <div className="mt-3 text-2xl font-semibold text-white">
                  {yearFormatTitle}
                </div>
                <p className="mt-3 text-sm leading-6 text-blue-100/65">
                  {yearFormatDescription}
                </p>
                {selectedLevelLabel ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-blue-100/80">
                    Текущий уровень: <span className="font-semibold text-white">{selectedLevelLabel}</span>
                  </div>
                ) : null}
              </RankingHeroPanel>
            </div>
          }
        />

        <div id="ranking-section" className="relative overflow-hidden bg-white scroll-mt-24">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
            <div className="absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-100/40 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">
                  Навигатор рейтинга
                </div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">
                  {TEXT.title}
                </h2>
                <p className="mt-3 text-base font-semibold text-blue-600">
                  {selectedLevelLabel || "Выберите уровень образования"}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Выберите год публикации и направление подготовки, чтобы открыть детальный рейтинг по программам или группам образовательных программ.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {educationLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setSelectedLevel(level.value)}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 ${
                        selectedLevel === level.value
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                          : "bg-gray-100 text-gray-400 hover:bg-white hover:text-gray-700"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 rounded-2xl bg-gray-100 p-2">
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() =>
                      router.get(
                        "/program-ranking-v2",
                        { year },
                        { preserveScroll: true, preserveState: false },
                      )
                    }
                    className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                      selectedYear === year
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "text-gray-400 hover:bg-white hover:text-gray-700"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {directions.map((direction) => {
                const top = direction.subdirs.flatMap((subdir) => subdir.rows).sort(compareRatings)[0];
                const Icon = direction.icon;
                const isActive = activeDir === direction.key;

                return (
                  <button
                    key={direction.key}
                    type="button"
                    onClick={() => openDir(direction.key)}
                    className={`group overflow-hidden rounded-2xl text-left transition-all duration-300 ${
                      isActive
                        ? "ring-2 ring-blue-600 bg-white shadow-2xl shadow-blue-200/50 -translate-y-1"
                        : "border border-gray-200 bg-white hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-gray-200/60"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl transition-transform duration-300 group-hover:scale-110"
                          style={{ background: direction.color }}
                        >
                          <Icon size={22} className="text-slate-700" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex items-center gap-2">
                            {direction.code ? (
                              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                {direction.code}
                              </span>
                            ) : null}
                            <span className="text-[10px] font-medium text-gray-400">
                              {`${direction.subdirs.length} ${pluralGroups(direction.subdirs.length)}`}
                            </span>
                          </div>

                          <p className="text-[13px] font-bold leading-snug text-gray-800 transition-colors duration-300 group-hover:text-blue-700">
                            {direction.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-[9px] font-bold text-white">
                          1
                        </span>
                        <span className="max-w-[140px] truncate text-[11px] font-medium text-gray-500">
                          {top?.university?.currentName ?? TEXT.missingUniversity}
                        </span>
                      </div>

                      <ChevronRight
                        size={14}
                        className={`transition-all duration-300 ${
                          isActive
                            ? "text-blue-600"
                            : "text-gray-300 group-hover:text-blue-400"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {currentDirection ? (
              <div
                ref={detailRef}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-300/40"
              >
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 px-7 py-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                      <CurrentDirectionIcon size={24} className="text-white" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {currentDirection.name}
                      </h3>
                      <p className="mt-0.5 text-[12px] text-blue-200">
                        {`${currentDirection.code ? `${currentDirection.code} · ` : ""}${selectedYear} · ${currentDirection.subdirs.length} ${pluralGroups(currentDirection.subdirs.length)}`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeDetail}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white transition-all duration-200 hover:bg-white/25"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex gap-0 overflow-x-auto border-b border-gray-200 bg-gray-50 px-4">
                  {currentDirection.subdirs.map((subdir, index) => (
                    <button
                      key={subdir.key}
                      type="button"
                      onClick={() => setActiveSubdir(index)}
                      className={`relative whitespace-nowrap px-5 py-4 text-[12px] font-semibold transition-all duration-200 ${
                        activeSubdir === index
                          ? "text-blue-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {subdir.name}
                      {activeSubdir === index ? (
                        <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full bg-blue-600" />
                      ) : null}
                    </button>
                  ))}
                </div>

                {currentSubdir ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="w-[70px] border-b border-gray-200 px-7 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {TEXT.place}
                          </th>
                          <th className="border-b border-gray-200 px-7 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {TEXT.universityAndPrograms}
                          </th>
                          <th className="w-[170px] border-b border-gray-200 px-7 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {TEXT.score}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentSubdir.rows.map((row, index) => {
                          const score = scoreBarStyle(row.totalScore);

                          return (
                            <tr
                              key={`${row.university?.id ?? row.id}-${index}`}
                              className="group transition-colors duration-200 hover:bg-blue-50/50"
                            >
                              <td className="align-top border-b border-gray-100 px-7 py-5">
                                <PlaceBadge place={row.rank} />
                              </td>
                              <td className="align-top border-b border-gray-100 px-7 py-5">
                                <p className="text-[13px] font-bold text-gray-800 transition-colors group-hover:text-blue-700">
                                  {row.university?.currentName ?? TEXT.missingUniversity}
                                </p>
                                <p className="mt-1.5 text-[11px] leading-relaxed text-gray-400">
                                  {row.programs.length > 0
                                    ? row.programs
                                        .map((program) =>
                                          [program.code, program.name]
                                            .filter(Boolean)
                                            .join(" - "),
                                        )
                                        .join(" · ")
                                    : row.level.label}
                                </p>
                              </td>
                              <td className="align-top border-b border-gray-100 px-7 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="h-2 max-w-[80px] flex-1 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: score.width,
                                        background: score.background,
                                      }}
                                    />
                                  </div>
                                  <span
                                    className={`min-w-[32px] text-[14px] font-extrabold ${score.textClass}`}
                                  >
                                    {score.value}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            ) : null}

            {directions.length === 0 ? (
              <div className="py-20 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                  {"\ud83d\udced"}
                </div>
                <p className="text-sm font-medium text-gray-400">
                  {TEXT.noDataForLevel}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
