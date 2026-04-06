'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations()

  return (
    <footer className="bg-brand-dark text-gray-400 relative">
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="relative">
                <img src="/images/logo.png" alt="AZAD Construction" className="h-14 w-auto rounded-lg transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 rounded-lg ring-1 ring-white/10" />
              </div>
              <div className="flex flex-col">
                <span className="text-gradient font-black text-2xl leading-none tracking-tight">AZAD</span>
                <span className="text-white/40 font-light text-[10px] tracking-[0.3em] uppercase mt-0.5">Constructions</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-white/30 mb-8">{t('footer.description')}</p>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'houzz'].map((s) => (
                <a key={s} href="#" aria-label={s} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-brand-gold/30 hover:bg-brand-gold/10 hover:text-brand-gold flex items-center justify-center transition-all duration-300">
                  <span className="sr-only">{s}</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('nav.home'), to: '/' },
                { label: t('nav.services'), to: '/services' },
                { label: t('nav.projects'), to: '/projects' },
                { label: t('nav.contact'), to: '/contact' },
              ].map((l) => (
                <li key={l.to}>
                  <Link href={l.to} className="text-white/30 hover:text-brand-gold transition-colors text-sm inline-flex items-center gap-2 group">
                    <span className="w-0 h-px bg-brand-gold group-hover:w-3 transition-all duration-300" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">{t('footer.contactUs')}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <span className="text-brand-gold"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></span>
                <span className="text-white/40">(312) 555-0198</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-brand-gold"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></span>
                <span className="text-white/40">info@azadrenovations.com</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-brand-gold"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
                <span className="text-white/40 leading-snug">{t('footer.serving')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/20 font-medium">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brand-gold transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
