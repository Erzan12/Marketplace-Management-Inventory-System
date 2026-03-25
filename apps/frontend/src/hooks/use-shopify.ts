"use client"

import { useState, useEffect } from "react"
import { getProducts, getProduct, getCollections, type ShopifyProduct, type ShopifyCollection } from "@/lib/shopify"

export function useProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const data = await getProducts(20)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products")
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

export function useProduct(handle: string) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      if (!handle) return

      try {
        setLoading(true)
        const data = await getProduct(handle)
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch product")
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [handle])

  return { product, loading, error }
}

export function useCollections() {
  const [collections, setCollections] = useState<ShopifyCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoading(true)
        const data = await getCollections(10)
        setCollections(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch collections")
        console.error("Error fetching collections:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  return { collections, loading, error }
}
