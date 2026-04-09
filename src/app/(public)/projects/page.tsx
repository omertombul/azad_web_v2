'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import ProjectCard from '@/components/ProjectCard'
import ProjectGallery from '@/components/ProjectGallery'
import type { Project } from '@/types'

const CATEGORIES = ['All', 'Kitchen', 'Bathroom', 'Basement', 'Interior', 'Addition']

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filtered, setFiltered] = useState<Project[]>([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const t = useTranslations()

  const categoryLabels: Record<string, string> = {
    All: t('projectsPage.filterAll'),
    Kitchen: t('projectsPage.filterKitchen'),
    Bathroom: t('projectsPage.filterBathroom'),
    Basement: t('projectsPage.filterBasement'),
    Interior: t('projectsPage.filterInterior'),
    Addition: t('projectsPage.filterAddition'),
  }

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => { setProjects(data); setFiltered(data) })
      .finally(() => setLoading(false))
  }, [])

  const filter = (cat: string) => {
    setActive(cat)
    setFiltered(cat === 'All' ? projects : projects.filter((p) => p.category === cat))
  }

  return (
    <div>
      <div className="relative bg-brand-dark text-white py-36 text-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-brand-dark/90 via-brand-dark/75 to-brand-dark/95" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/3 rounded-full blur-[120px] z-2" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-2" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto px-4 relative z-10 pt-12">
          <span className="inline-flex items-center gap-2 text-white/80 text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">
            <span className="w-8 h-px bg-white/40" />{t('projectsPage.label')}<span className="w-8 h-px bg-white/40" />
          </span>
          <h1 className="text-4xl sm:text-6xl font-black mb-5">{t('projectsPage.title')}</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">{t('projectsPage.subtitle')}</p>
        </motion.div>
      </div>

      <section className="py-20 bg-brand-lightgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-wrap gap-2 justify-center mb-14">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => filter(cat)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${active === cat ? 'bg-brand-dark text-white shadow-lg shadow-brand-dark/20' : 'bg-white text-gray-500 hover:text-brand-dark hover:shadow-md border border-gray-100'}`}>
                {categoryLabels[cat]}
              </button>
            ))}
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden">
                  <div className="skeleton aspect-[4/3]" />
                  <div className="p-6 space-y-3"><div className="skeleton h-5 w-3/4 rounded" /><div className="skeleton h-4 w-full rounded" /></div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                {filtered.map((p, i) => (<ProjectCard key={p.id} project={p} index={i} onClick={() => setSelectedProject(p)} />))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (<ProjectGallery project={selectedProject} onClose={() => setSelectedProject(null)} />)}
      </AnimatePresence>
    </div>
  )
}
