import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createAccessToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || ''
  let password = ''

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.text()
    const params = new URLSearchParams(formData)
    password = params.get('password') || ''
  } else {
    const body = await request.json()
    password = body.password || ''
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ detail: 'Incorrect password' }, { status: 401 })
  }

  const access_token = createAccessToken()
  return NextResponse.json({ access_token, token_type: 'bearer' })
}
