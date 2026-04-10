export type CartApiItem = {
  quantity: number
  product: {
    id: string
    name: string
    price: string | number
    slug: string
    images?: {
      url: string
    }[]
  }
}