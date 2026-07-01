// src/components/ui/glass-card.tsx
'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: 'green' | 'blue' | 'purple' | 'cyan' | 'pink' | null;
  onClick?: () => void;
  delay?: number;
}

export function GlassCard({ children, className = '', glow = null, onClick, delay = 0 }: GlassCardProps) {
  const glowMap = {
    green: 'neon-glow-green',
    blue: 'neon-glow-blue',
    purple: 'neon-glow-purple',
    cyan: 'neon-glow-cyan',
    pink: 'neon-glow-pink',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={`glass p-5 ${glow ? glowMap[glow] : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}
