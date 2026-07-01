// src/components/ui/empty-state.tsx
import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4 opacity-50">{icon}</span>
      <h3 className="text-fluid-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-fg-muted text-fluid-sm max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
