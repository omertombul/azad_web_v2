import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ detail: 'Invalid token' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ detail: 'No file provided' }, { status: 400 })
  }

  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const ext = path.extname(file.name).toLowerCase()
  if (!allowed.includes(ext)) {
    return NextResponse.json(
      { detail: 'File type not allowed. Use JPG, PNG, GIF, or WEBP.' },
      { status: 400 }
    )
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  const filename = `${randomUUID()}${ext}`
  const filepath = path.join(uploadDir, filename)
  const bytes = await file.arrayBuffer()
  await writeFile(filepath, Buffer.from(bytes))

  return NextResponse.json({ url: `/uploads/${filename}` })
}
