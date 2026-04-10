"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star } from "lucide-react"
import { useMemo } from "react"
import Link from "next/link"
import { useProducts } from "@/hooks/useProducts"
import { useQuery } from "@tanstack/react-query"
import { storeApi } from "@/lib/api-client"
import Image from "next/image"
import { ProductImage } from "@/hooks/useProduct"

export interface Product {
  id: string
  name: string
  price: number
  slug: string
  images?: ProductImage[]
  inventory?: {
    quantity: number
  }
}

export function Hero() {
  // Get dynamic store name for the hero title
  // const storeName = getStoreName()
  const storeName = "your store"
  const { data: apiResponse, isLoading } = useProducts({
    })

  // Inside your Hero or a parent Layout
  const { data: userStore, isLoading: loadingStore } = useQuery({
    
    queryKey: ['my-store'],
    queryFn: () => storeApi.getMyStore().then(res => res.data),
    retry: false // Don't retry if 404 (user isn't a seller yet)
  });

  const isLoadingAny = isLoading || loadingStore

  const isSeller = !!userStore; // This replaces isShopifyConfigured

  const products = apiResponse?.data || []

  // Select a random featured product
  const featuredProduct = useMemo(() => {
    if (products.length === 0) return null
    const randomIndex = Math.floor(Math.random() * products.length)
    return products[randomIndex]
  }, [products])

  const productDetails = useMemo(() => {
    if (!featuredProduct) return null

    const title = featuredProduct.name
    const price = Number(featuredProduct.price)
    const compareAtPrice = featuredProduct.compareAtPrice ? Number(featuredProduct.compareAtPrice) : null
    
    // Sale logic: if compareAtPrice exists and is higher than current price
    const hasDiscount = !!(compareAtPrice && compareAtPrice > price)
    
    // Get primary image or first available
    const primaryImage = featuredProduct.images?.find((img) => img.url) || featuredProduct.images?.[0]

    return {
      title,
      price,
      compareAtPrice,
      hasDiscount,
      image: primaryImage?.url || "/placeholder.svg?height=400&width=400",
      imageAlt: primaryImage?.url || title,
      handle: featuredProduct.slug,
      available: (featuredProduct.inventory?.quantity ?? 0) > 0,
    }
  }, [featuredProduct])

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Simplified container to match other components */}
      <div className="container mx-auto px-4 h-screen flex items-center">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left content - simplified */}
            <div className="space-y-8">
              {/* Simplified badge */}
              <Badge variant="outline" className="border-black text-black bg-transparent px-4 py-2 w-fit">
                <Star className="w-4 h-4 mr-2 fill-black" />
                {/* {isShopifyConfigured ? "New Collection Available" : "Demo Store"} */}
                {/* {isSeller ? "New Collection Available" : "Connecting to Inventory..."} */}
                {/* {products.length > 0 ? "New Collection Available" : "Connecting to Inventory..."} */}
                {isLoadingAny
                  ? "Connecting to Inventory..."
                  : products.length > 0
                    ? "New Collection Available"
                    : "No Products Available"
                }
              </Badge>

              {/* Dynamic hero title */}
              <div>
                <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
                  {storeName ? (
                    <>
                      Shop the
                      <span className="block">Future</span>
                    </>
                  ) : (
                    <>
                      Welcome to
                      <span className="block">{storeName}</span>
                    </>
                  )}
                </h1>

                <p className="text-xl text-black/70 mb-8 max-w-lg leading-relaxed">
                  {isSeller
                    ? "Discover amazing products that blend style, innovation, and quality."
                    : "This is a demo storefront. Create your own store to feature new products."}
                </p>
              </div>

              {/* Functional buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-black text-white hover:bg-black/90 text-lg px-8 py-6 border-0">
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white text-lg px-8 py-6 bg-transparent"
                  >
                    Explore Collections
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right content - show placeholder or real product */}
            <div className="relative">
              {isLoading ? (
                // Simplified loading state
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="w-full h-80 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ) : productDetails ? (
                // Real product showcase
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <Link href={`/products/${productDetails.handle}`}>
                    <Image
                      src={productDetails.image}
                      alt={productDetails.imageAlt}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                      className="w-full h-80 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity duration-300"
                    />
                  </Link>

                  {/* Product info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Link href={`/products/${productDetails.handle}`}>
                        <h3 className="font-semibold text-lg text-black hover:text-gray-600 transition-colors cursor-pointer line-clamp-1">
                          {productDetails.title}
                        </h3>
                      </Link>
                      {productDetails.hasDiscount && <Badge className="bg-black text-white text-xs">Sale</Badge>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-black text-black" />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">(4.9)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xl text-black">${Number(productDetails.price).toFixed(2)}</span>
                        {productDetails.hasDiscount && productDetails.compareAtPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${productDetails.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Placeholder product showcase
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 relative">
                  {!isSeller && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                        Demo
                      </Badge>
                    </div>
                  )}
                  <Image
                    src="/placeholder.svg?height=320&width=400"
                    alt="Sample Product"
                    className="w-full h-80 object-cover rounded-lg mb-4"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-black">Premium Product</h3>
                      <Badge className="bg-black text-white text-xs">New</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-black text-black" />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">(4.9)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xl text-black">$99.99</span>
                        <span className="text-sm text-gray-500 line-through">$129.99</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom stats - show real or placeholder data */}
          <div className="mt-20 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-2xl font-bold text-black">10K+</p>
                <p className="text-gray-600 text-sm">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">{isSeller ? `${products.length}+` : "50+"}</p>
                <p className="text-gray-600 text-sm">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">99%</p>
                <p className="text-gray-600 text-sm">Satisfaction</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">24/7</p>
                <p className="text-gray-600 text-sm">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
