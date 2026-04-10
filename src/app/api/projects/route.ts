import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ year: 'desc' }, { id: 'desc' }],
  })
  return NextResponse.json(
    projects.map((p) => ({ ...p, images: JSON.parse(p.images) }))
  )
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ detail: 'Invalid token' }, { status: 401 })
  }
  const body = await request.json()
  const project = await prisma.project.create({
    data: {
      title: body.title,
      title_fr: body.title_fr || '',
      year: body.year,
      category: body.category,
      description: body.description,
      description_fr: body.description_fr || '',
      image: body.image,
      images: JSON.stringify(body.images || []),
    },
  })
  return NextResponse.json(
    { ...project, images: JSON.parse(project.images) },
    { status: 201 }
  )
}
