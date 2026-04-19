'use client';

import Link from 'next/link';
import { Template } from '@/data/templates';
import { Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link href={`/templates/${template.id}`} className="block group w-full h-full">
      <motion.div 
        whileHover={{ y: -5 }}
        className="relative bg-zinc-900/40 rounded-2xl border border-white/10 transition-all duration-500 flex flex-col h-full backdrop-blur-md"
      >
        {/* Animated Gradient Border on Hover */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-[2px]" />
        
        {/* Inner surface to overlap the background gradient border */}
        <div className="flex flex-col h-full bg-zinc-950/80 rounded-[15px] overflow-hidden">
          {/* Thumbnail Container */}
          <div className="relative aspect-[16/10] overflow-hidden bg-black/50">
            <img 
              src={template.thumbnails[0]} 
              alt={template.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-sm shadow-2xl">
                <Eye className="w-4 h-4" /> View Details
              </span>
            </div>
            
            {/* Access Badge */}
            {template.accessLevel === 'premium' ? (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider overflow-hidden">
                <div className="absolute inset-0 bg-white/20 w-full h-full skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10">Premium</span>
              </div>
            ) : (
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                Free
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow relative">
            <div className="inline-flex px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4 w-fit">
              <span className="text-xs font-semibold text-blue-400">{template.role}</span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
              {template.title}
            </h3>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-2">
              {template.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <div className="flex gap-2">
                {template.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5">
                    {tag}
                  </span>
                ))}
                {template.tags.length > 2 && (
                  <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5">
                    +{template.tags.length - 2}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  template.difficulty === 'Beginner' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' :
                  template.difficulty === 'Intermediate' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 
                  'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]'
                }`} />
                <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                  {template.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
