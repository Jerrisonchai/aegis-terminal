// src/components/ui/skeleton-card.tsx
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass p-5 animate-pulse ${className}`}>
      <div className="h-3 bg-muted/60 rounded-full w-1/3 mb-3" />
      <div className="h-6 bg-muted/40 rounded-full w-2/3 mb-2" />
      <div className="h-3 bg-muted/60 rounded-full w-1/2" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-muted/40 rounded-full w-16" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonChart({ h = 200 }: { h?: number }) {
  return (
    <div className="glass p-5 animate-pulse" style={{ height: h + 40 }}>
      <div className="h-3 bg-muted/60 rounded-full w-1/4 mb-3" />
      <div className="bg-muted/20 rounded-xl" style={{ height: h }} />
    </div>
  );
}
