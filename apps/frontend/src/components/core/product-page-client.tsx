"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft, Loader2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useProduct, type ProductImage } from "@/hooks/useProduct"
import Image from "next/image"

export function ProductPageClient() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isLoading, error } = useProduct(slug)
  const { addItem, state: cartState } = useCart()
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  // Using String for the Set because your Prisma ID is a UUID string
  const [addingProducts, setAddingProducts] = useState<Set<string>>(new Set())

  if (isLoading || cartState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">This product doesn&apos;t exist in the store.</p>
          <Link href="/">
            <Button className="bg-black text-white hover:bg-black/90">Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = product.images || [];
  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const hasDiscount = !!(compareAtPrice && compareAtPrice > price);
  const discount = hasDiscount ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100) : 0;
  const available = (product.inventory?.quantity ?? 0) > 0;
  
  // Deriving isAddingToCart from the Set
  const isAddingToCart = addingProducts.has(product.id);

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setAddingProducts((prev) => new Set(prev).add(product.id))

    try {
      await addItem({
        id: product.id,
        name: product.name,
        price: price,
        image: product.images?.[0]?.url || "/placeholder.svg",
        handle: product.slug,
        quantity: quantity // Don't forget to pass your selected quantity!
      });
    } finally {
      setAddingProducts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={images[selectedImage]?.url || "/placeholder.svg"}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.slice(0, 4).map((image: ProductImage, index: number) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-black" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {hasDiscount && <Badge className="bg-black text-white mb-4">{discount}% OFF</Badge>}

              {/* Fixed: product.title -> product.name */}
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-black">${price.toFixed(2)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${compareAtPrice?.toFixed(2)}
                    </span>
                    <Badge variant="secondary" className="bg-gray-100 text-black">
                      {discount}% OFF
                    </Badge>
                  </>
                )}
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description || "No description available for this product."}
                </p>
              </div>
            </div>

            {/* Quantity and Add to Cart Form */}
            <form onSubmit={handleAddToCart}>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={isAddingToCart}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={isAddingToCart}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">{available ? "In stock" : "Out of stock"}</span>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={!available || isAddingToCart}
                  className="flex-1 bg-black text-white hover:bg-black/90 text-lg py-6 disabled:opacity-50"
                >
                  {isAddingToCart ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="w-5 h-5 mr-2" />
                  )}
                  {available ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </form>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-black" />
                Free Shipping
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-black" />
                Secure Payment
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RotateCcw className="w-4 h-4 text-black" />
                Easy Returns
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {["description", "details"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "No detailed description available for this product."}
                </p>
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-black">Product ID:</span>
                    {/* Fixed: Removed .split('/') because Prisma uses plain UUID strings */}
                    <span className="text-gray-600">{product.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-black">Handle:</span>
                    <span className="text-gray-600">{product.slug}</span>
                  </div>
                  {available && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-black">Variant:</span>
                      <span className="text-gray-600">{product.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}