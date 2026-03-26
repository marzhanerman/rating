export default function KazakhstanMap() {
  return (
    <svg
      viewBox="0 0 800 500"
      className="absolute inset-0 w-full h-full opacity-[0.08]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M120 250 L200 200 L350 220 L500 180 L650 240 L600 300 L400 320 L250 290 Z"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="2"
        className="animate-mapPulse"
      />

      <circle cx="350" cy="220" r="4" fill="#94A3B8" className="animate-nodePulse" />
      <circle cx="500" cy="180" r="4" fill="#94A3B8" className="animate-nodePulse delay-1000" />
      <circle cx="250" cy="290" r="4" fill="#94A3B8" className="animate-nodePulse delay-2000" />
    </svg>
  );
}