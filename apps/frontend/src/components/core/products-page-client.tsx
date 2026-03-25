"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useProducts } from "@/hooks/use-shopify"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Search, Filter, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

// Placeholder products for demo mode
const placeholderProducts = [
  {
    id: "placeholder-1",
    title: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 199.99,
    compareAtPrice: 249.99,
    image: "/placeholder.svg?height=300&width=300",
    handle: "premium-headphones",
    available: true,
  },
  {
    id: "placeholder-2",
    title: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitoring and GPS functionality.",
    price: 299.99,
    compareAtPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    handle: "smart-watch",
    available: true,
  },
  {
    id: "placeholder-3",
    title: "Minimalist Backpack",
    description: "Sleek and functional backpack perfect for work, travel, and everyday use.",
    price: 89.99,
    compareAtPrice: 119.99,
    image: "/placeholder.svg?height=300&width=300",
    handle: "minimalist-backpack",
    available: true,
  },
  {
    id: "placeholder-4",
    title: "Wireless Charging Pad",
    description: "Fast wireless charging for all compatible devices with sleek design.",
    price: 49.99,
    compareAtPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    handle: "wireless-charger",
    available: true,
  },
  {
    id: "placeholder-5",
    title: "Bluetooth Speaker",
    description: "Portable speaker with rich sound quality and long-lasting battery life.",
    price: 129.99,
    compareAtPrice: 159.99,
    image: "/placeholder.svg?height=300&width=300",
    handle: "bluetooth-speaker",
    available: false,
  },
  {
    id: "placeholder-6",
    title: "USB-C Hub",
    description: "Multi-port hub with USB-C, HDMI, and USB-A ports for ultimate connectivity.",
    price: 79.99,
    compareAtPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    handle: "usb-hub",
    available: true,
  },
  {
    id: "placeholder-7",
    title: "Mechanical Keyboard",
    description: "Premium mechanical keyboard with RGB lighting and tactile switches.",
    price: 159.99,
    compareAtPrice: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    handle: "mechanical-keyboard",
    available: true,
  },
  {
    id: "placeholder-8",
    title: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking and long battery life.",
    price: 69.99,
    compareAtPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    handle: "wireless-mouse",
    available: true,
  },
]

export function ProductsPageClient() {
  const { products, loading, error } = useProducts()
  const { addItem, state: cartState } = useCart()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  // Track which products are being added to show individual loading states
  const [addingProducts, setAddingProducts] = useState<Set<string>>(new Set())

  // Check if Shopify is configured
  const isShopifyConfigured = !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

  // Check for collection filter in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const collectionParam = urlParams.get("collection")
    if (collectionParam) {
      setSelectedCollection(collectionParam)
    }
  }, [])

  const handleAddToCart = async (product: any, event: React.MouseEvent) => {
    // Prevent any default behavior and event bubbling
    event.preventDefault()
    event.stopPropagation()

    // For placeholder products, just show a demo message
    if (!isShopifyConfigured) {
      alert("This is a demo. Connect your Shopify store to enable real cart functionality!")
      return
    }

    const variant = product.variants.edges[0]?.node
    if (variant) {
      // Add product ID to loading set
      setAddingProducts((prev) => new Set(prev).add(product.id))

      try {
        await addItem({
          id: variant.id,
          name: product.title,
          price: Number.parseFloat(variant.price.amount),
          image: product.images.edges[0]?.node.url || "/placeholder.svg",
          handle: product.handle,
        })
      } finally {
        // Remove product ID from loading set
        setAddingProducts((prev) => {
          const newSet = new Set(prev)
          newSet.delete(product.id)
          return newSet
        })
      }
    }
  }

  // Determine which products to show
  const productsToShow = isShopifyConfigured && products.length > 0 ? products : placeholderProducts

  // Filter products by search and collection
  const filteredProducts = productsToShow.filter((product) => {
    const isRealProduct = isShopifyConfigured && products.length > 0

    const title = isRealProduct ? product.title : product.title
    const description = isRealProduct ? product.description : product.description

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())

    // If no collection selected, show all products that match search
    if (!selectedCollection) {
      return matchesSearch
    }

    // For demo mode, just show all products
    return matchesSearch
  })

  // Show loading only for configured stores
  if (loading && isShopifyConfigured) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error only for configured stores
  if (error && isShopifyConfigured) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">Error loading products:</p>
            <p className="text-red-500 text-sm mb-4 break-words max-w-lg mx-auto">{error}</p>
            <p className="text-gray-600 mb-4">
              Please ensure your `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` environment variable is correctly set.
            </p>
            <Button onClick={() => window.location.reload()} className="bg-black text-white hover:bg-black/90">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header with collection filter indicator */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {selectedCollection ? `Collection: ${selectedCollection}` : "All Products"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isShopifyConfigured
              ? "Discover our complete collection of amazing products"
              : "Sample products - connect your Shopify store to see real products"}
          </p>
          {!isShopifyConfigured && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 mt-2">
              Demo Mode
            </Badge>
          )}
          {selectedCollection && (
            <Button
              variant="outline"
              className="mt-4 border-gray-300 bg-transparent"
              onClick={() => {
                setSelectedCollection(null)
                window.history.pushState({}, "", "/products")
              }}
            >
              Clear Filter
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-gray-300 focus:border-black"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>

            <Button variant="outline" className="px-6 border-gray-300 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => {
              const isRealProduct = isShopifyConfigured && products.length > 0

              let productData
              if (isRealProduct) {
                const variant = product.variants.edges[0]?.node
                const image = product.images.edges[0]?.node
                const price = variant ? Number.parseFloat(variant.price.amount) : 0
                const compareAtPrice = product.compareAtPriceRange.minVariantPrice.amount
                const hasDiscount = compareAtPrice && Number.parseFloat(compareAtPrice) > price

                productData = {
                  id: product.id,
                  title: product.title,
                  description: product.description,
                  price,
                  compareAtPrice: compareAtPrice ? Number.parseFloat(compareAtPrice) : null,
                  hasDiscount,
                  image: image?.url || "/placeholder.svg",
                  imageAlt: image?.altText || product.title,
                  handle: product.handle,
                  available: variant?.availableForSale || false,
                }
              } else {
                // Use placeholder data
                const hasDiscount = product.compareAtPrice !== null
                productData = {
                  id: product.id,
                  title: product.title,
                  description: product.description,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  hasDiscount,
                  image: product.image,
                  imageAlt: product.title,
                  handle: product.handle,
                  available: product.available,
                }
              }

              // Check if this specific product is being added
              const isAddingThisProduct = addingProducts.has(productData.id)

              return (
                <div key={productData.id} className="h-full">
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 h-full flex flex-col relative">
                    {!isShopifyConfigured && (
                      <Badge
                        variant="secondary"
                        className="absolute top-4 right-4 z-10 bg-yellow-100 text-yellow-800 text-xs"
                      >
                        Demo
                      </Badge>
                    )}

                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative overflow-hidden">
                        <Link href={isRealProduct ? `/product/${productData.handle}` : "#"}>
                          <img
                            src={productData.image || "/placeholder.svg"}
                            alt={productData.imageAlt}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          />
                        </Link>

                        {productData.hasDiscount && (
                          <Badge className="absolute top-4 left-4 bg-black text-white">Sale</Badge>
                        )}

                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            type="button"
                            className="bg-white text-black hover:bg-gray-100 border border-gray-200"
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={!productData.available || isAddingThisProduct}
                          >
                            {isAddingThisProduct ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <ShoppingCart className="w-4 h-4 mr-2" />
                            )}
                            Quick Add
                          </Button>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <Link href={isRealProduct ? `/product/${productData.handle}` : "#"}>
                          <h3 className="font-semibold text-lg text-black mb-2 group-hover:text-gray-600 transition-colors cursor-pointer line-clamp-2 h-14 leading-7">
                            {productData.title}
                          </h3>
                        </Link>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 leading-5">
                          {productData.description}
                        </p>

                        <div className="flex items-center gap-2 mb-4 h-8">
                          <span className="text-2xl font-bold text-black">${productData.price.toFixed(2)}</span>
                          {productData.hasDiscount && productData.compareAtPrice && (
                            <>
                              <span className="text-lg text-gray-500 line-through">
                                ${productData.compareAtPrice.toFixed(2)}
                              </span>
                              <Badge variant="secondary" className="bg-gray-100 text-black text-xs">
                                {Math.round(
                                  ((productData.compareAtPrice - productData.price) / productData.compareAtPrice) * 100,
                                )}
                                % OFF
                              </Badge>
                            </>
                          )}
                        </div>

                        <div className="mt-auto">
                          <Button
                            type="button"
                            className="w-full bg-black text-white hover:bg-black/90"
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={!productData.available || isAddingThisProduct}
                          >
                            {isAddingThisProduct ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Add to Cart"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
