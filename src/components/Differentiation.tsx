'use client';

import { motion } from 'framer-motion';
import { X, Check, Timer, Zap, Layout, Smartphone, CreditCard } from 'lucide-react';

const comparison = [
  {
    feature: 'Deployment Time',
    traditional: 'Days of tedious coding',
    portify: 'Under 10 minutes',
    icon: Timer,
    color: 'blue'
  },
  {
    feature: 'Technical Knowledge',
    traditional: 'Mastering HTML/CSS/JS',
    portify: 'Zero coding required',
    icon: Zap,
    color: 'purple'
  },
  {
    feature: 'Design Precision',
    traditional: 'Struggling with CSS',
    portify: 'Industry-standard UI',
    icon: Layout,
    color: 'indigo'
  },
  {
    feature: 'Responsiveness',
    traditional: 'Manual media queries',
    portify: 'Adaptive by default',
    icon: Smartphone,
    color: 'emerald'
  },
  {
    feature: 'Total Cost',
    traditional: '$120+ / year (hosting)',
    portify: 'Professional & Free',
    icon: CreditCard,
    color: 'cyan'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    transition: { type: "spring", stiffness: 100 } as any
  }
};

export default function Differentiation() {
  return (
    <section className="relative bg-transparent py-24 sm:py-32 overflow-hidden" id="compare">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Competitive Advantage
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Maximum Impact</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Stop wrestling with code and start building your career. Portify Studio gives you the competitive edge from day one.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-4 max-w-5xl mx-auto"
        >
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 px-8 py-4 text-xs font-bold tracking-widest text-gray-500 uppercase">
            <div>Core Metric</div>
            <div className="text-center">Legacy Methods</div>
            <div className="text-center text-blue-400">Portify Studio</div>
          </div>

          {comparison.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className="group relative grid md:grid-cols-[1fr_1.5fr_1.5fr] items-center gap-4 bg-[#0A0A0A] p-6 md:p-8 rounded-3xl border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.02] transition-all duration-300"
            >
              {/* Feature info */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                </div>
                <span className="font-semibold text-white">{item.feature}</span>
              </div>

              {/* Traditional */}
              <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-gray-500 md:bg-transparent md:border-transparent">
                <X className="w-4 h-4 text-red-500/50" />
                <span className="text-sm font-medium">{item.traditional}</span>
              </div>

              {/* Portify */}
              <div className="relative group/accent overflow-hidden flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-100 shadow-[0_0_20px_-12px_rgba(59,130,246,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-white/5 to-transparent translate-x-[-100%] group-hover/accent:translate-x-[100%] transition-transform duration-1000"></div>
                <Check className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold tracking-tight">{item.portify}</span>
                <div className="absolute top-0 right-0 w-1 h-1 bg-blue-400 rounded-full m-2 animate-pulse"></div>
              </div>

              {/* Gradient trail for mobile separation */}
              <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer CTA Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 text-sm font-medium">
            Join 2,000+ developers who switched to <span className="text-white">Portify Studio</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
