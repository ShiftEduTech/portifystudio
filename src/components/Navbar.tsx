'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Templates', href: '/templates' },
  { name: 'Developer Guide', href: '/developer-guide' },
  { name: 'About', href: '/about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      toast.error('Error logging out');
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'py-2'
          : 'py-4'
          }`}
      >
        {/* ── Floating pill container ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between rounded-full px-5 h-14 transition-all duration-500 ${scrolled
              ? 'bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.5),0_0_0_1px_rgba(99,102,241,0.05)]'
              : 'bg-transparent border-transparent'
              }`}
          >
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center shrink-0 hover:opacity-90 transition-opacity">
              <img
                src="/PortifyStudio_logo.png"
                alt="Portify Studio"
                className="h-10 w-auto md:h-12 object-contain drop-shadow-md"
              />
            </Link>

            {/* ── Desktop nav links ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 ${active
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/10"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
              {user && (
                <Link
                  href="/dashboard"
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 ${pathname === '/dashboard'
                    ? 'text-indigo-400'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {pathname === '/dashboard' && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <LayoutDashboard className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">Dashboard</span>
                </Link>
              )}
            </div>

            {/* ── Desktop CTA ── */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                      {user.email?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <span className="text-xs text-gray-400 max-w-[120px] truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl text-[13px] font-semibold text-gray-400 hover:text-white transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="relative px-6 py-2.5 rounded-full text-[13px] font-bold text-white group shadow-lg shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.05] hover:shadow-indigo-500/30 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative">Get Started Free</span>
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
      >
        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setIsOpen(false)}
        />

        {/* panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-[#0d0d14] border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <span className="text-sm font-semibold text-white">Navigation</span>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* links */}
          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${active
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${pathname === '/dashboard'
                  ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* footer */}
          <div className="px-4 py-5 border-t border-white/10 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.email?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="text-sm text-gray-300 truncate flex-1">{user.email}</span>
                </div>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
