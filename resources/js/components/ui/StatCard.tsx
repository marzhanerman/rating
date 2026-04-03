interface StatCardProps {
  label: string;
  value: string;
  delay?: number;
}

export default function StatCard({ label, value, delay = 0 }: StatCardProps) {
  return (
    <div
      className="glass-card rounded-2xl p-5 stat-card-glow transition-all duration-300 cursor-default group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-300/70 mb-1.5">
        {label}
      </p>
      <p className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
        {value}
      </p>
    </div>
  );
}