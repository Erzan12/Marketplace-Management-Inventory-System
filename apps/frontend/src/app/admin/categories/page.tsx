"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { categoryApi } from "@/lib/api-client"
import { FolderPlus, Loader2, Pencil, Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  products?: any[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form State
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''))
  }

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const res = await categoryApi.getAll()
      setCategories(res.data)
    } catch (error) {
      console.error("Failed to load categories", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId) {
        await categoryApi.update(editingId, { name, slug })
        setEditingId(null)
      } else {
        await categoryApi.create({ name, slug })
      }
      setName("")
      setSlug("")
      fetchCategories()
    } catch (error) {
      console.error("Failed to save category", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setName(category.name)
    setSlug(category.slug)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    
    try {
      await categoryApi.delete(id)
      fetchCategories()
    } catch (error) {
      console.error("Failed to delete category", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-black mb-2">Categories</h1>
        <p className="text-gray-600">Create and manage global categories for your marketplace.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Create/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
              <FolderPlus className="w-5 h-5" />
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-black block mb-1">Category Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Electronics"
                  value={name}
                  onChange={handleNameChange}
                  className="border-gray-300 focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-black block mb-1">Slug (URL)</label>
                <Input
                  type="text"
                  placeholder="e.g. electronics"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="border-gray-300 focus:border-black bg-gray-50"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  type="submit" 
                  className="bg-black text-white hover:bg-black/90 flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : editingId ? "Update" : "Create"}
                </Button>
                
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-black text-black"
                    onClick={() => {
                      setEditingId(null)
                      setName("")
                      setSlug("")
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right: Category List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-black mb-6">Existing Categories</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
                No categories created yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <div key={category.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-black text-lg">{category.name}</p>
                      <p className="text-sm text-gray-500">Slug: /{category.slug}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-gray-300">
                        {category.products?.length || 0} Products
                      </Badge>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="hover:bg-gray-100"
                      >
                        <Pencil className="w-4 h-4 text-black" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}