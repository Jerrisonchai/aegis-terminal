// src/components/ui/status-dot.tsx
interface StatusDotProps {
  status: 'green' | 'yellow' | 'red' | 'gray';
  pulse?: boolean;
  size?: number;
}

export function StatusDot({ status, pulse = true, size = 8 }: StatusDotProps) {
  const colorMap = {
    green: pulse ? 'dot-green' : 'bg-buy',
    yellow: 'dot-yellow',
    red: 'dot-red',
    gray: 'dot-gray',
  };

  return (
    <span
      className={`inline-block rounded-full ${colorMap[status]}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    />
  );
}
