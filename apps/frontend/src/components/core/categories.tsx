"use client"

import { Shirt, Watch, Headphones, Gamepad2, Camera, Coffee, Package, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCollections } from "@/hooks/shopify/use-shopify"
import { ShopifyCollection } from "@/lib/shopify/shopify"
import apiClient from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

type Category = {
  id: string
  name?: string
  title?: string
  slug?: string
  handle?: string
  icon?: any
}


const defaultIcons = [Shirt, Watch, Headphones, Gamepad2, Camera, Coffee, Package, Star]

// Placeholder categories for when Shopify is not configured
const placeholderCategories: Category[] = [
  { id: "1", title: "Electronics", handle: "electronics", icon: Headphones },
  { id: "2", title: "Fashion", handle: "fashion", icon: Shirt },
  { id: "3", title: "Accessories", handle: "accessories", icon: Watch },
  { id: "4", title: "Gaming", handle: "gaming", icon: Gamepad2 },
  { id: "5", title: "Photography", handle: "photography", icon: Camera },
  { id: "6", title: "Lifestyle", handle: "lifestyle", icon: Coffee },
  { id: "7", title: "Tech Gear", handle: "tech-gear", icon: Package },
  { id: "8", title: "Premium", handle: "premium", icon: Star },
]

function isShopifyCollection(category: any): category is ShopifyCollection {
  return 'image' in category
}

export function Categories() {
  // 1. Fetch from your NestJS API
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => apiClient.get('/categories').then(res => res.data)
  })

  // 2. Logic to decide what to show
  const hasRealCategories = categories && categories.length > 0
  const categoriesToShow = hasRealCategories ? categories.slice(0, 8) : placeholderCategories

  return (
    <section id="categories-section" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {hasRealCategories 
              ? "Explore our curated collections" 
              : "Discover our upcoming collections"}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categoriesToShow.map((category, index) => {
            // use both in const slug
            const slug = category.slug || category.handle

            const Icon =
              "icon" in category
                ? category.icon // from placeholderCategories
                : defaultIcons[index % defaultIcons.length] // fallback for DB categories

            return (
              <Link
                key={category.id}
                href={`/products?category=${slug}`}
                className="group cursor-pointer"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:border-black transition-all duration-300">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-black group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-lg text-black">
                    {category.name || category.title}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
