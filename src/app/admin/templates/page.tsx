'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { getTemplates, AdminTemplate, updateTemplate } from '@/lib/admin';
import { Search, Edit2, Trash2, ExternalLink, Download, Plus, Filter, ArrowDownWideNarrow, Star, CheckCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const CATEGORIES = ['All', 'MERN', 'Java', 'Python', 'DevOps', 'Next.js', 'AWS', 'React'];

// Demo fallback
const DEMO: any[] = [
  { id: '1', title: 'MERN Developer Portfolio', category: 'MERN', downloadCount: 842, liveUrl: '#', createdAt: { seconds: 1712000000 } },
  { id: '2', title: 'Java Spring Boot Portfolio', category: 'Java', downloadCount: 671, liveUrl: '#', createdAt: { seconds: 1711800000 } },
  { id: '3', title: 'DevOps Engineer Showcase', category: 'DevOps', downloadCount: 558, liveUrl: '#', createdAt: { seconds: 1711600000 } },
  { id: '4', title: 'Python Data Scientist', category: 'Python', downloadCount: 443, liveUrl: '#', createdAt: { seconds: 1711400000 } },
  { id: '5', title: 'Full Stack Next.js Portfolio', category: 'Next.js', downloadCount: 389, liveUrl: '#', createdAt: { seconds: 1711200000 } },
  { id: '6', title: 'AWS Cloud Portfolio', category: 'AWS', downloadCount: 312, liveUrl: '#', createdAt: { seconds: 1711000000 } },
];

export default function AdminTemplates() {
  const { userData } = useAuth();
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [filtered, setFiltered] = useState<AdminTemplate[]>([]);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'downloads' | 'latest'>('downloads');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data.length ? data : DEMO);
    } catch {
      setTemplates(DEMO);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus?: string) => {
    if (updatingId) return;
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    setUpdatingId(id);
    try {
      await updateTemplate(id, { status: newStatus as any }, userData?.uid, userData?.email);
      setTemplates(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
      toast.success(`Template ${newStatus === 'published' ? 'Published' : 'set to Draft'}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured?: boolean) => {
    if (updatingId) return;
    const newFeatured = !currentFeatured;
    setUpdatingId(id);
    try {
      await updateTemplate(id, { isFeatured: newFeatured }, userData?.uid, userData?.email);
      setTemplates(prev => prev.map(t => t.id === id ? { ...t, isFeatured: newFeatured } : t));
      toast.success(newFeatured ? 'Pinned to Featured' : 'Removed from Featured');
    } catch {
      toast.error('Failed to update featured status');
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let list = [...templates];
    if (cat !== 'All') list = list.filter(t => t.category === cat);
    if (search) list = list.filter(t => t.title?.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'downloads') {
      list.sort((a, b) => (b.downloadCount ?? 0) - (a.downloadCount ?? 0));
    } else {
      list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
    }
    setFiltered(list);
  }, [templates, search, cat, sortBy]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'templates', id));
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast.success('Template deleted');
    } catch {
      toast.error('Delete failed — demo mode');
      setTemplates(prev => prev.filter(t => t.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const Skeleton = () => (
    <tr>
      {Array(5).fill(0).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="animate-pulse h-4 rounded-lg bg-gray-200 dark:bg-white/[0.05]" />
        </td>
      ))}
    </tr>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Templates</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} templates found</p>
        </div>
        <Link href="/admin/upload"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-500 shadow-md transition-all hover:opacity-90">
          <Plus className="w-4 h-4" />
          New Template
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] flex-1">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="bg-transparent text-sm text-gray-900 placeholder-gray-500 dark:text-gray-300 dark:placeholder-gray-600 outline-none flex-1"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                cat === c
                  ? 'text-white bg-indigo-500 shadow-md'
                  : 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 dark:bg-transparent dark:text-gray-500 dark:border-white/[0.07] dark:hover:border-white/15 dark:hover:text-gray-300'
              }`}
            >
              {c}
            </button>
          ))}
          <button
            onClick={() => setSortBy(sortBy === 'downloads' ? 'latest' : 'downloads')}
            className="ml-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border border-gray-200 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 dark:border-white/[0.07] dark:text-gray-400 dark:bg-transparent dark:hover:text-gray-200 dark:hover:border-white/20"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowDownWideNarrow className="w-3.5 h-3.5" />
              Sort: {sortBy === 'downloads' ? 'Downloads' : 'Latest'}
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/[0.06]">
                {['Template', 'Category', 'Status', 'Downloads', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(5).fill(0).map((_, i) => <Skeleton key={i} />)
                : filtered.length === 0
                ? (
                  <tr><td colSpan={5} className="py-16 text-center text-gray-600 text-sm">No templates found.</td></tr>
                )
                : filtered.map((t, i) => (
                  <tr key={t.id}
                    className="border-b transition-colors hover:bg-gray-50 border-gray-100 dark:hover:bg-white/[0.02] dark:border-white/[0.04]">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl shrink-0 overflow-hidden border border-gray-200 dark:border-white/10"
                          style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))' }}>
                          {t.images?.[0] ? (
                            <img src={t.images[0]} alt={t.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-indigo-400 text-xs font-bold">
                              {i + 1}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{t.title}</span>
                            <button
                               onClick={() => handleToggleFeatured(t.id, t.isFeatured)}
                               disabled={!!updatingId}
                               className={`transition-colors h-fit ${t.isFeatured ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-700 hover:text-yellow-500/50'}`}
                            >
                              <Star className={`w-3 h-3 ${t.isFeatured ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          <div className="text-[10px] text-gray-400">Added {t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1000).toLocaleDateString() : '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                        <Download className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                        {(t.downloadCount ?? 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <button
                        onClick={() => handleToggleStatus(t.id, t.status)}
                        disabled={!!updatingId}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
                          t.status === 'draft'
                            ? 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-500'
                            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                        }`}
                      >
                        {t.status === 'draft' ? (
                          <><FileText className="w-3 h-3" /> Draft</>
                        ) : (
                          <><CheckCircle className="w-3 h-3" /> Published</>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {t.liveUrl && (
                          <a href={t.liveUrl} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <Link href={`/admin/upload?edit=${t.id}`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(t.id, t.title)}
                          disabled={deleting === t.id}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
