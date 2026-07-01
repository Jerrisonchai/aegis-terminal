import type { Metadata, Viewport } from 'next';
import { Shell } from '@/components/shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'AEGIS Terminal — Trading Command Center',
  description: 'Automated Execution & Global Indicator System',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#020617',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg text-foreground">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
