'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const form = new URLSearchParams()
      form.append('username', 'admin')
      form.append('password', password)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form,
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      localStorage.setItem('admin_token', data.access_token)
      router.push('/admin')
    } catch {
      setError('Incorrect password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src="/images/logo.png" alt="AZAD" className="h-16 w-auto mx-auto mb-4 rounded-xl" />
          <h1 className="text-white font-black text-2xl">Admin Login</h1>
          <p className="text-white/40 text-sm mt-1">Enter your password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoFocus className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all" />
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}
          <button type="submit" disabled={!password || loading} className="w-full bg-white text-brand-dark font-bold py-3.5 rounded-xl text-sm hover:bg-brand-darkgold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (<><div className="w-4 h-4 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" />Signing in...</>) : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-white/20 text-xs mt-8">AZAD Constructions Inc &mdash; Admin Panel</p>
      </div>
    </div>
  )
}
