'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Download, Eye, Users, ArrowUpRight } from 'lucide-react';
import { buildRecentDailyDownloads, getDownloads, getTemplates, getUsers } from '@/lib/admin';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#13131a] text-xs shadow-xl">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-300 capitalize">{p.name}:</span>
          <span className="text-gray-900 dark:text-white font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

function MetricCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.025] p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-[10px] text-green-400 flex items-center gap-0.5 mt-0.5">
          <ArrowUpRight className="w-2.5 h-2.5" />{sub}
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{ day: string; downloads: number; views: number }[]>([]);
  const [topTemplates, setTopTemplates] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    downloads: 0,
    views: 0,
    uniqueDownloaders: 0,
    avgConversion: 0,
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const load = async () => {
      try {
        const [templates, users, downloads] = await Promise.all([
          getTemplates(),
          getUsers(),
          getDownloads(1000),
        ]);

        const dailyDownloads = buildRecentDailyDownloads(downloads, 7);
        const byTemplate = new Map<string, number>();
        downloads.forEach((d) => {
          byTemplate.set(d.templateId, (byTemplate.get(d.templateId) || 0) + 1);
        });

        const performance = templates
          .map((t) => {
            const dls = t.downloadCount ?? byTemplate.get(t.id) ?? 0;
            const views = t.viewCount ?? Math.max(dls * 5, 1);
            return {
              id: t.id,
              name: t.title,
              downloads: dls,
              views,
              conversion: Number(((dls / views) * 100).toFixed(1)),
            };
          })
          .sort((a, b) => b.downloads - a.downloads);

        const uniqueDownloaders = new Set(downloads.map((d) => d.userId)).size;
        const totalDownloads = performance.reduce((sum, p) => sum + p.downloads, 0);
        const totalViews = performance.reduce((sum, p) => sum + p.views, 0);
        const avgConversion = totalViews ? Number(((totalDownloads / totalViews) * 100).toFixed(1)) : 0;

        setTopTemplates(performance.slice(0, 8));
        setChartData(dailyDownloads.map((d) => ({ ...d, views: d.downloads * 4 })));
        setMetrics({
          downloads: totalDownloads,
          views: totalViews,
          uniqueDownloaders: uniqueDownloaders || users.length,
          avgConversion,
        });

        const userMap = new Map(users.map((u) => [u.uid, u.email || u.name || u.fullName || 'Unknown user']));
        const templateMap = new Map(templates.map((t) => [t.id, t.title]));
        setUserActivity(
          downloads.slice(0, 8).map((d) => ({
            user: userMap.get(d.userId) || d.userId,
            template: templateMap.get(d.templateId) || d.templateId,
            date: d.downloadedAt?.toDate().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }) || 'N/A',
          })),
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform performance and download trends.</p>
      </div>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Download} label="Total Downloads" value={metrics.downloads.toLocaleString()} sub="all-time" color="#6366f1" />
        <MetricCard icon={Eye} label="Total Template Views" value={metrics.views.toLocaleString()} sub="all-time" color="#8b5cf6" />
        <MetricCard icon={Users} label="Unique Downloaders" value={metrics.uniqueDownloaders.toLocaleString()} sub="all-time" color="#3b82f6" />
        <MetricCard icon={TrendingUp} label="Avg. Conversion" value={`${metrics.avgConversion}%`} sub="views -> downloads" color="#10b981" />
      </div>

      {/* Downloads + Views chart */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.025] p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Downloads vs Views — This Week</div>
            <div className="text-xs text-gray-500 mt-0.5">Daily activity breakdown</div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-gray-400"><span className="w-3 h-1 rounded-full bg-indigo-500 inline-block" />Downloads</span>
            <span className="flex items-center gap-1.5 text-gray-400"><span className="w-3 h-1 rounded-full bg-violet-400 inline-block" />Views</span>
          </div>
        </div>
        {mounted && (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="dlG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="vwG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="downloads" stroke="#6366f1" strokeWidth={2} fill="url(#dlG)" dot={false} />
              <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2} fill="url(#vwG)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-5 rounded-2xl border border-gray-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.025] p-5">
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Template Performance</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/[0.06]">
                  {['Template', 'Downloads', 'Views', 'Conversion'].map(h => (
                    <th key={h} className="pb-3 text-left text-gray-500 font-semibold uppercase tracking-wider pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(loading ? [] : topTemplates).map((t, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-white/[0.04]">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 w-4">{i + 1}</span>
                        <span className="text-gray-900 dark:text-gray-200 font-medium">{t.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-bold text-gray-900 dark:text-white">{t.downloads.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{t.views.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                        {t.conversion}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent user activity */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.025] p-5">
        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Download Activity</div>
        <div className="space-y-3">
          {userActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-4 py-2.5 border-b border-gray-100 dark:border-white/[0.05] last:border-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                {a.user[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{a.user}</div>
                <div className="text-xs text-gray-500 dark:text-gray-600">downloaded <span className="text-indigo-500 dark:text-indigo-400">{a.template}</span></div>
              </div>
              <div className="text-xs text-gray-600 shrink-0">{a.date}</div>
              <Download className="w-3.5 h-3.5 text-gray-600 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
