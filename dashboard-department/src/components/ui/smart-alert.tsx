// src/components/ui/smart-alert.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { useAlerts } from '@/hooks/use-alerts';
import type { Alert } from '@/lib/alerts-engine';

const iconMap = {
  info: <Info className="w-4 h-4 text-neon-blue" />,
  success: <CheckCircle2 className="w-4 h-4 text-buy" />,
  warning: <AlertTriangle className="w-4 h-4 text-watch" />,
  error: <AlertCircle className="w-4 h-4 text-danger" />,
};

const bgMap = {
  info: 'border-neon-blue/30 bg-neon-blue/5',
  success: 'border-buy/30 bg-buy/5',
  warning: 'border-watch/30 bg-watch/5',
  error: 'border-danger/30 bg-danger/5',
};

export function SmartAlertToast() {
  const { alerts, dismiss } = useAlerts();
  const [visible, setVisible] = useState<Alert[]>([]);

  useEffect(() => {
    const unread = alerts.filter(a => !a.dismissed && !a.read).slice(0, 3);
    setVisible(unread);

    if (unread.length > 0) {
      const timer = setTimeout(() => {
        unread.forEach(a => dismiss(a.id));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {visible.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`glass border rounded-xl p-3 pr-8 relative ${bgMap[alert.severity]}`}
          >
            <button
              onClick={() => dismiss(alert.id)}
              className="absolute top-2 right-2 text-fg-muted hover:text-foreground"
            >
              <X size={14} />
            </button>
            <div className="flex items-start gap-2">
              {iconMap[alert.severity]}
              <div>
                <div className="text-fluid-xs font-medium text-foreground">{alert.rule.name}</div>
                <div className="text-fluid-xs text-fg-muted mt-0.5">{alert.message}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
