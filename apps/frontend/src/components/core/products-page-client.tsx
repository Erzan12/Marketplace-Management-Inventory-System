"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Search, Filter, Loader2 } from "lucide-react"
import { Pagination } from "../ui/pagination-custom/pagination-custom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"

// Updated to use the custom hook for products
import { useProducts } from "@/hooks/useProducts"
import { useDebounce } from "@/hooks/useDebounce" // Recommended for search input

export function ProductsPageClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  // Track which products are being added to show individual loading states
  const [addingProducts, setAddingProducts] = useState<Set<string>>(new Set())

  // Debounce the search term to avoid hitting the API on every keystroke
  const debouncedSearch = useDebounce(searchTerm, 500)

  // 2. Pass currentPage to the hook
  const { data: apiResponse, isLoading, error } = useProducts({
    search: debouncedSearch,
    category: selectedCollection || undefined,
    page: currentPage, // This sends ?page=X to your NestJS API
  })

  // Reset to page 1 when searching or filtering
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedCollection])

  const { addItem } = useCart()
  
  // Sync collection from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const collectionParam = urlParams.get("collection")
    if (collectionParam) {
      setSelectedCollection(collectionParam)
    }
  }, [])

 
  
  const handleAddToCart = async (product: any, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    setAddingProducts((prev) => new Set(prev).add(product.id))
    try {
      await addItem({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "/placeholder.svg",
        quantity: product.quantity,
        handle: product.slug,
      })
    } finally {
      setAddingProducts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-20 text-center">
        <Loader2 className="animate-spin h-12 w-12 text-black mx-auto mb-4" />
        <p className="text-gray-600">Loading inventory...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-20 text-center">
        <p className="text-red-600 mb-4">Error connecting to Inventory API</p>
        <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
      </div>
    )
  }

  const products = apiResponse?.data || []
  const meta = apiResponse?.meta // Accessing totalItems, lastPage, etc.

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header with collection filter indicator */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {selectedCollection ? `Collection: ${selectedCollection}` : "All Products"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of amazing products
          </p>

          {/* {!isShopifyConfigured && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 mt-2">
              Demo Mode
            </Badge>
          )} */}
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

        {/* Search and Sort */}
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
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => {
              // Check if this specific product is being added
              const isAddingThisProduct = addingProducts.has(product.id)
              // Map NestJS data to the UI structure
            const productData = {
              id: product.id,
              title: product.name,
              description: product.description,
              price: product.price,
              image: product.images?.[0]?.url || "/placeholder.svg",
              handle: product.slug,
              available: (product.inventory?.quantity ?? 0) > 0,
              category: product.category?.name,
            }

              return (
                <div key={productData.id} className="h-full">
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 h-full flex flex-col relative">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative overflow-hidden">
                        {/* <Link href={isAddingThisProduct ? `/product/${productData.handle}` : "#"}> */}
                        <Link href={`/products/${productData.handle}`}>
                          <img
                            src={productData.image}
                            alt={productData.title}
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          />
                        </Link>

                        {product.hasDiscount && (
                          <Badge className="absolute top-4 left-4 bg-black text-white">Sale</Badge>
                        )}

                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            type="button"
                            className="bg-white text-black hover:bg-gray-100 border border-gray-200"
                            onClick={(e) => handleAddToCart(productData, e)}
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
                        {/* <Link href={isAddingThisProduct ? `/product/${productData.handle}` : "#"}> */}
                        <Link href={`/products/${productData.handle}`}>
                          <h3 className="font-semibold text-lg text-black mb-2 group-hover:text-gray-600 transition-colors cursor-pointer line-clamp-2 h-14 leading-7">
                            {productData.title}
                          </h3>
                        </Link>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 leading-5">
                          {productData.description}
                        </p>

                        {/* <div className="flex items-center gap-2 mb-4 h-8">
                          <span className="text-2xl font-bold text-black">${product.price.toFixed(2)}</span>
                          {product.hasDiscount && product.compareAtPrice && (
                            <>
                              <span className="text-lg text-gray-500 line-through">
                                ${product.compareAtPrice.toFixed(2)}
                              </span>
                              <Badge variant="secondary" className="bg-gray-100 text-black text-xs">
                                {Math.round(
                                  ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
                                )}
                                % OFF
                              </Badge>
                            </>
                          )}
                        </div> */}
                        <div className="flex items-center gap-2 mb-4 h-8">
                          <span className="text-2xl font-bold text-black">${Number(productData.price).toFixed(2)}</span>
                        </div>

                        <div className="mt-auto">
                          <Button
                            type="button"
                            className="w-full bg-black text-white hover:bg-black/90"
                            onClick={(e) => handleAddToCart(productData, e)}
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
        {/* 3. Add the Pagination Component */}
        {meta && (
          <Pagination
            currentPage={currentPage}
            totalPages={meta.lastPage}
            onPageChange={(page) => {
              setCurrentPage(page)
              window.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll up on page change
            }}
          />
        )}
      </div>
    </div>
  )
}
