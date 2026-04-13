'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Project, Service } from '@/types'
import MultiImageUploader from '@/components/MultiImageUploader'

const PROJECT_CATEGORIES = ['Landscaping', 'Project Management', 'Basement Finishing', 'Masonry', 'Interior Renovation', 'Exterior Renovation', 'Bathroom', 'Extension', 'Demolition & Excavation', 'Interior Systems', 'New Construction', 'Foundation']
const ICON_OPTIONS = ['kitchen', 'bath', 'building', 'addition', 'paint', 'floor', 'landscape', 'deck', 'roof', 'window', 'electric', 'plumbing', 'hvac', 'exterior', 'fence', 'drywall', 'garage', 'gutter']

type Tab = 'dashboard' | 'projects' | 'services'

function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('admin_token')
  return fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  })
}

export default function Admin() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [showNewProject, setShowNewProject] = useState(false)
  const [showNewService, setShowNewService] = useState(false)
  const [newProject, setNewProject] = useState({ title: '', title_fr: '', year: new Date().getFullYear(), category: 'Landscaping', description: '', description_fr: '', image: '', images: [] as string[] })
  const [newService, setNewService] = useState({ title: '', title_fr: '', description: '', description_fr: '', icon: 'building' })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }
    Promise.all([
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/services').then((r) => r.json()),
    ]).then(([p, s]) => { setProjects(p); setServices(s) }).finally(() => setLoading(false))
  }, [router])

  const flash = (type: 'ok' | 'err', text: string) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000) }

  const updateProjectField = (id: number, field: keyof Project, value: string | number) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }
  const updateProjectImages = (id: number, images: string[]) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, images, image: images[0] || p.image } : p)))
  }

  const saveProject = async (proj: Project) => {
    const key = `proj-${proj.id}`; setSaving(key)
    try {
      const { id, ...body } = proj
      await apiFetch(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      flash('ok', `"${proj.title}" saved successfully`)
    } catch { flash('err', 'Failed to save project') } finally { setSaving(null) }
  }

  const createProject = async () => {
    setSaving('new-proj')
    try {
      const payload = { ...newProject, image: newProject.images[0] || newProject.image }
      const res = await apiFetch('/api/projects', { method: 'POST', body: JSON.stringify(payload) })
      const data = await res.json()
      setProjects((prev) => [...prev, data])
      setNewProject({ title: '', title_fr: '', year: new Date().getFullYear(), category: 'Landscaping', description: '', description_fr: '', image: '', images: [] })
      setShowNewProject(false); flash('ok', `"${data.title}" created`)
    } catch { flash('err', 'Failed to create project') } finally { setSaving(null) }
  }

  const deleteProject = async (id: number) => {
    try { await apiFetch(`/api/projects/${id}`, { method: 'DELETE' }); setProjects((prev) => prev.filter((p) => p.id !== id)); flash('ok', 'Project deleted') }
    catch { flash('err', 'Failed to delete project') }
    setConfirmDelete(null)
  }

  const updateServiceField = (id: number, field: keyof Service, value: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const saveService = async (svc: Service) => {
    const key = `svc-${svc.id}`; setSaving(key)
    try {
      const { id, ...body } = svc
      await apiFetch(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      flash('ok', `"${svc.title}" saved successfully`)
    } catch { flash('err', 'Failed to save service') } finally { setSaving(null) }
  }

  const createService = async () => {
    setSaving('new-svc')
    try {
      const res = await apiFetch('/api/services', { method: 'POST', body: JSON.stringify(newService) })
      const data = await res.json()
      setServices((prev) => [...prev, data])
      setNewService({ title: '', title_fr: '', description: '', description_fr: '', icon: 'building' }); setShowNewService(false); flash('ok', `"${data.title}" created`)
    } catch { flash('err', 'Failed to create service') } finally { setSaving(null) }
  }

  const deleteService = async (id: number) => {
    try { await apiFetch(`/api/services/${id}`, { method: 'DELETE' }); setServices((prev) => prev.filter((s) => s.id !== id)); flash('ok', 'Service deleted') }
    catch { flash('err', 'Failed to delete service') }
    setConfirmDelete(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const sidebarItems: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { key: 'projects', label: 'Projects', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { key: 'services', label: 'Services', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ]

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all bg-gray-50 hover:bg-white'
  const labelClass = 'block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide'

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-brand-dark text-white flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/images/logo.png" alt="AZAD" className="h-10 w-auto rounded-lg" />
            <div><div className="font-black text-lg leading-none">AZAD</div><div className="text-white/40 text-[9px] tracking-[0.2em] uppercase">Admin Panel</div></div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === item.key ? 'bg-brand-gold text-brand-dark' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>Back to Website
          </Link>
          <button onClick={() => { localStorage.removeItem('admin_token'); router.push('/admin/login') }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <div className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-30">
          <h1 className="text-xl font-black text-brand-dark capitalize">{tab}</h1>
          <p className="text-gray-400 text-xs mt-0.5">
            {tab === 'dashboard' && 'Overview of your content'}
            {tab === 'projects' && `Manage your ${projects.length} projects`}
            {tab === 'services' && `Manage your ${services.length} services`}
          </p>
        </div>

        {msg && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 ${msg.type === 'ok' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {msg.type === 'ok' ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
            {msg.text}
          </div>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Are you sure?</h3>
              <p className="text-sm text-gray-500 text-center mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => { const [type, id] = confirmDelete.split('-'); if (type === 'proj') deleteProject(Number(id)); else deleteService(Number(id)) }} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        )}

        <div className="p-8">
          {tab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div onClick={() => setTab('projects')} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-gold/20 transition-all cursor-pointer">
                  <div className="text-3xl font-black text-brand-dark mt-4">{projects.length}</div>
                  <div className="text-sm text-gray-400 font-medium">Total Projects</div>
                </div>
                <div onClick={() => setTab('services')} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-gold/20 transition-all cursor-pointer">
                  <div className="text-3xl font-black text-brand-dark mt-4">{services.length}</div>
                  <div className="text-sm text-gray-400 font-medium">Total Services</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-3xl font-black text-green-500 mt-4">Live</div>
                  <div className="text-sm text-gray-400 font-medium">Website Status</div>
                </div>
              </div>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => { setTab('projects'); setShowNewProject(true) }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-gold/20 transition-all text-left flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold flex-shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></div>
                  <div><div className="font-bold text-brand-dark text-sm">Add New Project</div><div className="text-xs text-gray-400">Showcase your latest work</div></div>
                </button>
                <button onClick={() => { setTab('services'); setShowNewService(true) }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-gold/20 transition-all text-left flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></div>
                  <div><div className="font-bold text-brand-dark text-sm">Add New Service</div><div className="text-xs text-gray-400">Expand your offerings</div></div>
                </button>
              </div>
            </div>
          )}

          {tab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-400">{projects.length} projects total</div>
                <button onClick={() => setShowNewProject(true)} className="flex items-center gap-2 bg-brand-gold text-brand-dark font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-brand-darkgold transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Project
                </button>
              </div>
              {showNewProject && (
                <div className="bg-white rounded-2xl border-2 border-brand-gold/30 shadow-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-5"><h3 className="font-bold text-brand-dark text-lg">New Project</h3><button onClick={() => setShowNewProject(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><label className={labelClass}>Project Name (EN)</label><input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="e.g. Modern Kitchen Overhaul" className={inputClass} /></div>
                    <div><label className={labelClass}>Project Name (FR)</label><input type="text" value={newProject.title_fr} onChange={(e) => setNewProject({ ...newProject, title_fr: e.target.value })} placeholder="ex. Rénovation de cuisine moderne" className={inputClass} /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex gap-4"><div className="flex-1"><label className={labelClass}>Year</label><input type="number" value={newProject.year} onChange={(e) => setNewProject({ ...newProject, year: parseInt(e.target.value) || 0 })} className={inputClass} /></div><div className="flex-1"><label className={labelClass}>Category</label><select value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} className={inputClass}>{PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div></div>
                  </div>
                  <div className="mb-4"><label className={labelClass}>Project Images</label><MultiImageUploader images={newProject.images} onChange={(imgs) => setNewProject({ ...newProject, images: imgs, image: imgs[0] || '' })} /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><label className={labelClass}>Description (EN)</label><textarea rows={3} value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Describe the project..." className={inputClass + ' resize-vertical'} /></div>
                    <div><label className={labelClass}>Description (FR)</label><textarea rows={3} value={newProject.description_fr} onChange={(e) => setNewProject({ ...newProject, description_fr: e.target.value })} placeholder="Décrivez le projet..." className={inputClass + ' resize-vertical'} /></div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setShowNewProject(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                    <button onClick={createProject} disabled={!newProject.title || saving === 'new-proj'} className="bg-brand-gold text-brand-dark font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-brand-darkgold transition-colors disabled:opacity-50">{saving === 'new-proj' ? 'Creating...' : 'Create Project'}</button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3"><span className="bg-brand-gold/10 text-brand-gold text-xs font-bold px-3 py-1 rounded-full">{proj.category}</span><span className="text-xs text-gray-300">{proj.year}</span></div>
                        <button onClick={() => setConfirmDelete(`proj-${proj.id}`)} className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Delete project"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><label className={labelClass}>Project Name (EN)</label><input type="text" value={proj.title} onChange={(e) => updateProjectField(proj.id, 'title', e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Project Name (FR)</label><input type="text" value={proj.title_fr || ''} onChange={(e) => updateProjectField(proj.id, 'title_fr', e.target.value)} className={inputClass} /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex gap-4"><div className="flex-1"><label className={labelClass}>Year</label><input type="number" value={proj.year} onChange={(e) => updateProjectField(proj.id, 'year', parseInt(e.target.value) || 0)} className={inputClass} /></div><div className="flex-1"><label className={labelClass}>Category</label><select value={proj.category} onChange={(e) => updateProjectField(proj.id, 'category', e.target.value)} className={inputClass}>{PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div></div>
                      </div>
                      <div className="mb-4"><label className={labelClass}>Project Images</label><MultiImageUploader images={proj.images || []} onChange={(imgs) => updateProjectImages(proj.id, imgs)} /></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><label className={labelClass}>Description (EN)</label><textarea rows={2} value={proj.description} onChange={(e) => updateProjectField(proj.id, 'description', e.target.value)} className={inputClass + ' resize-vertical'} /></div>
                        <div><label className={labelClass}>Description (FR)</label><textarea rows={2} value={proj.description_fr || ''} onChange={(e) => updateProjectField(proj.id, 'description_fr', e.target.value)} className={inputClass + ' resize-vertical'} /></div>
                      </div>
                      <div className="flex justify-end">
                        <button onClick={() => saveProject(proj)} disabled={saving === `proj-${proj.id}`} className="flex items-center gap-2 bg-brand-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-gold hover:text-brand-dark transition-colors disabled:opacity-50">
                          {saving === `proj-${proj.id}` ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>) : (<><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Save Changes</>)}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'services' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-400">{services.length} services total</div>
                <button onClick={() => setShowNewService(true)} className="flex items-center gap-2 bg-brand-gold text-brand-dark font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-brand-darkgold transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Service
                </button>
              </div>
              {showNewService && (
                <div className="bg-white rounded-2xl border-2 border-brand-gold/30 shadow-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-5"><h3 className="font-bold text-brand-dark text-lg">New Service</h3><button onClick={() => setShowNewService(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><label className={labelClass}>Service Name (EN)</label><input type="text" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} placeholder="e.g. Kitchen Remodeling" className={inputClass} /></div>
                    <div><label className={labelClass}>Service Name (FR)</label><input type="text" value={newService.title_fr} onChange={(e) => setNewService({ ...newService, title_fr: e.target.value })} placeholder="ex. Rénovation de cuisine" className={inputClass} /></div>
                  </div>
                  <div className="mb-4"><label className={labelClass}>Icon</label><select value={newService.icon} onChange={(e) => setNewService({ ...newService, icon: e.target.value })} className={inputClass}>{ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon.charAt(0).toUpperCase() + icon.slice(1)}</option>)}</select></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><label className={labelClass}>Description (EN)</label><textarea rows={3} value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} placeholder="Describe the service..." className={inputClass + ' resize-vertical'} /></div>
                    <div><label className={labelClass}>Description (FR)</label><textarea rows={3} value={newService.description_fr} onChange={(e) => setNewService({ ...newService, description_fr: e.target.value })} placeholder="Décrivez le service..." className={inputClass + ' resize-vertical'} /></div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setShowNewService(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                    <button onClick={createService} disabled={!newService.title || saving === 'new-svc'} className="bg-brand-gold text-brand-dark font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-brand-darkgold transition-colors disabled:opacity-50">{saving === 'new-svc' ? 'Creating...' : 'Create Service'}</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((svc) => (
                  <div key={svc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full capitalize">{svc.icon}</span>
                      <button onClick={() => setConfirmDelete(`svc-${svc.id}`)} className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Delete service"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Service Name (EN)</label><input type="text" value={svc.title} onChange={(e) => updateServiceField(svc.id, 'title', e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Service Name (FR)</label><input type="text" value={svc.title_fr || ''} onChange={(e) => updateServiceField(svc.id, 'title_fr', e.target.value)} className={inputClass} /></div>
                      </div>
                      <div><label className={labelClass}>Icon</label><select value={svc.icon} onChange={(e) => updateServiceField(svc.id, 'icon', e.target.value)} className={inputClass}>{ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon.charAt(0).toUpperCase() + icon.slice(1)}</option>)}</select></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Description (EN)</label><textarea rows={2} value={svc.description} onChange={(e) => updateServiceField(svc.id, 'description', e.target.value)} className={inputClass + ' resize-vertical'} /></div>
                        <div><label className={labelClass}>Description (FR)</label><textarea rows={2} value={svc.description_fr || ''} onChange={(e) => updateServiceField(svc.id, 'description_fr', e.target.value)} className={inputClass + ' resize-vertical'} /></div>
                      </div>
                      <div className="flex justify-end">
                        <button onClick={() => saveService(svc)} disabled={saving === `svc-${svc.id}`} className="flex items-center gap-2 bg-brand-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-gold hover:text-brand-dark transition-colors disabled:opacity-50">
                          {saving === `svc-${svc.id}` ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>) : (<><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Save Changes</>)}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
