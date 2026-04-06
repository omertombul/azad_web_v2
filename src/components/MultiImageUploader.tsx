'use client'
import { useState, useRef, useCallback } from 'react'

interface MultiImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
}

export default function MultiImageUploader({ images, onChange }: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(async (files: FileList) => {
    setError('')
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const validFiles = Array.from(files).filter((f) => allowed.includes(f.type) && f.size <= 10 * 1024 * 1024)
    if (validFiles.length === 0) {
      setError('No valid image files. Use JPG, PNG, GIF, or WEBP under 10MB.')
      return
    }

    setUploading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const urls: string[] = []
      for (const file of validFiles) {
        const form = new FormData()
        form.append('file', file)
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        })
        const data = await res.json()
        if (res.ok) urls.push(data.url)
      }
      onChange([...images, ...urls])
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [images, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) upload(e.dataTransfer.files)
  }, [upload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) upload(e.target.files)
    e.target.value = ''
  }, [upload])

  const removeImage = (index: number) => onChange(images.filter((_, i) => i !== index))
  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    const updated = [...images]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)
    onChange(updated)
  }

  return (
    <div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
          {images.map((img, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video">
              <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute top-2 left-2 bg-brand-gold text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Cover</span>}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {i > 0 && (
                  <button onClick={() => moveImage(i, i - 1)} className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors" title="Move left">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                )}
                {i < images.length - 1 && (
                  <button onClick={() => moveImage(i, i + 1)} className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors" title="Move right">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                )}
                <button onClick={() => removeImage(i)} className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors" title="Remove">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragOver ? 'border-brand-gold bg-brand-gold/5' : 'border-gray-200 hover:border-brand-gold/50 hover:bg-gray-50'}`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-3 border-gray-200 border-t-brand-gold rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Uploading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
            <span className="text-sm text-gray-500">Drop images here or <span className="text-brand-gold font-semibold">click to browse</span></span>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      {images.length > 0 && <p className="text-xs text-gray-400 mt-2">{images.length} image{images.length !== 1 ? 's' : ''} — first image is the cover photo.</p>}
    </div>
  )
}
