'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import SectionTitle from '@/components/SectionTitle'
import ProjectCard from '@/components/ProjectCard'
import ProjectGallery from '@/components/ProjectGallery'
import ServiceCard from '@/components/ServiceCard'
import type { Project, Service } from '@/types'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const t = useTranslations()

  const stats = [
    { label: t('stats.homes'), value: 400, suffix: '+' },
    { label: t('stats.experience'), value: 19, suffix: '+' },
    { label: t('stats.homeowners'), value: 380, suffix: '+' },
    { label: t('stats.reviews'), value: 200, suffix: '+' },
  ]

  useEffect(() => {
    fetch('/api/projects').then((r) => r.json()).then((data) => setProjects(data.slice(0, 3)))
    fetch('/api/services').then((r) => r.json()).then((data) => setServices(data.slice(0, 6)))
  }, [])

  return (
    <div>
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        ctaLabel={t('hero.cta')}
        ctaTo="/contact"
        secondaryLabel={t('hero.secondary')}
        secondaryTo="/projects"
        backgroundImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
      />

      {/* Stats */}
      <section className="relative bg-brand-dark py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 via-transparent to-brand-gold/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
                <p className="text-4xl sm:text-5xl font-black text-gradient mb-2">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em]">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <SectionTitle label={t('about.label')} title={t('about.title')} subtitle={t('about.subtitle')} centered={false} />
              <p className="text-gray-500 mb-8 leading-relaxed">{t('about.description')}</p>
              <ul className="space-y-4 mb-10">
                {[t('about.bullet1'), t('about.bullet2'), t('about.bullet3'), t('about.bullet4')].map((item, i) => (
                  <motion.li key={item} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="w-6 h-6 rounded-full bg-brand-dark/10 text-brand-dark flex items-center justify-center text-xs flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-brand-dark text-white font-semibold px-7 py-3.5 rounded-full hover:bg-brand-gray transition-all duration-300 text-sm group">
                {t('about.cta')}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
                <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80" alt={t('about.imageAlt')} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                <p className="text-3xl font-black text-gradient">19+</p>
                <p className="text-xs text-gray-500 font-medium mt-1">{t('stats.experience')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-28 bg-brand-lightgray relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle label={t('servicesPreview.label')} title={t('servicesPreview.title')} subtitle={t('servicesPreview.subtitle')} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (<ServiceCard key={s.id} service={s} index={i} />))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center mt-14">
            <Link href="/services" className="inline-flex items-center gap-2 border-2 border-brand-dark text-brand-dark font-semibold px-8 py-3.5 rounded-full hover:bg-brand-dark hover:text-white transition-all duration-300 text-sm group">
              {t('servicesPreview.viewAll')}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle label={t('projectsPreview.label')} title={t('projectsPreview.title')} subtitle={t('projectsPreview.subtitle')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((p, i) => (<ProjectCard key={p.id} project={p} index={i} onClick={() => setSelectedProject(p)} />))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center mt-14">
            <Link href="/projects" className="inline-flex items-center gap-2 border-2 border-brand-dark text-brand-dark font-semibold px-8 py-3.5 rounded-full hover:bg-brand-dark hover:text-white transition-all duration-300 text-sm group">
              {t('projectsPreview.viewAll')}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-brand-dark" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 via-transparent to-brand-gold/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[100px]" />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">{t('ctaBanner.title')}</h2>
          <p className="text-white/50 text-lg mb-10 leading-relaxed">{t('ctaBanner.subtitle')}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-brand-dark font-bold px-10 py-4 rounded-full hover:bg-brand-darkgold transition-all duration-300 text-sm shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30 hover:scale-[1.02]">
            {t('ctaBanner.cta')}
          </Link>
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedProject && (<ProjectGallery project={selectedProject} onClose={() => setSelectedProject(null)} />)}
      </AnimatePresence>
    </div>
  )
}
