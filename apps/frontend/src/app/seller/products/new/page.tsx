"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { categoryApi, productsApi } from "@/lib/api-client"
import { ArrowLeft, Loader2, PackagePlus, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
  })

  // Fetch the global categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll()
        setCategories(res.data)
      } catch (error) {
        console.error("Failed to load categories", error)
      } finally {
        setIsLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await productsApi.create({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        // Convert to Number if your DB expects it, or keep as string if it's a UUID
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined, 
      })
      
      // Redirect back to seller's inventory after successful creation
      router.push("/seller/products")
    } catch (error) {
      console.error("Failed to create product", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Back navigation */}
      <Link href="/seller/products">
        <Button variant="ghost" className="text-gray-600 hover:text-black p-0 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </Link>

      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-bold text-black mb-2">Add New Product</h1>
        <p className="text-gray-600">Fill in the details to list your item in the marketplace.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Product Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-black block mb-1">Product Title</label>
              <Input
                type="text"
                name="name"
                placeholder="e.g. Vintage Leather Jacket"
                value={formData.name}
                onChange={handleChange}
                className="border-gray-300 focus:border-black"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black block mb-1">Description</label>
              <Textarea
                name="description"
                placeholder="Describe your product's condition, material, sizing, etc."
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="border-gray-300 focus:border-black resize-none"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-black block mb-1">Price ($)</label>
                <Input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black block mb-1">Stock Quantity</label>
                <Input
                  type="number"
                  name="quantity"
                  placeholder="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-black"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Organization & Media */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Category Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <label className="text-sm font-medium text-black block mb-2">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black bg-white text-sm"
              required
            >
              <option value="">Select a Category</option>
              {isLoadingCategories ? (
                <option disabled>Loading...</option>
              ) : (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Dummy Image Upload Block for Visual Aesthetic */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <label className="text-sm font-medium text-black block mb-2">Product Images</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-black transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Click or drag to upload images</p>
            </div>
          </div>

          {/* Submit Action */}
          <Button 
            type="submit" 
            className="w-full bg-black text-white hover:bg-black/90 py-6 text-base font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <>
                <PackagePlus className="w-5 h-5 mr-2" />
                Publish Product
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  )
}