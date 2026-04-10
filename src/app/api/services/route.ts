import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json(services)
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ detail: 'Invalid token' }, { status: 401 })
  }
  const body = await request.json()
  const service = await prisma.service.create({
    data: {
      title: body.title,
      title_fr: body.title_fr || '',
      description: body.description,
      description_fr: body.description_fr || '',
      icon: body.icon,
    },
  })
  return NextResponse.json(service, { status: 201 })
}
