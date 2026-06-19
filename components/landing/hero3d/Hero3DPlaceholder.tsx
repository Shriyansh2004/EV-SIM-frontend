export function Hero3DPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lp-xl bg-lp-primary ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 640 360"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heroFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f4f1" />
            <stop offset="100%" stopColor="#eceae6" />
          </linearGradient>
          <linearGradient id="heroGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF6B1A" stopOpacity="0" />
            <stop offset="45%" stopColor="#FF6B1A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF6B1A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#heroFloor)" />
        <ellipse cx="320" cy="300" rx="250" ry="28" fill="#ddd9d3" opacity="0.55" />
        <g opacity="0.92">
          <path
            d="M120 230 L170 205 L280 205 L310 230 L120 230 Z"
            fill="#d8dde3"
            stroke="#b8bec8"
            strokeWidth="1.5"
          />
          <rect x="145" y="215" width="38" height="14" rx="3" fill="#9aa3b0" opacity="0.55" />
          <circle cx="155" cy="232" r="11" fill="#2b2a28" />
          <circle cx="285" cy="232" r="11" fill="#2b2a28" />
        </g>
        <g opacity="0.95">
          <rect x="285" y="150" width="70" height="95" rx="8" fill="#ece8e2" stroke="#cfc9c0" strokeWidth="1.5" />
          <rect x="298" y="168" width="44" height="28" rx="4" fill="#2b2a28" opacity="0.75" />
          <rect x="318" y="205" width="18" height="34" rx="3" fill="#6b6862" />
          <circle cx="327" cy="198" r="6" fill="#FF6B1A" opacity="0.85" />
        </g>
        <g opacity="0.95">
          <rect x="430" y="118" width="92" height="132" rx="6" fill="#e2e4e8" stroke="#bfc4cc" strokeWidth="1.5" />
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <rect
              key={row}
              x="442"
              y={132 + row * 18}
              width="68"
              height="12"
              rx="2"
              fill="#2b2a28"
              opacity={0.35 + (row % 2) * 0.15}
            />
          ))}
        </g>
        <path
          d="M327 198 C360 120 390 95 470 145"
          stroke="url(#heroGlow)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path d="M285 220 C305 205 315 205 327 198" stroke="#2b2a28" strokeWidth="3" strokeLinecap="round" />
        <rect x="352" y="108" width="118" height="22" rx="6" fill="#ffe8d9" stroke="#FF6B1A" strokeWidth="0.75" opacity="0.9" />
        <text
          x="411"
          y="123"
          textAnchor="middle"
          style={{ fontFamily: "monospace", fontSize: "10px", fill: "#FF6B1A" }}
        >
          BootNotification →
        </text>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-lp-primary/20 to-transparent pointer-events-none" />
    </div>
  );
}
