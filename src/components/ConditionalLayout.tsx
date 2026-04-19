'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    if (!isAdmin) {
      window.addEventListener('mousemove', handleMouse);
    }
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [isAdmin]);

  if (isAdmin) {
    // Admin uses its own layout — no navbar/footer
    return <>{children}</>;
  }

  return (
    <div className="dark">
      <div className="bg-[#030308] text-white min-h-screen selection:bg-indigo-500/30 relative overflow-x-hidden">
        {/* Noise texture */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Mouse spotlight */}
        {mounted && (
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,0.07), transparent 70%)`,
            }}
          />
        )}

        {/* Background glow orbs */}
        <div aria-hidden className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
          <div
            className="absolute rounded-full"
            style={{
              top: '-10%', left: '-5%',
              width: 600, height: 600,
              background: 'rgba(79,70,229,0.22)',
              filter: 'blur(120px)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: '-10%', right: '-5%',
              width: 500, height: 500,
              background: 'rgba(124,58,237,0.20)',
              filter: 'blur(120px)',
            }}
          />
        </div>

        {/* Grid overlay */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
