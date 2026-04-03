"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { useAuth } from "./auth-context"
import { cartApi } from "@/lib/api-client"

export interface CartItem {
  id: string // Product UUID from your Prisma schema
  name: string
  price: number
  image: string
  quantity: number
  handle: string // Product slug
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  total: number
  itemCount: number
  loading: boolean
  error: string | null
}

type CartAction =
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string } // payload is product ID
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "SET_LOADING"; payload: boolean }

const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
  loading: true, // Start as true while we check localStorage
  error: null,
}

// Helper to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART": {
      const items = action.payload
      const { total, itemCount } = calculateTotals(items)
      return { ...state, items, total, itemCount, loading: false }
    }

    case "ADD_ITEM": {
      const newItem = action.payload
      const existingItem = state.items.find((item) => item.id === newItem.id)

      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === newItem.id 
            ? { ...item, quantity: item.quantity + newItem.quantity } 
            : item
        )
      } else {
        newItems = [...state.items, newItem]
      }

      const { total, itemCount } = calculateTotals(newItems)
      
      // Persist to local storage
      localStorage.setItem("app_cart", JSON.stringify(newItems))

      return { ...state, items: newItems, total, itemCount, isOpen: true } // Auto-open cart on add
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const { total, itemCount } = calculateTotals(newItems)
      
      localStorage.setItem("app_cart", JSON.stringify(newItems))

      return { ...state, items: newItems, total, itemCount }
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload
      const newItems = state.items
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0)

      const { total, itemCount } = calculateTotals(newItems)
      
      localStorage.setItem("app_cart", JSON.stringify(newItems))

      return { ...state, items: newItems, total, itemCount }
    }

    case "CLEAR_CART":
      localStorage.removeItem("app_cart")
      return { ...state, items: [], total: 0, itemCount: 0 }

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }

    case "OPEN_CART":
      return { ...state, isOpen: true }

    case "CLOSE_CART":
      return { ...state, isOpen: false }

    case "SET_LOADING":
      return { ...state, loading: action.payload }

    default:
      return state
  }
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (item: CartItem) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateItemQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isLoggedIn } = useAuth()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

  const getHeaders = () => ({
    "Content-Type": "application/json",
  })

  // Effect 1: Initialize from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("app_cart")
    if (storedCart) {
      try {
        const items = JSON.parse(storedCart)
        dispatch({ type: "LOAD_CART", payload: items })
      } catch (error) {
        dispatch({ type: "LOAD_CART", payload: [] })
      }
    } else {
      dispatch({ type: "LOAD_CART", payload: [] })
    }
  }, [])

  // Effect 2: Sync with backend when logged in
  useEffect(() => {
    const syncCartWithBackend = async () => {
      if (!isLoggedIn) return

      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const res = await fetch(`${API_URL}/cart`, {
          headers: getHeaders(),
          credentials: "include", // ← sends the accessToken cookie
        })
        const responseData = await res.json()

        const itemsArray = Array.isArray(responseData)
          ? responseData
          : responseData.data || []

        const mappedItems: CartItem[] = itemsArray.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          image: item.product.images?.[0]?.url || "/placeholder.svg",
          quantity: item.quantity,
          handle: item.product.slug,
        }))

        dispatch({ type: "LOAD_CART", payload: mappedItems })
        localStorage.setItem("app_cart", JSON.stringify(mappedItems))
      } catch (error) {
        console.error("Failed to sync cart with database", error)
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    syncCartWithBackend()
  }, [isLoggedIn])

  // Effect 3: Clear cart on logout
  useEffect(() => {
    if (!isLoggedIn) {
      dispatch({ type: "CLEAR_CART" })
    }
  }, [isLoggedIn])

  const addItem = useCallback(async (item: CartItem) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      if (isLoggedIn) {
        await cartApi.addToCart(item.id, item.quantity)
      }
      dispatch({ type: "ADD_ITEM", payload: item })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [isLoggedIn])

  const removeItem = useCallback(async (id: string) => {
    if (isLoggedIn) {
      await cartApi.removeFromCart(id)
    }
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }, [isLoggedIn])

  const updateItemQuantity = useCallback(async (id: string, quantity: number) => {
    if (isLoggedIn) {
      await cartApi.updateCartItem(id, quantity)
    }
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }, [isLoggedIn])

  const clearCart = useCallback(async () => {
    if (isLoggedIn) {
      await cartApi.clearCart()
    }
    dispatch({ type: "CLEAR_CART" })
  }, [isLoggedIn])

  return (
    <CartContext.Provider value={{ state, dispatch, addItem, removeItem, updateItemQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

