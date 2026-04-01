import { Link } from "@inertiajs/react";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3">
            <img
                src="/images/logos/iqaa-logo.PNG"
                alt="IQAA"
                className="h-20 object-contain bg-white rounded-md p-1"
            />
            <div className="max-w-[320px]">
                <h1 className="font-bold text-lg text-[#0B2E6B]">IQAA RANKING</h1>
                <p className="text-xs opacity-80 tracking-wide ">Независимое агентство по обеспечению качества <br />в образовании - Рейтинг</p>

            </div>
        </Link>
    );
}