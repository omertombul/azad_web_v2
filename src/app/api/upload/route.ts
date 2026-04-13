import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { randomUUID } from 'crypto'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const isDev = process.env.NODE_ENV === 'development'

export async function POST(request: NextRequest) {
  try {
    if (!requireAuth(request)) {
      return NextResponse.json({ detail: 'Invalid token' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ detail: 'No file provided' }, { status: 400 })
    }

    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const ext = file.name.toLowerCase().split('.').pop()
    if (!ext || !allowed.includes(`.${ext}`)) {
      return NextResponse.json(
        { detail: 'File type not allowed. Use JPG, PNG, GIF, or WEBP.' },
        { status: 400 }
      )
    }

    if (isDev) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const filename = `${randomUUID()}.${ext}`
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadsDir, { recursive: true })
      await writeFile(join(uploadsDir, filename), buffer)
      return NextResponse.json({ url: `/uploads/${filename}` })
    }

    const { put } = await import('@vercel/blob')
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
