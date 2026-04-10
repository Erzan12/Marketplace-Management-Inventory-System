export type ProductImage = {
  url: string
  isPrimary?: boolean
  altText?: string
}

export type Inventory = {
  quantity: number
}

export type Category = {
  name: string
}

export type Product = {
  id: string
  name: string
  description?: string | null
  price: string | number
  slug: string
  compareAtPrice?: string | number | null

  images?: ProductImage[]
  inventory?: Inventory
  category?: Category
}

export interface UIProduct {
  id: string
  title: string
  price: string | number
  image: string
  handle: string
  available: boolean
  category?: string
}