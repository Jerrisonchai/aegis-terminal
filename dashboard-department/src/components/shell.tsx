// src/components/shell.tsx
'use client';
import { useState, type ReactNode } from 'react';
import { TopBar } from './top-bar';
import { Sidebar } from './sidebar';
import { BottomNav } from './bottom-nav';
import { StatusBar } from './status-bar';
import { SmartAlertToast } from './ui/smart-alert';

export function Shell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <div className="flex flex-1">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-[64px]' : 'md:ml-[220px]'
        } pb-20 md:pb-10`}>
          <div className="px-4 md:px-6 py-4 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
      <StatusBar />
      <SmartAlertToast />
    </div>
  );
}
