import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, message } = body

  if (!name || !email || !message) {
    return NextResponse.json(
      { detail: 'Name, email, and message are required' },
      { status: 422 }
    )
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ detail: 'Invalid email' }, { status: 422 })
  }

  // In production, send email here
  console.log('Contact form submission:', { name, email, phone: body.phone, message })

  return NextResponse.json({
    success: true,
    message: `Thank you ${name}! We received your message and will get back to you within 1 business day.`,
  })
}
