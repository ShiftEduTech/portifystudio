'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  getCountFromServer,
  Timestamp 
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Download, Plus, ArrowRight, Zap, Crown, User, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface DownloadRecord {
  id: string;
  templateId: string;
  templateTitle: string;
  templateImage: string;
  downloadedAt: Timestamp;
}

export default function DashboardPage() {
  const { user, userData } = useAuth();
  const router = useRouter();

  const [totalDownloads, setTotalDownloads] = useState<number>(0);
  const [recentDownloads, setRecentDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const downloadsRef = collection(db, 'downloads');
        
        // 1. Fetch Total Count
        const countQuery = query(downloadsRef, where('userId', '==', user.uid));
        const countSnapshot = await getCountFromServer(countQuery);
        setTotalDownloads(countSnapshot.data().count);

        // 2. Fetch Recent Downloads
        const recentQuery = query(
          downloadsRef, 
          where('userId', '==', user.uid),
          orderBy('downloadedAt', 'desc'),
          limit(5)
        );
        const recentSnapshot = await getDocs(recentQuery);
        const records = recentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as DownloadRecord));
        
        setRecentDownloads(records);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const plan = (userData?.plan || '').toLowerCase();
  const role = (userData?.role || '').toLowerCase();
  const isPremium = plan === 'premium' || plan === 'pro' || ['admin', 'administrator', 'superadmin'].includes(role);

  const formatTimeAgo = (timestamp: Timestamp) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((new Date().getTime() - timestamp.toDate().getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-transparent text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-[2px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-2xl flex items-center justify-center text-3xl font-bold text-white">
                  {userData?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  Welcome back,
                </h1>
                <p className="text-xl text-indigo-400 font-medium mt-1">
                  {userData?.fullName || user?.email?.split('@')[0]}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  {isPremium ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase rounded-full tracking-wider shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                      <Crown className="w-3.5 h-3.5" /> PRO Member
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-500/10 border border-gray-500/20 text-gray-400 text-xs font-bold uppercase rounded-full tracking-wider">
                      <User className="w-3.5 h-3.5" /> Free Tier
                    </span>
                  )}
                  <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-md">{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors shadow-lg"
              >
                Sign Out
              </button>
            </div>
          </div>



          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Quick Actions & Recent */}
            <div className="lg:col-span-2 space-y-8">
              {/* Actions */}
              <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/templates" className="group p-6 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">New Portfolio</h3>
                    <p className="text-sm text-gray-400">Create a new stunning portfolio from our premium templates.</p>
                  </Link>
                  <Link href="/developer-guide" className="group p-6 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Developer Guide</h3>
                    <p className="text-sm text-gray-400">Learn how to customize and deploy your portfolio quickly.</p>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md min-h-[300px] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Downloads</h2>
                  <Link href="/templates" className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {loading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  </div>
                ) : recentDownloads.length > 0 ? (
                  <div className="space-y-4">
                    {recentDownloads.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden bg-zinc-800">
                             {item.templateImage ? (
                               <img src={item.templateImage} alt="" className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                             )}
                          </div>
                          <div>
                            <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{item.templateTitle}</h4>
                            <p className="text-xs text-gray-500">Downloaded {formatTimeAgo(item.downloadedAt)}</p>
                          </div>
                        </div>
                        <Link 
                          href={`/templates`}
                          className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                     <Download className="w-10 h-10 text-gray-600" />
                     <p className="text-sm text-gray-500 max-w-[200px]">No templates downloaded yet. Start building today!</p>
                   </div>
                )}
              </div>
            </div>

            {/* Sidebar / Upgrade CTA */}
            <div className="space-y-8">

              {/* Highlight Stat */}
              <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md group hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300">
                    <Download className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">All time</span>
                </div>
                <h3 className="text-lg text-gray-400 font-medium">Total Downloads</h3>
                <p className="text-6xl font-black text-white mt-2 tracking-tight">
                  {loading ? '...' : totalDownloads.toLocaleString()}
                </p>
              </div>
              {!isPremium && (
                <div className="bg-gradient-to-b from-indigo-600 to-purple-900 border border-indigo-400/30 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-yellow-400 mb-6 shadow-xl">
                      <Crown className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Upgrade to PRO</h2>
                    <p className="text-indigo-100/80 text-sm leading-relaxed mb-8">
                      Unlock unlimited access to all premium templates, exclusive animations, and priority support. Stand out from the crowd!
                    </p>
                    <button className="w-full py-4 bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl transition-colors shadow-xl shadow-indigo-900/50 flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" /> View Pro Plans
                    </button>
                  </div>
                </div>
              )}


            </div>

          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
