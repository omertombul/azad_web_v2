'use client'
import { motion } from 'framer-motion'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index?: number
  onClick?: () => void
}

export default function ProjectCard({ project, index = 0, onClick }: ProjectCardProps) {
  const imageCount = project.images?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/80 cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="bg-white/90 backdrop-blur-sm text-brand-dark text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View Gallery
          </div>
        </div>
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-dark text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
          {project.category}
        </span>
        {imageCount > 1 && (
          <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
            {imageCount}
          </span>
        )}
        <span className="absolute top-4 right-4 bg-brand-gold/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
          {project.year}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-2 group-hover:text-brand-darkgold transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{project.description}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  )
}
