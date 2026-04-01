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
        <h1 className="text-sm font-semibold text-blue-900 ">
          Независимое агентство по обеспечению
        </h1>
        <p className="text-sm font-semibold text-blue-900 ">
        {/*md:text-base*/}        
          качества в образовании - Рейтинг
        </p>
      </div>
    </Link>
  );
}
