'use client';

import { motion } from 'framer-motion';
import { Code2, Database, Layers, Server, User, Briefcase } from 'lucide-react';

const templates = [
  {
    icon: Code2,
    title: 'Java Developers',
    count: '12 Templates',
    color: 'from-orange-500/20 to-red-500/20',
    accent: 'bg-orange-500',
  },
  {
    icon: Database,
    title: 'Python & Data Science',
    count: '10 Templates',
    color: 'from-blue-500/20 to-cyan-500/20',
    accent: 'bg-blue-500',
  },
  {
    icon: Layers,
    title: 'MERN Stack',
    count: '8 Templates',
    color: 'from-green-500/20 to-emerald-500/20',
    accent: 'bg-green-500',
  },
  {
    icon: Server,
    title: 'DevOps Engineers',
    count: '7 Templates',
    color: 'from-purple-500/20 to-pink-500/20',
    accent: 'bg-purple-500',
  },
  {
    icon: User,
    title: 'Freshers',
    count: '6 Templates',
    color: 'from-yellow-500/20 to-orange-500/20',
    accent: 'bg-yellow-500',
  },
  {
    icon: Briefcase,
    title: 'Experienced Professionals',
    count: '7 Templates',
    color: 'from-indigo-500/20 to-blue-500/20',
    accent: 'bg-indigo-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
    } as any,
  },
};

export default function TemplateShowcase() {
  return (
    <section className="relative bg-transparent py-24 sm:py-32 overflow-hidden" id="templates">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-medium mb-6 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Browse Categories
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Templates for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Every Career Path</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Choose from professionally crafted templates designed to highlight your specific technical skills and achievements.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {templates.map((template, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative bg-[#0A0A0A] p-8 rounded-3xl border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Spotlight Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl`}></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                    <template.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`w-2 h-2 rounded-full ${template.accent} shadow-[0_0_10px_rgba(0,0,0,0.5)] shadow-current opacity-80`}></div>
                </div>

                <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {template.title}
                </h3>

                <p className="text-gray-500 group-hover:text-gray-400 transition-colors mb-6">
                  {template.count}
                </p>

              </div>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover:w-full transition-all duration-700"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
