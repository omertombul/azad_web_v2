'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import ServiceCard from '@/components/ServiceCard'
import SectionTitle from '@/components/SectionTitle'
import type { Service } from '@/types'

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  const WHY_US = [
    { title: t('whyUs.item1Title'), desc: t('whyUs.item1Desc'), icon: '01' },
    { title: t('whyUs.item2Title'), desc: t('whyUs.item2Desc'), icon: '02' },
    { title: t('whyUs.item3Title'), desc: t('whyUs.item3Desc'), icon: '03' },
    { title: t('whyUs.item4Title'), desc: t('whyUs.item4Desc'), icon: '04' },
  ]

  useEffect(() => {
    fetch('/api/services').then((r) => r.json()).then((data) => setServices(data)).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="relative bg-brand-dark text-white py-36 text-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-brand-dark/90 via-brand-dark/75 to-brand-dark/95" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/3 rounded-full blur-[120px] z-2" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-2" style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto px-4 relative z-10 pt-12">
          <span className="inline-flex items-center gap-2 text-brand-gold/80 text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">
            <span className="w-8 h-px bg-brand-gold/40" />{t('servicesPage.label')}<span className="w-8 h-px bg-brand-gold/40" />
          </span>
          <h1 className="text-4xl sm:text-6xl font-black mb-5">{t('servicesPage.title')}</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">{t('servicesPage.subtitle')}</p>
        </motion.div>
      </div>

      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle label={t('servicesPage.gridLabel')} title={t('servicesPage.gridTitle')} subtitle={t('servicesPage.gridSubtitle')} />
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-brand-lightgray rounded-2xl p-7 space-y-4">
                  <div className="skeleton w-12 h-12 rounded-xl" /><div className="skeleton h-5 w-1/2 rounded" /><div className="skeleton h-4 w-full rounded" /><div className="skeleton h-4 w-3/4 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (<ServiceCard key={s.id} service={s} index={i} />))}
            </div>
          )}
        </div>
      </section>

      <section className="py-28 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionTitle label={t('whyUs.label')} title={t('whyUs.title')} light centered />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {WHY_US.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.06] hover:border-brand-gold/20 transition-all duration-500">
                <span className="text-brand-gold/30 text-4xl font-black block mb-4">{item.icon}</span>
                <h3 className="text-white font-bold mb-2 text-lg">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-brand-dark" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[100px]" />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-5">{t('servicesCta.title')}</h2>
          <p className="text-white/40 mb-10 text-base leading-relaxed">{t('servicesCta.subtitle')}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark font-bold px-10 py-4 rounded-full hover:bg-brand-darkgold transition-all duration-300 shadow-lg shadow-brand-gold/20 hover:shadow-xl hover:shadow-brand-gold/30 text-sm">
            {t('servicesCta.cta')}
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
