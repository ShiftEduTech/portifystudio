'use client';

import { motion } from 'framer-motion';
import { MousePointerClick, Palette, Rocket, Check, Edit3, LayoutTemplate } from 'lucide-react';

const steps = [
  {
    icon: LayoutTemplate,
    number: '01',
    title: 'Choose Your Template',
    description: 'Browse 50+ templates designed for your tech stack and experience level.',
    color: 'from-blue-500 to-indigo-500',
    shadow: 'shadow-blue-500/20',
    visual: (
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="w-full bg-white/5 rounded-lg border border-white/10 p-2 space-y-2">
          <div className="w-full h-12 bg-blue-500/20 rounded border border-blue-500/30"></div>
          <div className="flex gap-2">
            <div className="flex-1 h-8 bg-white/5 rounded"></div>
            <div className="flex-1 h-8 bg-white/5 rounded"></div>
          </div>
        </div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-2 right-2 p-1 bg-blue-500 rounded-lg shadow-lg"
        >
          <MousePointerClick className="w-4 h-4 text-white" />
        </motion.div>
      </div>
    )
  },
  {
    icon: Edit3,
    number: '02',
    title: 'Customize Content',
    description: 'Add your projects, skills, and experience. No coding needed.',
    color: 'from-purple-500 to-pink-500',
    shadow: 'shadow-purple-500/20',
    visual: (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30"></div>
            <div className="h-2 w-24 bg-white/10 rounded"></div>
          </div>
          <motion.div 
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-1 bg-purple-500/50 rounded"
          ></motion.div>
          <div className="h-2 w-full bg-white/5 rounded"></div>
        </div>
        <Palette className="absolute top-2 right-2 w-4 h-4 text-purple-400 opacity-50" />
      </div>
    )
  },
  {
    icon: Check,
    number: '03',
    title: 'Launch Instantly',
    description: 'Publish your portfolio instantly and share it with recruiters.',
    color: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/20',
    visual: (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30"
        >
          <Rocket className="w-8 h-8 text-white" />
        </motion.div>
        <div className="mt-4 flex gap-1">
          {[1,2,3].map(i => (
            <motion.div 
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-500"
            />
          ))}
        </div>
      </div>
    )
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80 } as any,
  },
};

export default function HowItWorks() {
  return (
    <section className="relative bg-transparent py-24 sm:py-32 overflow-hidden" id="how-it-works">
      {/* Dynamic Background Beam */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -rotate-12 blur-sm"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-semibold mb-8 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            How It Works
          </motion.div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tighter">
            Build Your Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500">In 3 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            From picking a design to going live, we've automated the hard parts. No Git, no hosting, no hassle.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-3 gap-8 relative"
        >
          {/* Animated SVG Path (Desktop only) */}
          <svg className="hidden lg:block absolute top-[140px] left-0 w-full h-[60px] pointer-events-none z-0 overflow-visible">
            <motion.path
              d="M 250 30 Q 500 30 500 30 Q 750 30 1000 30"
              fill="transparent"
              stroke="url(#gradient-line)"
              strokeWidth="2"
              strokeDasharray="8 12"
              initial={{ strokeDashoffset: 1000 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <defs>
              <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group p-1"
            >
              {/* Card Container with Glow */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${step.color} rounded-[32px] opacity-0 group-hover:opacity-20 transition-all duration-500 blur-xl ${step.shadow}`}></div>
              
              <div className="relative bg-[#0A0A0A] border border-white/[0.08] group-hover:border-white/[0.15] rounded-[30px] p-8 h-full transition-all duration-300">
                {/* Visual Preview Box */}
                <div className="h-40 w-full bg-[#050505] rounded-2xl border border-white/[0.05] mb-8 overflow-hidden">
                  {step.visual}
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors leading-none tracking-tighter">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {step.title}
                </h3>

                <p className="text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                  {step.description}
                </p>

                {/* Progress bar hint */}
                <div className="mt-8 flex items-center gap-3">
                   <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + (index * 0.2) }}
                        className={`h-full bg-gradient-to-r ${step.color}`}
                      />
                   </div>
                   <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">Complete</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Background Sparkles */}
        <div className="absolute top-[20%] left-[5%] w-2 h-2 bg-blue-500 rounded-full blur-[2px] animate-pulse"></div>
        <div className="absolute top-[40%] right-[10%] w-3 h-3 bg-purple-500 rounded-full blur-[3px] animate-pulse delay-700"></div>
        <div className="absolute bottom-[10%] left-[15%] w-2 h-2 bg-emerald-500 rounded-full blur-[2px] animate-pulse delay-1000"></div>
      </div>
    </section>
  );
}
