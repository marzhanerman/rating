import {
  Building2,
  Globe,
  GraduationCap,
  MapPin,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import UniversityTrendChart, { type UniversityHistoryPoint } from "@/components/universities/university-trend-chart";

export type UniversityProfile = {
  id: number | null;
  currentName: string | null;
  city?: string | null;
  status?: string | null;
  currentRank: number;
  currentScore: number;
  institutionalCategory: string;
  website?: string | null;
  rector?: string | null;
  address?: string | null;
  foundedYear?: number | null;
  studentCount?: number | null;
  history: UniversityHistoryPoint[];
};

const categoryStyles: Record<string, string> = {
  "Многопрофильные вузы": "bg-orange-500/15 text-orange-700 ring-orange-200",
  "Технические вузы": "bg-blue-500/15 text-blue-700 ring-blue-200",
  "Гуманитарно-экономические вузы": "bg-amber-500/15 text-amber-700 ring-amber-200",
  "Педагогические вузы": "bg-cyan-500/15 text-cyan-700 ring-cyan-200",
  "Медицинские вузы": "bg-emerald-500/15 text-emerald-700 ring-emerald-200",
  "Вузы искусства": "bg-fuchsia-500/15 text-fuchsia-700 ring-fuchsia-200",
  "Вузы искусства и спорта": "bg-fuchsia-500/15 text-fuchsia-700 ring-fuchsia-200",
};

const getCategoryStyle = (category: string) =>
  categoryStyles[category] ?? "bg-slate-500/10 text-slate-700 ring-slate-200";

const getUniversityImage = (universityId?: number | null) =>
  universityId ? `/storage/images/universities/${universityId}.jpg` : "";

const formatStudentCount = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "Контингент будет добавлен";
  }

  return new Intl.NumberFormat("ru-RU").format(value);
};

const formatPlaceholder = (value: string | number | null | undefined, fallback: string) =>
  value === null || value === undefined || value === "" ? fallback : String(value);

export default function UniversityProfileCard({ profile }: { profile: UniversityProfile }) {
  const currentPoint = profile.history[profile.history.length - 1];
  const previousPoint = profile.history.length > 1 ? profile.history[profile.history.length - 2] : null;
  const bestRank = profile.history.length > 0 ? Math.min(...profile.history.map((item) => item.rank)) : profile.currentRank;
  const yearsInRanking = profile.history.length;
  const rankDelta = previousPoint && currentPoint ? previousPoint.rank - currentPoint.rank : null;
  const scoreDelta = previousPoint && currentPoint ? currentPoint.totalScore - previousPoint.totalScore : null;

  const trendLabel =
    rankDelta === null
      ? "История добавляется"
      : rankDelta > 0
        ? `+${rankDelta} к позиции прошлого года`
        : rankDelta < 0
          ? `${rankDelta} к позиции прошлого года`
          : "Позиция сохранилась";

  const scoreLabel =
    scoreDelta === null
      ? "Без сравнения"
      : `${scoreDelta > 0 ? "+" : ""}${scoreDelta.toFixed(2)} к прошлому году`;

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-5">
      <div className="relative overflow-hidden rounded-[1.8rem] bg-slate-950 text-white">
        <div
          className="h-52 bg-cover bg-center opacity-45"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.16), rgba(15,23,42,0.8)), url('${getUniversityImage(
              profile.id,
            )}')`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.18),transparent_28%)]" />

        <div className="absolute left-5 top-5">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getCategoryStyle(profile.institutionalCategory)}`}>
            {profile.institutionalCategory}
          </span>
        </div>

        <div className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-lg font-semibold text-white">
          #{profile.currentRank}
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="text-xs uppercase tracking-[0.24em] text-blue-100">Паспорт вуза</div>
          <h3 className="mt-3 text-2xl font-semibold leading-tight">
            {profile.currentName ?? "Название будет добавлено"}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
            <MapPin className="h-4 w-4" />
            {profile.city ?? "Город будет добавлен"}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.35rem] bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Trophy className="h-4 w-4 text-blue-700" />
            Текущая позиция
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">#{profile.currentRank}</div>
          <div className="mt-2 text-xs text-slate-500">{trendLabel}</div>
        </div>

        <div className="rounded-[1.35rem] bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <AwardIcon />
            Итоговый балл
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">{profile.currentScore.toFixed(2)}</div>
          <div className="mt-2 text-xs text-slate-500">{scoreLabel}</div>
        </div>

        <div className="rounded-[1.35rem] bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <GraduationCap className="h-4 w-4 text-blue-700" />
            Лучший результат
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">#{bestRank}</div>
          <div className="mt-2 text-xs text-slate-500">За весь доступный период</div>
        </div>

        <div className="rounded-[1.35rem] bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="h-4 w-4 text-blue-700" />
            Лет в рейтинге
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">{yearsInRanking}</div>
          <div className="mt-2 text-xs text-slate-500">История институционального рейтинга</div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <InfoSlot
          icon={<Globe className="h-4 w-4 text-blue-700" />}
          label="Веб-сайт"
          value={formatPlaceholder(profile.website, "Официальный сайт будет добавлен")}
        />
        <InfoSlot
          icon={<UserRound className="h-4 w-4 text-blue-700" />}
          label="Ректор / президент"
          value={formatPlaceholder(profile.rector, "Имя руководителя будет добавлено")}
        />
        <InfoSlot
          icon={<Building2 className="h-4 w-4 text-blue-700" />}
          label="Адрес кампуса"
          value={formatPlaceholder(
            profile.address,
            profile.city ? `${profile.city}, подробный адрес будет добавлен` : "Адрес будет добавлен",
          )}
        />
        <InfoSlot
          icon={<GraduationCap className="h-4 w-4 text-blue-700" />}
          label="Год основания"
          value={formatPlaceholder(profile.foundedYear, "Год основания будет добавлен")}
        />
        <InfoSlot
          icon={<Users className="h-4 w-4 text-blue-700" />}
          label="Контингент"
          value={formatStudentCount(profile.studentCount)}
        />
        <InfoSlot
          icon={<Building2 className="h-4 w-4 text-blue-700" />}
          label="Статус"
          value={formatPlaceholder(profile.status, "Статус будет добавлен")}
        />
      </div>

      <div className="mt-5">
        <UniversityTrendChart history={profile.history} />
      </div>
    </article>
  );
}

function InfoSlot({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-sm font-medium leading-6 text-slate-900">{value}</div>
    </div>
  );
}

function AwardIcon() {
  return (
    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700">
      %
    </div>
  );
}
