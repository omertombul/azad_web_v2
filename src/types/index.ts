export interface Project {
  id: number
  title: string
  title_fr: string
  year: number
  category: string
  description: string
  description_fr: string
  image: string
  images: string[]
}

export interface Service {
  id: number
  title: string
  title_fr: string
  description: string
  description_fr: string
  icon: string
}
