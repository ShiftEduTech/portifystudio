import React from 'react';
import { motion } from 'framer-motion';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {subtitle}
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-zinc-900/50 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/10 backdrop-blur-xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
