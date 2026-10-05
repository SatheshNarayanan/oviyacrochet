"use client";

interface YarnMascotProps {
  className?: string;
  animate?: boolean;
  size?: number;
}

export function YarnMascot({ className = "", animate = true, size = 100 }: YarnMascotProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`${animate ? "yarn-bob" : ""} ${className}`}
      aria-hidden="true"
    >
      {/* Main yarn ball body */}
      <circle cx="50" cy="52" r="34" fill="#B79AE6" />
      {/* Yarn thread lines */}
      <path
        d="M22 44c20 10 36 10 56 0M18 58c24 12 40 12 64 0M30 28c14 14 26 28 40 48M60 20c-8 16-14 36-12 64"
        fill="none"
        stroke="#8B6BC8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Pink bow */}
      <path d="M40 20l-10-10 4 14zM46 22l10-12-2 15z" fill="#F58FB5" />
      <circle cx="46" cy="22" r="5" fill="#F58FB5" />
      {/* Eyes */}
      <circle cx="43" cy="50" r="3" fill="#2E2442" />
      <circle cx="57" cy="50" r="3" fill="#2E2442" />
      <circle cx="44" cy="49" r="1" fill="white" />
      <circle cx="58" cy="49" r="1" fill="white" />
      {/* Smile */}
      <path
        d="M44 57 Q50 62 56 57"
        fill="none"
        stroke="#2E2442"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Sleepy yarn mascot for empty states */
export function YarnMascotSleepy({ size = 80 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <circle cx="50" cy="52" r="34" fill="#B79AE6" />
      <path
        d="M22 44c20 10 36 10 56 0M18 58c24 12 40 12 64 0M30 28c14 14 26 28 40 48M60 20c-8 16-14 36-12 64"
        fill="none"
        stroke="#8B6BC8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M40 20l-10-10 4 14zM46 22l10-12-2 15z" fill="#F58FB5" />
      <circle cx="46" cy="22" r="5" fill="#F58FB5" />
      {/* Sleepy eyes (closed) */}
      <path d="M40 50 Q43 48 46 50" fill="none" stroke="#2E2442" strokeWidth="2" strokeLinecap="round" />
      <path d="M54 50 Q57 48 60 50" fill="none" stroke="#2E2442" strokeWidth="2" strokeLinecap="round" />
      {/* Zzz */}
      <text x="64" y="30" fontSize="10" fill="#8B6BC8" fontFamily="sans-serif" fontWeight="bold">z</text>
      <text x="70" y="24" fontSize="8" fill="#8B6BC8" fontFamily="sans-serif" fontWeight="bold">z</text>
    </svg>
  );
}
