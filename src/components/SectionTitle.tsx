'use client'
import { motion } from 'framer-motion'

interface SectionTitleProps {
  label?: string
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
}

export default function SectionTitle({ label, title, subtitle, centered = true, light = false }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={`mb-16 ${centered ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}`}
    >
      {label && (
        <span className={`inline-flex items-center gap-2 font-semibold uppercase tracking-[0.2em] text-[11px] mb-4 ${light ? 'text-white/80' : 'text-brand-dark/60'}`}>
          <span className={`w-8 h-px ${light ? 'bg-white/40' : 'bg-brand-dark/30'}`} />
          {label}
          <span className={`w-8 h-px ${light ? 'bg-white/40' : 'bg-brand-dark/30'}`} />
        </span>
      )}
      <h2 className={`text-3xl sm:text-4xl font-black leading-tight ${light ? 'text-white' : 'text-brand-dark'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base sm:text-lg max-w-2xl leading-relaxed ${centered ? 'mx-auto' : ''} ${light ? 'text-white/50' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
