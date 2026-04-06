import { prisma } from './prisma'

export async function getProjects() {
  const projects = await prisma.project.findMany({
    orderBy: [{ year: 'desc' }, { id: 'desc' }],
  })
  return projects.map((p) => ({
    ...p,
    images: JSON.parse(p.images) as string[],
  }))
}

export async function getServices() {
  return prisma.service.findMany({
    orderBy: { id: 'asc' },
  })
}
