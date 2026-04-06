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
  if (body.description !== undefined) data.description = body.description
  if (body.icon !== undefined) data.icon = body.icon

  try {
    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data,
    })
    return NextResponse.json(service)
  } catch {
    return NextResponse.json({ detail: 'Service not found' }, { status: 404 })
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
    await prisma.service.delete({ where: { id: parseInt(id) } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ detail: 'Service not found' }, { status: 404 })
  }
}
