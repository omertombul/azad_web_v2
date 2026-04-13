'use client'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import ContactForm from '@/components/ContactForm'

export default function Contact() {
  const t = useTranslations()

  const contactInfo = [
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
      label: t('contactPage.phone'), value: '(514) 531-0673', href: 'tel:+15145310673',
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      label: t('contactPage.email'), value: 'azadconstruction@outlook.com', href: 'mailto:azadconstruction@outlook.com',
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      label: t('contactPage.office'), value: '1174 Rue Dover, Laval, QC H7W 3L7', href: 'https://maps.google.com/?q=1174+Rue+Dover+Laval+QC+H7W+3L7',
    },
  ]

  return (
    <div>
      <div className="relative bg-brand-dark text-white py-36 text-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-brand-dark/90 via-brand-dark/75 to-brand-dark/95" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/3 rounded-full blur-[120px] z-2" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-2" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto px-4 relative z-10 pt-12">
          <span className="inline-flex items-center gap-2 text-white/80 text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">
            <span className="w-8 h-px bg-white/40" />{t('contactPage.label')}<span className="w-8 h-px bg-white/40" />
          </span>
          <h1 className="text-4xl sm:text-6xl font-black mb-5">{t('contactPage.title')}</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">{t('contactPage.subtitle')}</p>
        </motion.div>
      </div>

      <section className="py-28 bg-brand-lightgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-brand-dark mb-3">{t('contactPage.estimateTitle')}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{t('contactPage.estimateDesc')}</p>
              </div>
              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="flex items-start gap-4 group">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-brand-dark flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">{item.icon}</div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-brand-dark font-semibold hover:text-brand-dark transition-colors text-sm">{item.value}</a>
                      ) : (
                        <p className="text-brand-dark font-semibold text-sm">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="rounded-2xl overflow-hidden h-52 bg-gray-200 relative shadow-sm">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" alt="Map placeholder" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg text-sm font-semibold text-brand-dark">{t('contactPage.mapBadge')}</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-3 bg-white rounded-3xl shadow-xl shadow-black/5 p-8 sm:p-10 border border-gray-100/50">
              <h3 className="text-xl font-black text-brand-dark mb-8">{t('contactPage.formTitle')}</h3>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
