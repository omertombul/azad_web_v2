'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import type { Project } from '@/types'

interface ProjectGalleryProps {
  project: Project
  onClose: () => void
}

export default function ProjectGallery({ project, onClose }: ProjectGalleryProps) {
  const locale = useLocale()
  const images = project.images?.length ? project.images : [project.image]
  const [current, setCurrent] = useState(0)
  const title = locale === 'fr' && project.title_fr ? project.title_fr : project.title
  const description = locale === 'fr' && project.description_fr ? project.description_fr : project.description

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)), [images.length])
  const next = useCallback(() => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)), [images.length])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <div>
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <p className="text-white/40 text-sm">{project.category} &middot; {project.year}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-sm">{current + 1} / {images.length}</span>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative px-16 min-h-0" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && (
          <button onClick={prev} className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={`${project.title} - ${current + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          />
        </AnimatePresence>
        {images.length > 1 && (
          <button onClick={next} className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 px-6 py-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                i === current ? 'border-brand-gold scale-105' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="px-6 pb-6 flex-shrink-0 text-center" onClick={(e) => e.stopPropagation()}>
        <p className="text-white/50 text-sm max-w-2xl mx-auto">{description}</p>
      </div>
    </motion.div>
  )
}
