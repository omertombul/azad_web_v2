'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaLabel: string
  ctaTo: string
  secondaryLabel?: string
  secondaryTo?: string
  backgroundImage?: string
}

export default function HeroSection({ title, subtitle, ctaLabel, ctaTo, secondaryLabel, secondaryTo, backgroundImage }: HeroSectionProps) {
  const t = useTranslations()
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (!backgroundImage) return
    const img = new Image()
    img.src = backgroundImage
    if (img.complete) {
      setImageLoaded(true)
    } else {
      img.onload = () => setImageLoaded(true)
    }
  }, [backgroundImage])

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {backgroundImage && (
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: imageLoaded ? 1 : 1.1, opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
          style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-brand-dark/90 via-brand-dark/70 to-brand-dark/95" />
      <div className="absolute inset-0 z-15 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/3 rounded-full blur-[120px]" />
      </div>
      <div className="absolute inset-0 z-15 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-36">
        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="inline-flex items-center gap-2 border border-brand-gold/30 text-brand-gold/90 text-[11px] font-semibold uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-8 backdrop-blur-sm bg-brand-gold/5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
          {t('hero.badge')}
        </motion.span>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] text-balance mb-8">
          {title.split(' ').map((word, i) => (
            <span key={i} className={i === title.split(' ').length - 1 ? 'text-gradient' : ''}>{word} </span>
          ))}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          {subtitle}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-wrap gap-4 justify-center">
          <Link href={ctaTo} className="group relative bg-white text-brand-dark font-bold px-8 py-4 rounded-full hover:bg-brand-darkgold transition-all duration-300 text-sm tracking-wide shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30 hover:scale-[1.02]">
            {ctaLabel}
          </Link>
          {secondaryLabel && secondaryTo && (
            <Link href={secondaryTo} className="group border border-white/20 text-white font-medium px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-sm tracking-wide backdrop-blur-sm">
              {secondaryLabel}
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
