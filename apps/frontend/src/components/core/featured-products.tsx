"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
// Replace the shopify hook with your new NestJS hook
import { useProducts } from "@/hooks/useProducts" 
import { useProduct } from "@/hooks/useProduct"
import { useParams } from "next/navigation"

export function FeaturedProducts() {
  // Fetching from NestJS (limiting to 6 for the featured section)
  const { data: apiResponse, isLoading, error } = useProducts()
  const { addItem } = useCart()
  
  // Track which products are being added to show individual loading states
  const [addingProducts, setAddingProducts] = useState<Set<number>>(new Set())

  const handleAddToCart = async (productData: any, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    setAddingProducts((prev) => new Set(prev).add(productData.id))

    try {
      await addItem({
        id: productData.id.toString(), // Cart context likely expects a string
        name: productData.title,
        price: Number(productData.price),
        image: productData.image,
        quantity: 1,
        handle: productData.handle,
      })
    } finally {
      setAddingProducts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productData.id)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="animate-spin h-12 w-12 text-black mx-auto mb-4" />
          <p className="text-gray-600">Loading featured products...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 mb-4">Error connecting to Inventory API</p>
          <p className="text-gray-500 text-sm">Make sure your NestJS server is running on port 3001</p>
        </div>
      </section>
    )
  }

  const products = apiResponse?.data || []

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked items from our latest inventory
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const isAddingThisProduct = addingProducts.has(product.id)  
            // Map NestJS data to the UI structure
            const productData = {
              id: product.id,
              title: product.name,
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
                      <Link href={`/products/${productData.handle}`}>
                        <img
                          src={productData.image || "/placeholder.svg"}
                          alt={productData.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      </Link>

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
                          {productData.available ? "Quick Add" : "Out of Stock"}
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <Link href={`/products/${productData.handle}`}>
                        <h3 className="font-semibold text-lg text-black mb-1 group-hover:text-gray-600 transition-colors cursor-pointer line-clamp-2 h-14 leading-7">
                          {productData.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-3">{productData.category}</p>

                      <div className="flex items-center gap-2 mb-4 h-8">
                        <span className="text-2xl font-bold text-black">
                          ${Number(productData.price).toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <Button
                          type="button"
                          className="w-full bg-black text-white hover:bg-black/90"
                          onClick={(e) => handleAddToCart(productData, e)}
                          disabled={!productData.available || isAddingThisProduct}
                        >
                          {isAddingThisProduct ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) :  (
                            <ShoppingCart className="w-4 h-4 mr-2" />
                          )}
                          {productData.available ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-black text-black hover:bg-black hover:text-white bg-transparent"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}