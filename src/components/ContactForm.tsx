'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

interface FormState {
  name: string
  email: string
  phone: string
  message: string
}

interface StatusState {
  type: 'success' | 'error' | null
  message: string
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<StatusState>({ type: null, message: '' })
  const [loading, setLoading] = useState(false)
  const t = useTranslations()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: null, message: '' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ type: 'success', message: data.message })
        setForm({ name: '', email: '', phone: '', message: '' })
      } else {
        setStatus({ type: 'error', message: data.detail || t('contactForm.error') })
      }
    } catch {
      setStatus({ type: 'error', message: t('contactForm.error') })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-brand-lightgray/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark/30 focus:border-brand-dark/50 transition-all duration-300 placeholder-gray-400'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{t('contactForm.name')}</label>
          <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder={t('contactForm.namePlaceholder')} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{t('contactForm.email')}</label>
          <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder={t('contactForm.emailPlaceholder')} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{t('contactForm.phone')}</label>
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder={t('contactForm.phonePlaceholder')} className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{t('contactForm.message')}</label>
        <textarea name="message" required value={form.message} onChange={handleChange} placeholder={t('contactForm.messagePlaceholder')} rows={5} className={`${inputClass} resize-none`} />
      </div>

      <AnimatePresence>
        {status.type && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`px-5 py-3.5 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>

      <button type="submit" disabled={loading} className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-brand-gray transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-dark/10 hover:shadow-xl hover:shadow-brand-dark/20">
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            {t('contactForm.sending')}
          </span>
        ) : t('contactForm.send')}
      </button>
    </form>
  )
}
