'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Layers, Upload, Users, BarChart3,
  Bell, Search, LogOut, ChevronRight, Menu, X, Zap, History, Megaphone
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV = [
  { label: 'Dashboard',       href: '/admin',              icon: LayoutDashboard },
  { label: 'Templates',       href: '/admin/templates',    icon: Layers          },
  { label: 'Upload Template', href: '/admin/upload',       icon: Upload          },
  { label: 'Users',           href: '/admin/users',        icon: Users           },
  { label: 'Analytics',       href: '/admin/analytics',    icon: BarChart3       },
  { label: 'Announcements',   href: '/admin/announcements',icon: Megaphone       },
  { label: 'Audit Logs',      href: '/admin/logs',         icon: History         },
];

const DEFAULT_ADMIN_EMAILS = ['portifystudio@gmail.com'];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, userData, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const normalizedEmail = (user?.email ?? '').trim().toLowerCase();
  const envAdminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const adminEmails = new Set([...DEFAULT_ADMIN_EMAILS, ...envAdminEmails].map((email) => email.toLowerCase()));
  const normalizedRole = String(userData?.role ?? '').trim().toLowerCase();
  const isAdminRole = normalizedRole === 'admin' || normalizedRole === 'administrator' || normalizedRole === 'superadmin';
  const isAdmin = !!user && (adminEmails.has(normalizedEmail) || isAdminRole);

  // Admin guard
  useEffect(() => {
    if (!isLoading) {
      if (!isAdmin) {
        toast.error('Unauthorized Access. Admins only.');
        router.replace('/dashboard');
      }
    }
  }, [isLoading, isAdmin, router]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0B0F]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-gray-400 text-sm">Verifying access...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-200 dark:border-white/[0.06]">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          <Zap className="w-4 h-4 text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">Portify Studio</div>
            <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest">Admin</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileSidebar(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'text-gray-900 dark:text-white bg-indigo-50/50 dark:bg-transparent'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-white/[0.04]'
              }`}
              style={active ? {
                background: 'var(--active-bg, linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.05)))',
                borderLeft: '2px solid #6366f1',
              } : {}}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-600 dark:group-hover:text-gray-400'}`} />
              {sidebarOpen && <span>{label}</span>}
              {sidebarOpen && active && <ChevronRight className="ml-auto w-3.5 h-3.5 text-indigo-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-white/[0.06]">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-100/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] ${!sidebarOpen ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            {user?.email?.[0]?.toUpperCase() ?? 'A'}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user?.email}</div>
              <div className="text-[10px] text-indigo-400">Administrator</div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ${!sidebarOpen ? 'justify-center' : ''}`}
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {sidebarOpen && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0B0B0F]">

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col shrink-0 border-r border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.015] backdrop-blur-xl transition-all duration-300"
        style={{
          width: sidebarOpen ? 240 : 72,
        }}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-0 z-10 hidden lg:flex"
          style={{ left: sidebarOpen ? 228 : 60 }}
          title="Toggle sidebar"
        >
        </button>
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} />
          <aside className="relative w-72 border-r border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-[#0B0B0F] overflow-y-auto">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header
          className="shrink-0 h-16 flex items-center gap-4 px-6 border-b border-gray-200 dark:border-white/[0.06] bg-gray-50/80 dark:bg-[#0B0B0F]/80 backdrop-blur-xl z-10"
        >
          <button
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
            onClick={() => setMobileSidebar(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-gray-500 dark:text-gray-600">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-700" />
            <span className="text-gray-900 dark:text-gray-300 font-medium">
              {NAV.find(n => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label ?? 'Dashboard'}
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm">
            <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            <input
              placeholder="Search..."
              className="bg-transparent text-gray-900 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 outline-none w-36 text-xs"
            />
          </div>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Bell */}
          <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/[0.05] transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </button>

          {/* Toggle sidebar desktop */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/[0.05] transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
