import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAuth(request)) {
    return NextResponse.json({ detail: 'Invalid token' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json()
  const data: Record<string, unknown> = {}
  if (body.title !== undefined) data.title = body.title
  if (body.year !== undefined) data.year = body.year
  if (body.category !== undefined) data.category = body.category
  if (body.description !== undefined) data.description = body.description
  if (body.title_fr !== undefined) data.title_fr = body.title_fr
  if (body.description_fr !== undefined) data.description_fr = body.description_fr
  if (body.image !== undefined) data.image = body.image
  if (body.images !== undefined) data.images = JSON.stringify(body.images)

  try {
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data,
    })
    return NextResponse.json({ ...project, images: JSON.parse(project.images) })
  } catch {
    return NextResponse.json({ detail: 'Project not found' }, { status: 404 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAuth(request)) {
    return NextResponse.json({ detail: 'Invalid token' }, { status: 401 })
  }
  const { id } = await params
  try {
    await prisma.project.delete({ where: { id: parseInt(id) } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ detail: 'Project not found' }, { status: 404 })
  }
}
