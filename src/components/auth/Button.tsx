import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({ isLoading, children, className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading || props.disabled}
      className={`
        relative w-full flex justify-center py-3 px-4 rounded-xl text-sm font-medium text-white
        bg-gradient-to-r from-purple-600 to-blue-600 
        hover:from-purple-500 hover:to-blue-500
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900
        disabled:opacity-70 disabled:cursor-not-allowed
        transition-all duration-200 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
}
