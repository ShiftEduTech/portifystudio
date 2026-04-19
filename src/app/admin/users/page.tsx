'use client';

import { useEffect, useState } from 'react';
import { getUsers, AdminUser, updateUserRole, updateUserStatus, updateUserPlan } from '@/lib/admin';
import { Search, User, Crown, Filter, RefreshCcw, MoreVertical, Shield, ShieldAlert, ShieldCheck, Ban, CheckCircle2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function AdminUsers() {
  const { userData } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filtered, setFiltered] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    if (updatingId) return;
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    if (!confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'activate'} this user?`)) return;

    setUpdatingId(user.uid);
    try {
      await updateUserStatus(user.uid, newStatus as any, userData?.uid, userData?.email);
      setUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, status: newStatus } : u));
      toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'activated'}`);
    } catch (error: any) {
      console.error('Status update failed:', error.message || error);
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
      setActiveMenu(null);
    }
  };

  const handleChangeRole = async (uid: string, newRole: string) => {
    if (updatingId) return;
    setUpdatingId(uid);
    try {
      await updateUserRole(uid, newRole, userData?.uid, userData?.email);
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (error: any) {
      console.error('Role update failed:', error.message || error);
      toast.error(error.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
      setActiveMenu(null);
    }
  };

  const handleChangePlan = async (uid: string, newPlan: string) => {
    if (updatingId) return;
    setUpdatingId(uid);
    try {
      await updateUserPlan(uid, newPlan, userData?.uid, userData?.email);
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, plan: newPlan } : u));
      toast.success(`Plan updated to ${newPlan}`);
    } catch (error: any) {
      console.error('Plan update failed:', error.message || error);
      toast.error(error.message || 'Failed to update plan');
    } finally {
      setUpdatingId(null);
      setActiveMenu(null);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let list = [...users];
    if (roleFilter !== 'all') {
      list = list.filter(u => {
        const p = (u.plan || '').toLowerCase();
        const r = (u.role || '').toLowerCase();
        return r === roleFilter || p === roleFilter || (roleFilter === 'free' && (p === '' || p === 'free'));
      });
    }
    if (search) list = list.filter(u =>
      (u.fullName || u.name || '')?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [users, search, roleFilter]);

  const premiumCount = users.filter(u => {
    const p = (u.plan || '').toLowerCase();
    return p === 'premium' || p === 'pro';
  }).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} total · {premiumCount} premium</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={load}
            disabled={loading}
            className="p-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.08] transition-all disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          {/* Mini stats */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 text-sm text-center">
              <div className="text-gray-900 dark:text-white font-bold">{users.length}</div>
              <div className="text-[10px] text-indigo-400 uppercase tracking-wide">Total</div>
            </div>
            <div className="px-4 py-2 rounded-xl border border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/10 text-sm text-center">
              <div className="text-yellow-600 dark:text-yellow-400 font-bold">{premiumCount}</div>
              <div className="text-[10px] text-yellow-600 uppercase tracking-wide">Premium</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] flex-1">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="bg-transparent text-sm text-gray-900 placeholder-gray-500 dark:text-gray-300 dark:placeholder-gray-600 outline-none flex-1" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          {['all', 'user', 'admin', 'free', 'premium', 'pro'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                roleFilter === r ? 'text-white bg-indigo-500 shadow-md' : 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 dark:bg-transparent dark:text-gray-500 dark:border-white/[0.07] dark:hover:text-gray-300'
              }`}>
              {r === 'all' ? 'All Users' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/[0.06]">
                {['User', 'Email', 'Role', 'Plan', 'Status', 'Joined', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-white/[0.04]">
                    {Array(7).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="animate-pulse h-4 rounded-lg bg-gray-200 dark:bg-white/[0.05]" /></td>
                    ))}
                  </tr>
                ))
                : filtered.length === 0
                ? <tr><td colSpan={7} className="py-16 text-center text-gray-600 text-sm">No users found.</td></tr>
                : filtered.map(u => (
                  <tr key={u.uid} className="border-b transition-colors hover:bg-gray-50 border-gray-100 dark:border-white/[0.04] dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                          {(u.fullName || u.email || 'U')[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{u.fullName || u.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                    <td className="px-4 py-4">
                      {u.role === 'admin' ? (
                        <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400">
                          <User className="w-3 h-3" /> User
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {(() => {
                        const p = (u.plan || '').toLowerCase();
                        if (p === 'pro') return (
                          <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                            <Zap className="w-3 h-3" /> Pro
                          </span>
                        );
                        if (p === 'premium') return (
                          <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                            <Crown className="w-3 h-3" /> Premium
                          </span>
                        );
                        return (
                          <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400">
                            <User className="w-3 h-3" /> Free
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-4">
                      {u.status === 'suspended' ? (
                        <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">
                          <Ban className="w-3 h-3" /> Suspended
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {u.createdAt?.seconds
                        ? new Date(u.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setActiveMenu(activeMenu === u.uid ? null : u.uid)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenu === u.uid && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#13131a] border border-gray-200 dark:border-white/10 shadow-xl z-20 overflow-hidden py-1.5">
                              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 mb-1">
                                Change Role
                              </div>
                              <button
                                onClick={() => handleChangeRole(u.uid, 'user')}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                              >
                                <User className="w-3.5 h-3.5" /> Normal User
                              </button>
                              <button
                                onClick={() => handleChangeRole(u.uid, 'admin')}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                              >
                                <Shield className="w-3.5 h-3.5 text-indigo-500" /> Administrator
                              </button>

                              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-y border-gray-100 dark:border-white/5 my-1">
                                Change Plan
                              </div>
                              <button
                                onClick={() => handleChangePlan(u.uid, 'free')}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                              >
                                <User className="w-3.5 h-3.5 text-gray-500" /> Free Plan
                              </button>
                              <button
                                onClick={() => handleChangePlan(u.uid, 'premium')}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                              >
                                <Crown className="w-3.5 h-3.5 text-yellow-500" /> Premium Plan
                              </button>
                              <button
                                onClick={() => handleChangePlan(u.uid, 'pro')}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                              >
                                <Zap className="w-3.5 h-3.5 text-purple-500" /> Pro Plan
                              </button>

                              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-y border-gray-100 dark:border-white/5 my-1">
                                Moderation
                              </div>
                              <button
                                onClick={() => handleToggleStatus(u)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                                  u.status === 'suspended'
                                    ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10'
                                    : 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10'
                                }`}
                              >
                                {u.status === 'suspended' ? (
                                  <>
                                    <ShieldCheck className="w-3.5 h-3.5" /> Activate User
                                  </>
                                ) : (
                                  <>
                                    <ShieldAlert className="w-3.5 h-3.5" /> Suspend User
                                  </>
                                )}
                              </button>
                            </div>
                          </>
                        )}
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
