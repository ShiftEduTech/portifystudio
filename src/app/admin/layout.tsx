import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin — Portify Studio',
  description: 'Portify Studio Admin Dashboard',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
