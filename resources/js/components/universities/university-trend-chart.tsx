import { useId } from "react";

export type UniversityHistoryPoint = {
  year: number;
  rank: number;
  totalScore: number;
};

type Props = {
  history: UniversityHistoryPoint[];
};

export default function UniversityTrendChart({ history }: Props) {
  const gradientId = useId();

  if (history.length === 0) {
    return (
      <div className="rounded-[1.5rem] bg-slate-950 p-5 text-sm text-slate-300">
        История рейтинга появится здесь, когда для вуза будут доступны данные по годам.
      </div>
    );
  }

  const chartHistory = history.slice(-8);
  const width = 320;
  const height = 116;
  const paddingX = 12;
  const paddingY = 14;
  const scores = chartHistory.map((item) => item.totalScore);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const scoreRange = maxScore - minScore || 1;

  const points = chartHistory.map((item, index) => {
    const x =
      chartHistory.length === 1
        ? width / 2
        : paddingX + (index * (width - paddingX * 2)) / (chartHistory.length - 1);
    const y = height - paddingY - ((item.totalScore - minScore) / scoreRange) * (height - paddingY * 2);

    return { ...item, x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");

  return (
    <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Инфографика</div>
          <div className="mt-2 text-lg font-semibold">Изменение позиции и балла по годам</div>
        </div>

        <div className="text-sm text-slate-400">
          {chartHistory[0]?.year} - {chartHistory[chartHistory.length - 1]?.year}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/5 px-3 py-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full" role="img" aria-label="График динамики рейтинга">
          <defs>
            <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {[0.2, 0.5, 0.8].map((ratio) => (
            <line
              key={ratio}
              x1={0}
              x2={width}
              y1={height * ratio}
              y2={height * ratio}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 6"
            />
          ))}

          <path d={path} fill="none" stroke={`url(#${gradientId})`} strokeLinecap="round" strokeWidth={3} />

          {points.map((point) => (
            <g key={point.year}>
              <circle cx={point.x} cy={point.y} fill="#0f172a" r={6} stroke="#ffffff" strokeWidth={2} />
              <circle cx={point.x} cy={point.y} fill="#f97316" r={2.5} />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {chartHistory.map((item) => (
          <div key={item.year} className="rounded-full bg-white/8 px-3 py-2 text-xs font-medium text-slate-200">
            {item.year}: #{item.rank}
          </div>
        ))}
      </div>
    </div>
  );
}
