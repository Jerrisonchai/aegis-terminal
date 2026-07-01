// src/hooks/use-alerts.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { getAlertsEngine, type Alert } from '@/lib/alerts-engine';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const engine = getAlertsEngine();

  useEffect(() => {
    setAlerts(engine.getAlerts(20));
    setUnreadCount(engine.getUnreadCount());

    const unsubscribe = engine.subscribe((_alert) => {
      setAlerts([...engine.getAlerts(20)]);
      setUnreadCount(engine.getUnreadCount());
    });
    return () => { unsubscribe(); };
  }, []);

  const markRead = useCallback((id: string) => {
    engine.markRead(id);
    setUnreadCount(engine.getUnreadCount());
  }, []);

  const markAllRead = useCallback(() => {
    engine.markAllRead();
    setAlerts(engine.getAlerts(20));
    setUnreadCount(0);
  }, []);

  const dismiss = useCallback((id: string) => {
    engine.dismiss(id);
    setAlerts(engine.getAlerts(20));
    setUnreadCount(engine.getUnreadCount());
  }, []);

  const clear = useCallback(() => {
    engine.clear();
    setAlerts([]);
    setUnreadCount(0);
  }, []);

  return { alerts, unreadCount, markRead, markAllRead, dismiss, clear };
}
