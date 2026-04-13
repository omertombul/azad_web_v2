import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PROJECTS = []

const SERVICES = [
  { title: "Kitchen Remodeling", description: "Transform your kitchen into the heart of your home.", icon: "kitchen" },
  { title: "Bathroom Renovation", description: "Upgrade your bathroom with custom tile work, new vanities, walk-in showers.", icon: "bath" },
  { title: "Basement Finishing", description: "Turn your unfinished basement into a livable space.", icon: "building" },
  { title: "Home Additions", description: "We design and build room additions, sunrooms, mudrooms.", icon: "addition" },
  { title: "Interior Painting", description: "Fresh paint can completely transform a space.", icon: "paint" },
  { title: "Flooring Installation", description: "From hardwood and LVP to tile and carpet.", icon: "floor" },
  { title: "Landscaping & Lawn Care", description: "Professional landscape design and lawn care.", icon: "landscape" },
  { title: "Deck & Patio Construction", description: "Custom decks, patios, pergolas, and outdoor kitchens.", icon: "deck" },
  { title: "Roofing", description: "Full roof replacements, repairs, and inspections.", icon: "roof" },
  { title: "Windows & Doors", description: "Energy-efficient window replacements and door installations.", icon: "window" },
  { title: "Electrical Services", description: "Panel upgrades, lighting, ceiling fans, EV charger wiring.", icon: "electric" },
  { title: "Plumbing", description: "Fixture installations, pipe repairs, water heater replacements.", icon: "plumbing" },
  { title: "HVAC Services", description: "Furnace and AC installations, duct cleaning.", icon: "hvac" },
  { title: "Exterior Painting & Siding", description: "Professional painting and siding installation.", icon: "exterior" },
  { title: "Fencing", description: "Wood, vinyl, aluminum, and chain-link fence installation.", icon: "fence" },
  { title: "Drywall & Plastering", description: "New drywall installation, patching, skim coating.", icon: "drywall" },
  { title: "Garage Conversion & Doors", description: "Convert your garage into a living space.", icon: "garage" },
  { title: "Gutter & Exterior Cleaning", description: "Gutter installation, cleaning, and pressure washing.", icon: "gutter" },
]

async function main() {
  console.log('Seeding database...')

  await prisma.project.deleteMany()
  await prisma.service.deleteMany()

  for (const project of PROJECTS) {
    await prisma.project.create({ data: project })
  }

  for (const service of SERVICES) {
    await prisma.service.create({ data: service })
  }

  console.log(`Seeded ${PROJECTS.length} projects and ${SERVICES.length} services`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
