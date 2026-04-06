import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { put } from '@vercel/blob'

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
