interface RenaissanceLogoProps {
  className?: string;
}

export function RenaissanceLogo({ className }: RenaissanceLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      className={className}
      aria-label="Renaissance logo"
      role="img"
    >
      <defs>
        <linearGradient id="renaissance-ring" x1="18" y1="16" x2="108" y2="110">
          <stop offset="0%" stopColor="#2C78FF" />
          <stop offset="55%" stopColor="#27A4F1" />
          <stop offset="100%" stopColor="#19D3D8" />
        </linearGradient>
        <linearGradient id="renaissance-panel" x1="34" y1="30" x2="90" y2="96">
          <stop offset="0%" stopColor="#53B8FF" />
          <stop offset="100%" stopColor="#28C8D7" />
        </linearGradient>
      </defs>

      <g
        fill="none"
        stroke="url(#renaissance-ring)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="64" cy="64" r="33" />
        <circle cx="64" cy="18" r="5" />
        <circle cx="64" cy="110" r="5" />
        <circle cx="18" cy="64" r="5" />
        <circle cx="110" cy="64" r="5" />
        <circle cx="31.5" cy="31.5" r="5" />
        <circle cx="96.5" cy="31.5" r="5" />
        <circle cx="31.5" cy="96.5" r="5" />
        <circle cx="96.5" cy="96.5" r="5" />
        <path d="M64 24v7" />
        <path d="M64 97v7" />
        <path d="M24 64h7" />
        <path d="M97 64h7" />
        <path d="M35.5 35.5l5 5" />
        <path d="M92.5 92.5l-5-5" />
        <path d="M92.5 35.5l-5 5" />
        <path d="M35.5 92.5l5-5" />
      </g>

      <circle cx="64" cy="64" r="27" fill="#0B0F17" />
      <polygon points="64,43 74,49 72,61 64,65 56,61 54,49" fill="#111827" />
      <polygon points="49,51 56,61 53,75 40,75 35,61 40,50" fill="url(#renaissance-panel)" />
      <polygon points="79,50 93,61 88,75 75,75 72,61 74,49" fill="#5AAEF9" />
      <polygon points="56,77 72,77 78,91 64,99 50,91" fill="#34C8D8" />
      <polygon points="42,39 54,33 58,45 50,55 38,50" fill="#2E9BEF" />
      <polygon points="70,45 74,33 86,39 90,50 78,55" fill="#5FB5FF" />
    </svg>
  );
}
