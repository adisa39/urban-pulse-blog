'use client';

interface AdSpaceProps {
  variant?: 'leaderboard' | 'rectangle' | 'sidebar' | 'banner' | 'square';
  label?: string;
}

const adSizes: Record<string, { width: string; height: string; label: string }> = {
  leaderboard: { width: '100%', height: '90px', label: '728 × 90 — Leaderboard' },
  rectangle:   { width: '100%', height: '250px', label: '300 × 250 — Medium Rectangle' },
  sidebar:     { width: '100%', height: '600px', label: '160 × 600 — Wide Skyscraper' },
  banner:      { width: '100%', height: '60px', label: '468 × 60 — Banner' },
  square:      { width: '100%', height: '250px', label: '250 × 250 — Square' },
};

export default function AdSpace({ variant = 'rectangle', label }: AdSpaceProps) {
  const size = adSizes[variant];

  return (
    <div
      className="ad-space"
      style={{ width: size.width, height: size.height, minHeight: size.height }}
      aria-label="Advertisement space"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.4}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
      <span>{label || size.label}</span>
      <span style={{ fontSize: '0.68rem', opacity: 0.5 }}>Advertisement</span>
    </div>
  );
}
