import { Link } from "@inertiajs/react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <img
        src="/images/logos/logo.svg"
        alt="IQAA"
        className="h-16 w-auto object-contain"
      />

      <div className="leading-tight">
        <div className="font-semibold text-[#0F172A]">
  IQAA Ranking
</div>
        <div className="text-[11px] text-slate-500">
  Независимое агентство <br/>по обеспечению качества в образовании
</div>

      </div>
    </Link>
  );
}
