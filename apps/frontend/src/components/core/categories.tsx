"use client"

import { Shirt, Watch, Headphones, Gamepad2, Camera, Coffee, Package, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCollections } from "@/hooks/use-shopify"
import { ShopifyCollection } from "@/lib/shopify"

const defaultIcons = [Shirt, Watch, Headphones, Gamepad2, Camera, Coffee, Package, Star]

// Placeholder categories for when Shopify is not configured
const placeholderCategories = [
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
  const { collections, loading, error } = useCollections()

  // Check if Shopify is configured
  const isShopifyConfigured = !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

  // Show loading only for configured stores
  if (loading && isShopifyConfigured) {
    return (
      <section id="categories-section" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading collections...</p>
          </div>
        </div>
      </section>
    )
  }

  // Determine which categories to show
  const categoriesToShow =
    isShopifyConfigured && collections.length > 0 ? collections.slice(0, 8) : placeholderCategories

  return (
    <section id="categories-section" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isShopifyConfigured && collections.length > 0
              ? "Explore our curated collections from your store"
              : "Sample categories - connect your Shopify store to see real collections"}
          </p>
          {!isShopifyConfigured && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 mt-2">
              Demo Mode
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categoriesToShow.map((category, index) => {
            // Handle both real collections and placeholder categories
            const isRealCollection = isShopifyConfigured && collections.length > 0

            let IconComponent
            let categoryData

            if (isShopifyCollection(category)) {
              IconComponent = defaultIcons[index % defaultIcons.length]
              categoryData = {
                id: category.id,
                title: category.title,
                handle: category.handle,
                image: category.image?.url,
                imageAlt: category.image?.altText,
              }
            } else {
              IconComponent = category.icon
              categoryData = {
                id: category.id,
                title: category.title,
                handle: category.handle,
                image: null,
                imageAlt: null,
              }
            }

            return (
              <a
                key={categoryData.id}
                href={isRealCollection ? `/products?collection=${categoryData.handle}` : "#"}
                className="group cursor-pointer"
                onClick={
                  !isRealCollection
                    ? (e) => {
                        e.preventDefault()
                        alert("This is a demo. Connect your Shopify store to browse real collections!")
                      }
                    : undefined
                }
              >
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:border-black transition-all duration-300 relative">
                  {!isShopifyConfigured && (
                    <Badge variant="secondary" className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs">
                      Demo
                    </Badge>
                  )}

                  {categoryData.image ? (
                    <img
                      src={categoryData.image || "/placeholder.svg"}
                      alt={categoryData.imageAlt || categoryData.title}
                      className="w-12 h-12 mx-auto mb-4 rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <IconComponent className="w-12 h-12 mx-auto mb-4 text-black group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <h3 className="font-semibold text-lg text-black">{categoryData.title}</h3>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
