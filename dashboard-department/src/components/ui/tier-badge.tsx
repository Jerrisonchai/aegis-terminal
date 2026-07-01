// src/components/ui/tier-badge.tsx
import type { Tier } from '@/lib/mock-data';

const tierStyles: Record<Tier, string> = {
  BUY: 'badge-buy',
  WATCH: 'badge-watch',
  WEAK: 'badge-weak',
  AVOID: 'badge-avoid',
};

const tierDots: Record<Tier, string> = { BUY: '🟢', WATCH: '🟡', WEAK: '🟠', AVOID: '🔴' };

export function TierBadge({ tier, score }: { tier: Tier; score?: number }) {
  return (
    <span className={`${tierStyles[tier]} inline-flex items-center gap-1`}>
      <span className="text-[10px]">{tierDots[tier]}</span>
      {tier}
      {score !== undefined && <span className="opacity-70 ml-0.5">{score.toFixed(1)}</span>}
    </span>
  );
}
