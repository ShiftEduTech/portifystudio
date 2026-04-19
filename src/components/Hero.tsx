'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Users, Zap, Code2, Globe, Layers } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TECH_BADGES = [
  { label: 'React',      color: '#61DAFB', bg: 'rgba(97,218,251,0.12)'  },
  { label: 'Next.js',   color: '#ffffff', bg: 'rgba(255,255,255,0.08)' },
  { label: 'Java',      color: '#f89820', bg: 'rgba(248,152,32,0.12)'  },
  { label: 'Python',    color: '#4B8BBE', bg: 'rgba(75,139,190,0.12)'  },
  { label: 'MERN',      color: '#4DB33D', bg: 'rgba(77,179,61,0.12)'   },
  { label: 'DevOps',    color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  { label: 'AWS',       color: '#FF9900', bg: 'rgba(255,153,0,0.12)'   },
  { label: 'TypeScript',color: '#3178C6', bg: 'rgba(49,120,198,0.12)'  },
];

const STATS = [
  { icon: Users,  val: 12000, suffix: '+', label: 'Developers' },
  { icon: Star,   val: 50,    suffix: '+', label: 'Templates'  },
  { icon: Zap,    val: 98,    suffix: '%', label: 'Satisfaction'},
  { icon: Globe,  val: 40,    suffix: '+', label: 'Countries'  },
];

function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let frame = 0;
    const totalFrames = 60;
    const timer = setInterval(() => {
      frame++;
      setCount(Math.min(Math.round((frame / totalFrames) * to), to));
      if (frame >= totalFrames) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [to]);

  return <>{count}{suffix}</>;
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16">
      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center text-center">

        {/* Live badge */}
        <div
          className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-md"
          style={{
            background: 'rgba(99,102,241,0.1)',
            borderColor: 'rgba(99,102,241,0.3)',
            boxShadow: '0 0 20px rgba(99,102,241,0.15)',
          }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: '#818cf8' }}
            />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#6366f1' }} />
          </span>
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#818cf8' }} />
          <span className="text-sm font-medium" style={{ color: '#a5b4fc' }}>
            50+ Premium Portfolio Templates
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-6xl lg:text-[82px] font-extrabold tracking-tight leading-[1.1] sm:leading-[1.05] text-white mb-6 px-2"
          style={{ maxWidth: '950px' }}
        >
          Launch Your{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #60a5fa 100%)' }}
          >
            Dream Portfolio
          </span>
          <br className="hidden sm:block" />{' '}
          in{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #f472b6 0%, #fb923c 60%, #facc15 100%)' }}
          >
            Minutes
          </span>
          , Not Weeks.
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed mb-10">
          Choose from industry-focused templates built for{' '}
          <span className="text-white font-medium">Java, Python, MERN, DevOps</span>, and more.
          Stand out to recruiters with a portfolio that actually gets you hired.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
          <Link
            href="/templates"
            className="group relative px-8 py-4 rounded-2xl text-white font-bold text-base overflow-hidden transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6)',
              boxShadow: '0 0 0 rgba(99,102,241,0)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 40px rgba(99,102,241,0.5)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 0 rgba(99,102,241,0)')}
          >
            <span className="flex items-center gap-2">
              Start Building Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Link>

          <Link
            href="/templates"
            className="group px-8 py-4 rounded-2xl font-bold text-base text-white border backdrop-blur-sm transition-all duration-300 hover:scale-[1.03]"
            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <span className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-400" />
              Browse Templates
            </span>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
          {STATS.map(({ icon: Icon, val, suffix, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <Icon className="w-4 h-4" style={{ color: '#818cf8' }} />
                <span className="text-2xl font-extrabold text-white tabular-nums">
                  {mounted ? <AnimatedCounter to={val} suffix={suffix} /> : `${val}${suffix}`}
                </span>
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-16 max-w-2xl">
          {TECH_BADGES.map((b) => (
            <span
              key={b.label}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full border backdrop-blur-sm hover:scale-105 transition-transform cursor-default"
              style={{ color: b.color, background: b.bg, borderColor: `${b.color}40` }}
            >
              {b.label}
            </span>
          ))}
        </div>

        {/* Bento Preview */}
        <div className="relative w-full" style={{ maxWidth: '900px' }}>
          <div
            className="absolute inset-0 rounded-3xl blur-3xl"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1), rgba(59,130,246,0.2))' }}
          />
          <div
            className="relative grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 p-3 rounded-3xl border backdrop-blur-xl shadow-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.025)',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
          >
            {/* Card 1 – code preview (spans 2 rows) */}
            <div
              className="rounded-2xl border p-5 flex flex-col justify-between row-span-2 transition-colors duration-300 hover:border-indigo-500/40"
              style={{ background: 'linear-gradient(135deg,rgba(67,56,202,0.3),rgba(109,40,217,0.3))', borderColor: 'rgba(255,255,255,0.08)', minHeight: 190 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-gray-500 font-mono">portfolio.tsx</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                <div style={{ color: '#818cf8' }}>{'<HeroSection'}</div>
                <div className="text-gray-400 ml-4">{'name="Alex Johnson"'}</div>
                <div style={{ color: '#a78bfa' }} className="ml-4">{'role="Full Stack Dev"'}</div>
                <div style={{ color: '#60a5fa' }} className="ml-4">{'stack={["React","Node","AWS"]}'}</div>
                <div style={{ color: '#818cf8' }}>{'/>)'}</div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Code2 className="w-4 h-4" style={{ color: '#818cf8' }} />
                <span className="text-xs text-gray-400">MERN Stack Template</span>
                <span
                  className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full border"
                  style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.2)' }}
                >
                  Free
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="rounded-2xl border p-4 flex flex-col justify-between transition-colors duration-300 hover:border-pink-500/40"
              style={{ background: 'linear-gradient(135deg,rgba(131,24,67,0.3),rgba(153,27,27,0.3))', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="text-2xl font-extrabold text-white">Java</div>
              <div className="text-xs text-gray-400">Spring Boot Portfolio</div>
              <div className="mt-2 h-1 rounded-full w-3/4" style={{ background: 'linear-gradient(90deg,#ec4899,#f97316)' }} />
            </div>

            {/* Card 3 */}
            <div
              className="rounded-2xl border p-4 flex flex-col justify-between transition-colors duration-300 hover:border-cyan-500/40"
              style={{ background: 'linear-gradient(135deg,rgba(8,51,68,0.4),rgba(30,58,138,0.4))', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="text-2xl font-extrabold text-white">DevOps</div>
              <div className="text-xs text-gray-400">CI/CD Showcase</div>
              <div className="mt-2 h-1 rounded-full w-1/2" style={{ background: 'linear-gradient(90deg,#06b6d4,#3b82f6)' }} />
            </div>

            {/* Card 4 – full width footer */}
              <div
                className="rounded-2xl border p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                >
                  P
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Portify Studio</div>
                  <div className="text-[11px] text-gray-500">Your portfolio, deployed in 60 seconds.</div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-semibold border"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', borderColor: 'rgba(99,102,241,0.2)' }}
                >
                  One-click deploy
                </span>
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-semibold border"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', borderColor: 'rgba(139,92,246,0.2)' }}
                >
                  No code needed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust line */}
        <p className="mt-8 text-xs text-gray-600 tracking-wide">
          No credit card required · Free forever plan · Cancel anytime
        </p>
      </div>
    </section>
  );
}
