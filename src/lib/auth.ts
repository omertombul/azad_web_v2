import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const SECRET_KEY = process.env.SECRET_KEY || 'azad-dev-secret-change-in-production'
const ALGORITHM = 'HS256'
const ACCESS_TOKEN_EXPIRE_MINUTES = 120
// Default password: "admin" — override via ADMIN_PASSWORD_HASH env var in production
const DEFAULT_HASH = '$2b$12$UbwbGKaSFf1iGnf.YHtK/ehDRKNCh7yK4l3sZjB0bCnHoH.QHf2Ya'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || DEFAULT_HASH

export function verifyPassword(plain: string): boolean {
  return bcrypt.compareSync(plain, ADMIN_PASSWORD_HASH)
}

export function createAccessToken(): string {
  const exp = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRE_MINUTES * 60
  return jwt.sign({ sub: 'admin', exp }, SECRET_KEY, { algorithm: ALGORITHM })
}

export function verifyToken(token: string): boolean {
  try {
    const payload = jwt.verify(token, SECRET_KEY, { algorithms: [ALGORITHM] }) as { sub?: string }
    return payload.sub === 'admin'
  } catch {
    return false
  }
}

export function requireAuth(request: NextRequest): boolean {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return false
  return verifyToken(auth.slice(7))
}
