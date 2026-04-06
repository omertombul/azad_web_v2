import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PROJECTS = [
  { title: "Modern Kitchen Overhaul", year: 2024, category: "Kitchen", description: "Complete gut-renovation of a dated 1990s kitchen. New custom shaker cabinets, quartz waterfall island, under-cabinet lighting, and herringbone backsplash tile.", image: "https://images.unsplash.com/photo-1771862956702-4e8b247e28b5?w=800&q=80", images: JSON.stringify(["https://images.unsplash.com/photo-1771862956702-4e8b247e28b5?w=800&q=80","https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80","https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80"]) },
  { title: "Spa-Style Master Bathroom", year: 2024, category: "Bathroom", description: "Transformed a cramped master bath into a luxurious spa retreat with a freestanding soaking tub, floor-to-ceiling marble tile, frameless glass shower, and heated floors.", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80", images: JSON.stringify(["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80","https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80"]) },
  { title: "Open-Concept Living Area", year: 2023, category: "Interior", description: "Removed a load-bearing wall to open the kitchen and living room into one flowing space. New LVP flooring, recessed lighting, and a custom built-in entertainment center.", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80", images: JSON.stringify(["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80","https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"]) },
  { title: "Finished Basement Entertainment Room", year: 2023, category: "Basement", description: "Converted an unfinished basement into a full entertainment suite with a wet bar, home theater area, half bath, and custom egress windows for natural light.", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80", images: JSON.stringify(["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80","https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80"]) },
  { title: "Primary Suite Addition", year: 2023, category: "Addition", description: "Built a 600 sq ft primary suite addition including a walk-in closet, ensuite bathroom with dual vanity, and a private reading nook.", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", images: JSON.stringify(["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80","https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80"]) },
  { title: "Full Home Interior Refresh", year: 2024, category: "Interior", description: "Whole-home update including new hardwood floors throughout, fresh interior painting in every room, updated trim, doors, and hardware for a cohesive modern look.", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80", images: JSON.stringify(["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"]) },
  { title: "Guest Bathroom Tile Renovation", year: 2022, category: "Bathroom", description: "Replaced outdated tile with large-format porcelain, installed a new floating vanity, rainfall showerhead, and custom niche shelving.", image: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=800&q=80", images: JSON.stringify(["https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=800&q=80","https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80"]) },
  { title: "Mudroom & Laundry Room Build-Out", year: 2022, category: "Addition", description: "Converted a raw utility space into an organized mudroom and laundry room with built-in lockers, bench seating, custom cabinetry, and durable penny tile flooring.", image: "https://images.unsplash.com/photo-1649805418927-643004a0afe6?w=800&q=80", images: JSON.stringify(["https://images.unsplash.com/photo-1649805418927-643004a0afe6?w=800&q=80"]) },
]

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
