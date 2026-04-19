'use client';

import { useEffect, useState } from 'react';
import { getAnnouncements, addAnnouncement, deleteAnnouncement, toggleAnnouncementActive, Announcement } from '@/lib/admin';
import { Megaphone, Plus, Trash2, Power, RefreshCcw, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function AnnouncementsPage() {
  const { userData } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    try {
      await addAnnouncement(message, type, userData?.uid, userData?.email);
      setMessage('');
      toast.success('Announcement published!');
      load();
    } catch (error) {
      toast.error('Failed to publish');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await deleteAnnouncement(id, userData?.uid, userData?.email);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast.success('Deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await toggleAnnouncementActive(id, !active, userData?.uid, userData?.email);
      setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, active: !active } : a));
      toast.success(!active ? 'Announcement enabled' : 'Announcement disabled');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-sm text-gray-500 mt-0.5">Broadcast messages to all users on the platform.</p>
        </div>
        <button onClick={load} className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400">
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1 space-y-4">
          <form onSubmit={handleAdd} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-500" /> New Broadcast
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your announcement here..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none h-24 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Banner Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['info', 'success', 'warning'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize border transition-all flex items-center justify-center gap-1.5 ${
                      type === t 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400'
                        : 'bg-transparent border-gray-200 text-gray-400 dark:border-white/10 hover:border-gray-300'
                    }`}
                  >
                    {t === 'info' && <Info className="w-3 h-3" />}
                    {t === 'success' && <CheckCircle className="w-3 h-3" />}
                    {t === 'warning' && <AlertTriangle className="w-3 h-3" />}
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Megaphone className="w-4 h-4" />
              Publish Broadcast
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl border border-gray-200 dark:border-white/10 animate-pulse bg-gray-100 dark:bg-white/5" />
            ))
          ) : announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 dark:bg-white/[0.01] rounded-[32px] border-2 border-dashed border-gray-200 dark:border-white/5 space-y-3">
              <Megaphone className="w-10 h-10 text-gray-300 dark:text-gray-800" />
              <div className="text-gray-500 text-sm font-medium">No active broadcasts</div>
            </div>
          ) : (
            announcements.map(a => (
              <div key={a.id} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                    a.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/5 dark:border-emerald-500/10 dark:text-emerald-400' :
                    a.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-500/5 dark:border-amber-500/10 dark:text-amber-400' :
                    'bg-sky-50 border-sky-100 text-sky-600 dark:bg-sky-500/5 dark:border-sky-500/10 dark:text-sky-400'
                  }`}>
                    {a.type}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(a.id, a.active)}
                      className={`p-1.5 rounded-lg transition-all ${a.active ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'text-gray-400 bg-gray-50 dark:bg-white/5'}`}
                      title={a.active ? 'Disable' : 'Enable'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{a.message}</p>
                <div className="text-[10px] text-gray-400 font-medium">Created on {a.createdAt?.toDate().toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
