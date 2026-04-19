'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TemplateGalleryProps {
  images: string[];
}

export default function TemplateGallery({ images }: TemplateGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const setSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div className="relative aspect-[16/10] bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Preview ${currentIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            {/* Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={prevSlide}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md transition-all transform hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md transition-all transform hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSlide(idx)}
              className={`relative flex-shrink-0 w-32 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                idx === currentIndex ? 'border-purple-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={image} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
