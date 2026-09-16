export function HeroGraphic() {
  return (
    <svg
      viewBox="0 0 640 720"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2efe5" />
          <stop offset="100%" stopColor="#e2d6b8" />
        </linearGradient>
        <radialGradient id="hero-glow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#a8642c" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#a8642c" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="640" height="720" fill="url(#hero-bg)" />
      <rect width="640" height="720" fill="url(#hero-glow)" />

      {Array.from({ length: 7 }).map((_, row) =>
        Array.from({ length: 7 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={70 + col * 80}
            cy={70 + row * 90}
            r="1.4"
            fill="#17160f"
            opacity="0.08"
          />
        ))
      )}

      <g
        transform="translate(320,380)"
        fill="none"
        stroke="#17160f"
        strokeWidth="2"
      >
        <circle r="210" opacity="0.08" />
        <circle r="160" opacity="0.12" />
        <circle r="110" opacity="0.16" />
      </g>

      <g
        transform="translate(320,400)"
        fill="none"
        stroke="#17160f"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M -46 -280 L -46 -320 L 46 -320 L 46 -280" />
        <rect x="-78" y="-280" width="156" height="420" rx="22" fill="#faf8f2" />
        <line
          x1="-78"
          y1="-40"
          x2="78"
          y2="-40"
          stroke="#a8642c"
          strokeWidth="2"
          strokeDasharray="1 7"
        />
        <rect
          x="-78"
          y="-40"
          width="156"
          height="180"
          fill="#a8642c"
          opacity="0.09"
          stroke="none"
        />
        <line x1="-46" y1="-320" x2="-46" y2="-280" />
        <line x1="46" y1="-320" x2="46" y2="-280" />
      </g>

      <text
        x="320"
        y="660"
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', ui-monospace, monospace"
        fontSize="14"
        letterSpacing="6"
        fill="#17160f"
        opacity="0.4"
      >
        LOT VERIFIED · AX SERIES
      </text>
    </svg>
  );
}
