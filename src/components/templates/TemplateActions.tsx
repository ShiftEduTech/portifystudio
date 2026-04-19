'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Download, Rocket, X, Lock } from 'lucide-react';

const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-4.51-2-7-2" />
  </svg>
);
import { Template } from '@/data/templates';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { trackTemplateDownload } from '@/lib/downloadTracking';

interface TemplateActionsProps {
  template: Template;
}

export default function TemplateActions({ template }: TemplateActionsProps) {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const isLoggedIn = !!user;
  const plan = (userData?.plan || '').toLowerCase();
  const role = (userData?.role || '').toLowerCase();
  const isPremiumUser = plan === 'premium' || plan === 'pro';
  const isFreeTemplate = (template.accessLevel || 'free').toLowerCase() === 'free';
  const hasPremiumAccess = isPremiumUser || ['admin', 'administrator', 'superadmin'].includes(role);

  const handleAction = async (actionType: 'download' | 'git') => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!isFreeTemplate && !hasPremiumAccess) {
      setShowUpgradeModal(true);
      return;
    }

    // Performance action logic continues...

    // Perform action
    if (actionType === 'download') {
      try {
        await trackTemplateDownload(
          user.uid,
          template.id,
          template.title,
          template.thumbnails?.[0] || template.images?.[0] || ''
        );
      } catch {
        // Avoid blocking download when analytics write fails.
      }
      const downloadUrl = (template as any).zipUrl || template.liveLink;
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
        toast.success(`Started download for ${template.title}`);
      } else {
        toast.error('Download link not available yet.');
      }
    } else if (actionType === 'git' && template.gitRepo) {
      window.open(template.gitRepo, '_blank');
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full mt-8">
        {/* Live Preview */}
        <motion.a
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          href={template.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-500 bg-[length:200%_auto] animate-gradient text-white font-bold py-4 px-8 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300"
        >
          <ExternalLink className="w-5 h-5" />
          Live Preview
        </motion.a>

        {/* Git Repository Access */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAction('git')}
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-8 rounded-2xl backdrop-blur-md transition-all duration-300 group"
        >
          {isFreeTemplate || isPremiumUser ? (
             <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          ) : (
             <Lock className="w-5 h-5 text-amber-500" />
          )}
          <span className="text-gray-300 group-hover:text-white transition-colors">Git Repository Access</span>
          {(!isFreeTemplate && !isPremiumUser) && (
            <span className="ml-1 px-2 py-0.5 text-[8px] bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/30 font-black uppercase tracking-widest">Pro</span>
          )}
        </motion.button>

        {/* Zip-File Download */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAction('download')}
          className="w-full flex items-center justify-center gap-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/5 group"
        >
          <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
          Zip-File Download
        </motion.button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showLoginModal && (
          <ModalWrapper onClose={() => setShowLoginModal(false)}>
            <div className="text-center">
              <Lock className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Authentication Required</h3>
              <p className="text-gray-400 mb-6">You must be logged in to use or download templates. Join Portify Studio today!</p>
              <div className="flex gap-4">
                <button onClick={() => router.push('/login')} className="flex-1 bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-xl transition-colors">
                  Login
                </button>
                <button onClick={() => router.push('/signup')} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-colors">
                  Sign Up
                </button>
              </div>
            </div>
          </ModalWrapper>
        )}

        {showUpgradeModal && (
          <ModalWrapper onClose={() => setShowUpgradeModal(false)}>
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 mb-4">
                <Rocket className="w-10 h-10 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Upgrade to Premium</h3>
              <p className="text-gray-400 mb-6">This feature requires a premium subscription. Unlock all templates, direct Git access, and priority support.</p>
              <button
                onClick={() => alert('Redirecting to Stripe checkout...')}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
              >
                Upgrade Now - $15/mo
              </button>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>
    </>
  );
}

// Simple Modal Wrapper inline for convenience
function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </motion.div>
    </div>
  );
}
