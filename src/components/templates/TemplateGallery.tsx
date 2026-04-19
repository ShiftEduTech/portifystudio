'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface TemplateGalleryProps {
  images: string[];
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

export default function TemplateGallery({ images }: TemplateGalleryProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);

  const imageIndex = (page + images.length) % images.length;

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  // Auto-slide effect
  useEffect(() => {
    if (isHovered || images.length <= 1) return;
    
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [paginate, isHovered, images.length]);

  return (
    <div className="flex flex-col gap-6" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Main Browser Frame */}
      <div className="relative group rounded-[24px] overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl transition-all duration-500 hover:border-white/20">
        
        {/* Browser Header Decor */}
        <div className="h-10 border-b border-white/[0.05] bg-white/[0.02] flex items-center px-5 gap-1.5 justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
          </div>
          <div className="flex-1 max-w-[400px] h-5 bg-white/5 rounded-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full border border-white/10 mr-2" />
            <span className="text-[10px] text-gray-600 font-medium truncate">portifystudio.com/preview</span>
          </div>
          <div className="flex items-center gap-3">
             <Maximize2 className="w-3 h-3 text-gray-600" />
          </div>
        </div>

        {/* Content Area */}
        <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={page}
              src={images[imageIndex]}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 w-full h-full object-cover"
              alt={`Template preview ${imageIndex + 1}`}
            />
          </AnimatePresence>

          {/* Navigation Overlay */}
          <div className="absolute inset-0 flex items-center justify-between p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button
              onClick={(e) => { e.stopPropagation(); paginate(-1); }}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-xl transition-all transform hover:scale-110 border border-white/10 pointer-events-auto shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); paginate(1); }}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-xl transition-all transform hover:scale-110 border border-white/10 pointer-events-auto shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === imageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
          {images.map((image, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const diff = idx - imageIndex;
                if (diff !== 0) paginate(diff);
              }}
              className={`relative flex-shrink-0 w-32 aspect-[16/10] rounded-12 overflow-hidden border-2 transition-all duration-300 ${
                idx === imageIndex 
                  ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-500/40' 
                  : 'border-white/10 opacity-40 hover:opacity-100 hover:border-white/30'
              }`}
            >
               <img src={image} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
               {idx === imageIndex && (
                 <motion.div layoutId="activeThumb" className="absolute inset-0 bg-indigo-500/10 pointer-events-none" />
               )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
