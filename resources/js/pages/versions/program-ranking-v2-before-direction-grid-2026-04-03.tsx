import { Head, Link, router } from "@inertiajs/react";
import {
  BookOpenText,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Cog,
  Filter,
  FlaskConical,
  Globe2,
  GraduationCap,
  Hash,
  Laptop2,
  Leaf,
  Palette,
  PawPrint,
  Scale,
  Search,
  Shield,
  Star,
  Stethoscope,
  Trophy,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import RankingHero, {
  RankingHeroBadge,
  RankingHeroPanel,
  RankingHeroStat,
} from "@/components/hero/ranking-hero";

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

type RankFilter = "all" | "top1" | "top3" | "top5";

type DegreeOption = {
  value: string;
  label: string;
  shortLabel: string;
};

type FieldOption = {
  key: string;
  id: number | null;
  code?: string | null;
  name: string;
  label: string;
  icon: LucideIcon;
};

type GroupItem = {
  key: string;
  code: string;
  name: string;
  label: string;
  directionName?: string | null;
  rows: RatingItem[];
  leader: RatingItem;
};

const TEXT = {
  pageTitle: "\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u043d\u044b\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433 - \u0432\u0430\u0440\u0438\u0430\u043d\u0442 2",
  programRanking: "\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u043d\u044b\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433",
  all: "\u0412\u0441\u0435",
  top1: "\u0422\u043e\u043f-1",
  top3: "\u0422\u043e\u043f-3",
  top5: "\u0422\u043e\u043f-5",
  openNavigator: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043d\u0430\u0432\u0438\u0433\u0430\u0442\u043e\u0440",
  firstVariant: "\u041f\u0435\u0440\u0432\u044b\u0439 \u0432\u0430\u0440\u0438\u0430\u043d\u0442",
  methodology: "\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f",
  records: "\u0417\u0430\u043f\u0438\u0441\u0435\u0439",
  levels: "\u0423\u0440\u043e\u0432\u043d\u0435\u0439",
  directions: "\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0439",
  scores: "\u0411\u0430\u043b\u043b\u044b",
  yes: "\u0435\u0441\u0442\u044c",
  no: "\u043d\u0435\u0442",
  formatOfYear: "\u0424\u043e\u0440\u043c\u0430\u0442 \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0433\u043e \u0433\u043e\u0434\u0430",
  footerLabel:
    "\u041d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f \u043f\u043e \u0443\u0440\u043e\u0432\u043d\u044f\u043c \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f\u043c \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0438",
  sectionTitlePrefix: "\u0420\u0435\u0439\u0442\u0438\u043d\u0433",
  sectionDescription:
    "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u043e\u0434, \u0443\u0440\u043e\u0432\u0435\u043d\u044c \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0438, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u043e\u0434\u0440\u043e\u0431\u043d\u044b\u0435 \u043f\u043e\u0437\u0438\u0446\u0438\u0438 \u0432\u0443\u0437\u043e\u0432 \u0432\u043d\u0443\u0442\u0440\u0438 \u043d\u0443\u0436\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438.",
  year: "\u0413\u043e\u0434 \u0440\u0435\u0439\u0442\u0438\u043d\u0433\u0430",
  level: "\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f",
  direction: "\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0438",
  groupsAndPrograms: "\u0413\u0440\u0443\u043f\u043f / \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c",
  selectedDirectionFallback: "\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d\u043e",
  searchPlaceholder:
    "\u041f\u043e\u0438\u0441\u043a \u043f\u043e \u0432\u0443\u0437\u0443, \u043a\u043e\u0434\u0443, \u0433\u0440\u0443\u043f\u043f\u0435 \u041e\u041f \u0438\u043b\u0438 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u044e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b...",
  expandAll: "\u0420\u0430\u0437\u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0432\u0441\u0435",
  collapseAll: "\u0421\u0432\u0435\u0440\u043d\u0443\u0442\u044c",
  leader: "\u041b\u0438\u0434\u0435\u0440",
  universities: "\u0432\u0443\u0437\u043e\u0432",
  place: "\u041c\u0435\u0441\u0442\u043e",
  universityAndDetails: "\u0412\u0443\u0437 \u0438 \u0434\u0435\u0442\u0430\u043b\u0438",
  total: "\u0418\u0442\u043e\u0433\u043e",
  cityMissing: "\u0412\u0443\u0437 \u043d\u0435 \u0443\u043a\u0430\u0437\u0430\u043d",
  noResultsForFilter: "\u041d\u0435\u0442 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432 \u0434\u043b\u044f \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0433\u043e \u0444\u0438\u043b\u044c\u0442\u0440\u0430",
  emptyTitle: "\u041f\u043e \u0432\u0430\u0448\u0435\u043c\u0443 \u0437\u0430\u043f\u0440\u043e\u0441\u0443 \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e",
  emptyDescription:
    "\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u043e\u0438\u0441\u043a\u043e\u0432\u044b\u0439 \u0437\u0430\u043f\u0440\u043e\u0441 \u0438\u043b\u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0438",
  uniqueUniversities: "\u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0445 \u0432\u0443\u0437\u043e\u0432",
  bestScore: "\u041b\u0443\u0447\u0448\u0438\u0439 \u0431\u0430\u043b\u043b",
  unpublished: "\u043d\u0435 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d",
  notAvailable: "\u043d/\u0434",
};

const degreeOrder: Record<string, number> = {
  bachelor: 1,
  master: 2,
  phd: 3,
};

const normalizeText = (value: string) => value.toLocaleLowerCase("ru-RU");
const formatScore = (value: number | null) =>
  value === null ? TEXT.notAvailable : value.toFixed(2);
const degreeLabelRu = (value?: string | null) => {
  if (value === "bachelor") return "\u0411\u0430\u043a\u0430\u043b\u0430\u0432\u0440\u0438\u0430\u0442";
  if (value === "master") return "\u041c\u0430\u0433\u0438\u0441\u0442\u0440\u0430\u0442\u0443\u0440\u0430";
  if (value === "phd") return "\u0414\u043e\u043a\u0442\u043e\u0440\u0430\u043d\u0442\u0443\u0440\u0430";
  return "\u0423\u0440\u043e\u0432\u0435\u043d\u044c";
};
const levelTypeLabelRu = (value?: "program" | "group" | null) =>
  value === "program"
    ? "\u041e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b"
    : "\u0413\u0440\u0443\u043f\u043f\u044b \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c";
const activeModeLabelRu = (value?: "program" | "group" | null) =>
  value === "program"
    ? "\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c"
    : "\u0433\u0440\u0443\u043f\u043f \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c";
const eraDescriptionRu = (value?: "program" | "group" | null) =>
  value === "program"
    ? "\u0414\u043e 2020 \u0433\u043e\u0434\u0430 \u0440\u0435\u0439\u0442\u0438\u043d\u0433 \u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043b\u0441\u044f \u043f\u043e \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u043c \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u043c \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430\u043c \u0432\u043d\u0443\u0442\u0440\u0438 \u0443\u0440\u043e\u0432\u043d\u044f \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0438."
    : "\u041d\u0430\u0447\u0438\u043d\u0430\u044f \u0441 2020 \u0433\u043e\u0434\u0430 \u0440\u0435\u0439\u0442\u0438\u043d\u0433 \u0441\u0442\u0440\u043e\u0438\u0442\u0441\u044f \u043f\u043e \u0433\u0440\u0443\u043f\u043f\u0430\u043c \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c \u0432\u043d\u0443\u0442\u0440\u0438 \u0443\u0440\u043e\u0432\u043d\u044f \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0438.";

const rankFilters: Array<{ key: RankFilter; label: string }> = [
  { key: "all", label: TEXT.all },
  { key: "top1", label: TEXT.top1 },
  { key: "top3", label: TEXT.top3 },
  { key: "top5", label: TEXT.top5 },
];

const getFieldKey = (rating: RatingItem) =>
  `${rating.degree.value ?? "unknown"}:${rating.field.id ?? "none"}:${rating.field.code ?? rating.field.name}`;

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

const compareRatings = (left: RatingItem, right: RatingItem) => {
  if (left.rank !== right.rank) {
    return left.rank - right.rank;
  }

  return (left.university?.currentName ?? "").localeCompare(
    right.university?.currentName ?? "",
    "ru",
  );
};

const filterRowsByRank = (rows: RatingItem[], rankFilter: RankFilter) => {
  if (rankFilter === "all") return rows;
  const maxRank = rankFilter === "top1" ? 1 : rankFilter === "top3" ? 3 : 5;
  return rows.filter((row) => row.rank <= maxRank);
};

const scoreTone = (score: number | null) => {
  if (score === null) {
    return { text: "text-slate-400", bar: "bg-slate-300", width: 0 };
  }
  if (score >= 90) return { text: "text-teal-600", bar: "bg-teal-500", width: score };
  if (score >= 70) return { text: "text-blue-600", bar: "bg-blue-500", width: score };
  if (score >= 50) return { text: "text-amber-600", bar: "bg-amber-500", width: score };
  return { text: "text-red-500", bar: "bg-red-400", width: score };
};

const trimLeaderName = (value: string | undefined) => {
  if (!value) return TEXT.cityMissing;
  return value.length > 42 ? `${value.slice(0, 42)}...` : value;
};

export default function ProgramRankingVariantTwoPage({
  selectedYear,
  selectedMeta,
  yearOptions = [],
  ratings = [],
}: Props) {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDirection, setSelectedDirection] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [rankFilter, setRankFilter] = useState<RankFilter>("all");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const educationLevels = useMemo<DegreeOption[]>(() => {
    const map = new Map<string, DegreeOption>();

    ratings.forEach((rating) => {
      if (!rating.degree.value || map.has(rating.degree.value)) return;
      map.set(rating.degree.value, {
        value: rating.degree.value,
        label: degreeLabelRu(rating.degree.value),
        shortLabel: degreeLabelRu(rating.degree.value),
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

  const directionOptions = useMemo<FieldOption[]>(() => {
    const map = new Map<string, FieldOption>();

    ratings
      .filter((rating) => !selectedLevel || rating.degree.value === selectedLevel)
      .forEach((rating) => {
        const key = getFieldKey(rating);
        if (map.has(key)) return;
        map.set(key, {
          key,
          id: rating.field.id,
          code: rating.field.code,
          name: rating.field.name,
          label: rating.field.label,
          icon: resolveFieldIcon(rating.field.name, rating.field.code),
        });
      });

    return [...map.values()].sort((left, right) => {
      if (left.code && right.code) {
        return left.code.localeCompare(right.code, "ru");
      }
      return left.name.localeCompare(right.name, "ru");
    });
  }, [ratings, selectedLevel]);

  useEffect(() => {
    if (!directionOptions.length) {
      setSelectedDirection("");
      return;
    }
    if (!selectedDirection || !directionOptions.some((direction) => direction.key === selectedDirection)) {
      setSelectedDirection(directionOptions[0].key);
    }
  }, [directionOptions, selectedDirection]);

  const scopedRatings = useMemo(() => {
    return ratings.filter((rating) => {
      const levelMatch = !selectedLevel || rating.degree.value === selectedLevel;
      const directionMatch = !selectedDirection || getFieldKey(rating) === selectedDirection;
      return levelMatch && directionMatch;
    });
  }, [ratings, selectedDirection, selectedLevel]);

  const allGroups = useMemo<GroupItem[]>(() => {
    const map = new Map<string, GroupItem>();

    scopedRatings.forEach((rating) => {
      const key = `${rating.levelType}-${rating.level.id}`;
      const current = map.get(key);
      if (current) {
        current.rows.push(rating);
        return;
      }

      map.set(key, {
        key,
        code: rating.level.code ?? `#${rating.level.id}`,
        name: rating.level.name ?? rating.level.label,
        label: rating.level.label,
        directionName: rating.direction?.name ?? null,
        rows: [rating],
        leader: rating,
      });
    });

    return [...map.values()]
      .map((group) => {
        const rows = [...group.rows].sort(compareRatings);
        return { ...group, rows, leader: rows[0] };
      })
      .sort((left, right) => left.code.localeCompare(right.code, "ru"));
  }, [scopedRatings]);

  const normalizedQuery = normalizeText(searchQuery.trim());
  const filteredGroups = useMemo(() => {
    if (!normalizedQuery) return allGroups;

    return allGroups.filter((group) => {
      const searchIndex = [
        group.code,
        group.name,
        group.label,
        group.directionName ?? "",
        ...group.rows.flatMap((row) => [
          row.university?.currentName ?? "",
          row.university?.city ?? "",
          ...row.programs.flatMap((program) => [program.code ?? "", program.name ?? ""]),
        ]),
      ]
        .join(" ")
        .toLocaleLowerCase("ru-RU");

      return searchIndex.includes(normalizedQuery);
    });
  }, [allGroups, normalizedQuery]);

  useEffect(() => {
    const allowedKeys = new Set(filteredGroups.map((group) => group.key));
    setExpandedGroups((previous) => new Set([...previous].filter((key) => allowedKeys.has(key))));
  }, [filteredGroups]);

  const totalRows = filteredGroups.reduce(
    (sum, group) => sum + filterRowsByRank(group.rows, rankFilter).length,
    0,
  );

  const selectedLevelMeta = educationLevels.find((level) => level.value === selectedLevel) ?? null;
  const selectedDirectionMeta = directionOptions.find((direction) => direction.key === selectedDirection) ?? null;
  const SelectedDirectionIcon = selectedDirectionMeta?.icon ?? BookOpenText;

  const visibleUniversityIds = useMemo(() => {
    const ids = new Set<number>();
    filteredGroups.forEach((group) => {
      filterRowsByRank(group.rows, rankFilter).forEach((row) => {
        if (row.university?.id) ids.add(row.university.id);
      });
    });
    return ids;
  }, [filteredGroups, rankFilter]);

  const topScore = useMemo(() => {
    return filteredGroups.reduce((maxScore, group) => {
      return filterRowsByRank(group.rows, rankFilter).reduce((currentMax, row) => {
        if (row.totalScore === null) return currentMax;
        return Math.max(currentMax, row.totalScore);
      }, maxScore);
    }, 0);
  }, [filteredGroups, rankFilter]);

  const toggleGroup = (key: string) => {
    setExpandedGroups((previous) => {
      const next = new Set(previous);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const expandAll = () => setExpandedGroups(new Set(filteredGroups.map((group) => group.key)));
  const collapseAll = () => setExpandedGroups(new Set());

  const heroTitle = (
    <>
      {"\u0420\u0435\u0439\u0442\u0438\u043d\u0433 \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0445"}
      <br />
      {"\u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c \u0438 \u0433\u0440\u0443\u043f\u043f"}
      <br />
      <span className="text-gradient">
        {"\u043f\u043e \u0443\u0440\u043e\u0432\u043d\u044f\u043c \u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f\u043c"}
      </span>
    </>
  );

  const heroDescription =
    "\u0412\u0442\u043e\u0440\u043e\u0439 \u0441\u0446\u0435\u043d\u0430\u0440\u0438\u0439 \u043f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u0441\u043e\u0431\u0438\u0440\u0430\u0435\u0442 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u043d\u044b\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433 \u0447\u0435\u0440\u0435\u0437 \u0442\u0440\u0438 \u0448\u0430\u0433\u0430: \u0433\u043e\u0434, \u0443\u0440\u043e\u0432\u0435\u043d\u044c \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0438. \u041f\u043e\u0441\u043b\u0435 \u0432\u044b\u0431\u043e\u0440\u0430 \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u043f\u043e\u0434\u0440\u043e\u0431\u043d\u044b\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433 \u0432\u043d\u0443\u0442\u0440\u0438 \u043d\u0443\u0436\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438.";

  return (
    <>
      <Head title={TEXT.pageTitle} />

      <div className="min-h-screen bg-slate-50 text-slate-950">
        <RankingHero
          currentPath="/program-ranking"
          badge={
            <RankingHeroBadge icon={<Calendar className="h-4 w-4 text-blue-300" />}>
              {`${TEXT.programRanking} ${selectedYear}`}
            </RankingHeroBadge>
          }
          title={heroTitle}
          description={heroDescription}
          actions={
            <>
              <a
                href="#program-ranking-v2-browser"
                className="btn-orange inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
              >
                {TEXT.openNavigator}
                <ChevronRight className="h-4 w-4" />
              </a>
              <Link
                href="/program-ranking"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                {TEXT.firstVariant}
              </Link>
              <Link
                href="/methodology"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                {TEXT.methodology}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </>
          }
          aside={
            <div className="space-y-4 lg:ml-auto lg:max-w-md">
              <div className="grid grid-cols-2 gap-3">
                <RankingHeroStat
                  label={TEXT.records}
                  value={selectedMeta?.entryCount ?? 0}
                  valueClassName="text-3xl"
                />
                <RankingHeroStat
                  label={TEXT.levels}
                  value={educationLevels.length || "\u2014"}
                  valueClassName="text-3xl"
                />
                <RankingHeroStat
                  label={TEXT.directions}
                  value={directionOptions.length || "\u2014"}
                  valueClassName="text-3xl"
                />
                <RankingHeroStat
                  label={TEXT.scores}
                  value={selectedMeta?.hasScores ? TEXT.yes : TEXT.no}
                  valueClassName="text-2xl"
                />
              </div>

              <RankingHeroPanel className="rounded-[1.75rem] p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300/70">
                  {TEXT.formatOfYear}
                </div>
                <div className="mt-3 text-xl font-semibold text-white">
                  {levelTypeLabelRu(selectedMeta?.levelType)}
                </div>
                <p className="mt-3 text-sm leading-6 text-blue-100/65">
                  {eraDescriptionRu(selectedMeta?.levelType)}
                </p>
              </RankingHeroPanel>
            </div>
          }
          footerLabel={TEXT.footerLabel}
        />

        <main id="program-ranking-v2-browser" className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">
                {`${TEXT.sectionTitlePrefix} ${activeModeLabelRu(selectedMeta?.levelType)}`}
              </h2>
              <p className="mx-auto mt-2 max-w-3xl text-sm text-slate-500">
                {TEXT.sectionDescription}
              </p>
            </div>

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {TEXT.year}
                </label>
                <div className="flex flex-wrap gap-2">
                  {yearOptions.map((option) => (
                    <button
                      key={option.year}
                      type="button"
                      onClick={() =>
                        router.get(
                          "/program-ranking-v2",
                          { year: option.year },
                          { preserveScroll: true, preserveState: false },
                        )
                      }
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                        selectedYear === option.year
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                      }`}
                    >
                      {option.year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {TEXT.level}
                </label>
                <div className="flex flex-wrap gap-2">
                  {educationLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setSelectedLevel(level.value)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        selectedLevel === level.value
                          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                      }`}
                    >
                      <GraduationCap size={14} />
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {TEXT.direction}
                </label>
                <div className="flex flex-wrap gap-2">
                  {directionOptions.map((direction) => {
                    const Icon = direction.icon;

                    return (
                      <button
                        key={direction.key}
                        type="button"
                        onClick={() => setSelectedDirection(direction.key)}
                        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-medium transition-all duration-300 ${
                          selectedDirection === direction.key
                            ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                        }`}
                      >
                        <Icon size={14} />
                        <span className="hidden sm:inline">
                          {direction.code ? `${direction.code} ${direction.name}` : direction.name}
                        </span>
                        <span className="sm:hidden">{direction.code ?? direction.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-5 text-white sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <SelectedDirectionIcon size={20} />
                    <h3 className="text-lg font-bold sm:text-xl">
                      {selectedDirectionMeta?.code
                        ? `${selectedDirectionMeta.code} ${selectedDirectionMeta.name}`
                        : TEXT.selectedDirectionFallback}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400">
                    {`${selectedLevelMeta?.label ?? degreeLabelRu(null)} / ${selectedYear} / ${levelTypeLabelRu(selectedMeta?.levelType)}`}
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-extrabold">{filteredGroups.length}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      {TEXT.groupsAndPrograms}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold">{totalRows}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      {TEXT.records}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder={TEXT.searchPlaceholder}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={14} className="shrink-0 text-slate-400" />
                {rankFilters.map((filterOption) => (
                  <button
                    key={filterOption.key}
                    type="button"
                    onClick={() => setRankFilter(filterOption.key)}
                    className={`rounded-lg px-3 py-2 text-[12px] font-semibold transition-all ${
                      rankFilter === filterOption.key
                        ? "bg-amber-500 text-white shadow shadow-amber-500/25"
                        : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={expandAll}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-500 transition-all hover:bg-slate-50"
                >
                  {TEXT.expandAll}
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-500 transition-all hover:bg-slate-50"
                >
                  {TEXT.collapseAll}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredGroups.map((group) => {
                const isExpanded = expandedGroups.has(group.key);
                const universities = filterRowsByRank(group.rows, rankFilter);
                const leaderTone = scoreTone(group.leader.totalScore);
                const compactCode = group.code.length > 7 ? "text-[10px]" : "text-[13px]";

                return (
                  <div
                    key={group.key}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.key)}
                      className="flex w-full items-center gap-4 p-4 text-left transition-colors duration-200 hover:bg-slate-50/50 sm:p-5"
                    >
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-500/20">
                        <Hash size={10} className="opacity-70" />
                        <span className={`font-bold leading-tight ${compactCode}`}>
                          {group.code}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-slate-700">
                          {group.name}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <Users size={11} />
                            {`${group.rows.length} ${TEXT.universities}`}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500">
                            <Trophy size={11} />
                            {trimLeaderName(group.leader.university?.currentName)}
                          </span>
                        </div>
                      </div>

                      <div className="hidden shrink-0 items-center gap-3 sm:flex">
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider text-slate-400">
                            {TEXT.leader}
                          </p>
                          <p className={`text-lg font-extrabold ${leaderTone.text}`}>
                            {formatScore(group.leader.totalScore)}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isExpanded ? (
                          <ChevronUp size={18} className="text-slate-400" />
                        ) : (
                          <ChevronDown size={18} className="text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded ? (
                      <div className="border-t border-slate-100">
                        <div className="grid grid-cols-[60px_1fr_84px] bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:grid-cols-[60px_1fr_112px]">
                          <span>{TEXT.place}</span>
                          <span>{TEXT.universityAndDetails}</span>
                          <span className="text-right">{TEXT.total}</span>
                        </div>

                        {universities.length > 0 ? (
                          universities.map((row, index) => {
                            const tone = scoreTone(row.totalScore);

                            return (
                              <div
                                key={`${group.key}-${row.university?.id ?? "unknown"}-${index}`}
                                className={`grid grid-cols-[60px_1fr_84px] items-start border-t border-slate-50 px-5 py-4 transition-colors duration-200 hover:bg-blue-50/30 sm:grid-cols-[60px_1fr_112px] ${
                                  row.rank === 1 ? "bg-amber-50/30" : ""
                                }`}
                              >
                                <div className="flex items-center">
                                  {row.rank <= 3 ? (
                                    <div
                                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-bold text-white ${
                                        row.rank === 1
                                          ? "bg-gradient-to-br from-amber-400 to-amber-500 shadow shadow-amber-500/30"
                                          : row.rank === 2
                                            ? "bg-gradient-to-br from-slate-300 to-slate-400 shadow shadow-slate-400/30"
                                            : "bg-gradient-to-br from-orange-300 to-orange-400 shadow shadow-orange-400/30"
                                      }`}
                                    >
                                      {row.rank}
                                    </div>
                                  ) : (
                                    <span className="pl-2 text-sm font-semibold text-slate-400">
                                      {row.rank}
                                    </span>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="text-[13px] font-semibold leading-snug text-slate-700">
                                    {row.university?.currentName ?? TEXT.cityMissing}
                                  </p>

                                  <ul className="mt-1.5 space-y-1">
                                    {row.university?.city ? (
                                      <li className="text-[11px] text-slate-500">
                                        {row.university.city}
                                      </li>
                                    ) : null}

                                    {row.programs.map((program) => (
                                      <li
                                        key={`${program.code ?? program.name}-${row.id}`}
                                        className="flex items-start gap-1.5 text-[11px] text-slate-500"
                                      >
                                        <BookOpenText
                                          size={10}
                                          className="mt-0.5 shrink-0 text-slate-400"
                                        />
                                        <span>
                                          {[program.code, program.name]
                                            .filter(Boolean)
                                            .join(" - ")}
                                        </span>
                                      </li>
                                    ))}

                                    {!row.programs.length &&
                                    row.direction?.name &&
                                    row.direction.name !== group.name ? (
                                      <li className="text-[11px] text-slate-500">
                                        {row.direction.name}
                                      </li>
                                    ) : null}
                                  </ul>
                                </div>

                                <div className="flex flex-col items-end gap-1 text-right">
                                  <span className={`text-base font-extrabold ${tone.text}`}>
                                    {formatScore(row.totalScore)}
                                  </span>
                                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${tone.bar}`}
                                      style={{
                                        width: `${Math.max(0, Math.min(tone.width, 100))}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-5 py-8 text-center text-sm text-slate-400">
                            {TEXT.noResultsForFilter}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {filteredGroups.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                  <Search size={40} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium text-slate-500">
                    {TEXT.emptyTitle}
                  </p>
                  <p className="mt-1 text-[12px] text-slate-400">
                    {TEXT.emptyDescription}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[12px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Star size={14} className="text-amber-500" />
                {`${filteredGroups.length} ${TEXT.groupsAndPrograms.toLowerCase()}`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users size={14} className="text-blue-500" />
                {`${totalRows} ${TEXT.records.toLowerCase()}`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={14} className="text-indigo-500" />
                {`${visibleUniversityIds.size} ${TEXT.uniqueUniversities}`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Trophy size={14} className="text-orange-500" />
                {`${TEXT.bestScore}: ${topScore > 0 ? topScore.toFixed(2) : TEXT.unpublished}`}
              </span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
