'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.services'), to: '/services' },
    { label: t('nav.projects'), to: '/projects' },
    { label: t('nav.contact'), to: '/contact' },
  ]

  const toggleLang = async () => {
    const newLocale = locale === 'fr' ? 'en' : 'fr'
    await fetch('/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: newLocale }),
    })
    window.location.reload()
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass shadow-lg shadow-black/10 border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28 md:h-36">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative">
              <img src="/images/logo.png" alt="AZAD Construction" className="h-24 md:h-[120px] w-auto rounded-lg transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 rounded-lg ring-1 ring-white/10" />
            </div>
            <div className="flex flex-col">
              <span className="text-gradient font-black text-3xl md:text-4xl leading-none tracking-tight">{t('nav.brandLine1')}</span>
              <span className="text-white font-bold text-lg md:text-xl leading-none tracking-[0.15em] uppercase mt-1">{t('nav.brandLine2')}</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to)
              return (
                <Link key={link.to} href={link.to} className={`relative text-[13px] font-medium tracking-wide transition-colors duration-300 py-1 ${isActive ? 'text-brand-gold' : 'text-white/70 hover:text-white'}`}>
                  {link.label}
                  {isActive && (
                    <motion.div layoutId="navbar-indicator" className="absolute -bottom-1 left-0 right-0 h-[2px] bg-brand-gold rounded-full" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                </Link>
              )
            })}
            <button onClick={toggleLang} className="text-[11px] font-semibold border border-white/15 px-3 py-1.5 rounded-full text-white/50 hover:text-white hover:border-brand-gold/50 transition-all duration-300">
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>
            <Link href="/contact" className="relative bg-white text-brand-dark font-bold px-6 py-2.5 rounded-full text-xs tracking-wide hover:bg-brand-darkgold transition-all duration-300 hover:shadow-lg hover:shadow-white/20">
              {t('nav.getQuote')}
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all focus:outline-none" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="md:hidden glass border-t border-white/5 overflow-hidden">
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link, i) => {
                const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to)
                return (
                  <motion.div key={link.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link href={link.to} onClick={() => setMenuOpen(false)} className={`block px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all ${isActive ? 'text-brand-gold bg-brand-gold/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navLinks.length * 0.05 }}>
                <button onClick={toggleLang} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium tracking-wide text-white/70 hover:text-white hover:bg-white/5 transition-all">
                  {locale === 'fr' ? 'English' : 'Français'}
                </button>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (navLinks.length + 1) * 0.05 }} className="pt-3">
                <Link href="/contact" onClick={() => setMenuOpen(false)} className="block bg-white text-brand-dark font-bold px-4 py-3.5 rounded-xl text-center text-sm tracking-wide hover:bg-brand-darkgold transition-colors">
                  {t('nav.getQuote')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
