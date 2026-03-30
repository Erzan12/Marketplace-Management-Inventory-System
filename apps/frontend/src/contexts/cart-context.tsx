"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import {
  createCart,
  getCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  type ShopifyCart,
  type ShopifyCartLine,
} from "@/lib/shopify/shopify"

export interface CartItem {
  id: string // Shopify ProductVariant ID
  cartLineId?: string // Shopify CartLine ID
  name: string
  price: number
  image: string
  quantity: number
  handle: string // Product handle for linking to product page
}

interface CartState {
  shopifyCartId: string | null
  items: CartItem[]
  isOpen: boolean
  total: number
  itemCount: number
  checkoutUrl: string | null
  loading: boolean
  error: string | null
}

type CartAction =
  | { type: "SET_CART_DATA"; payload: { cart: ShopifyCart | null; cartId: string | null } }
  | { type: "ADD_ITEM_OPTIMISTIC"; payload: Omit<CartItem, "cartLineId"> }
  | { type: "REMOVE_ITEM_OPTIMISTIC"; payload: string } // payload is cartLineId
  | { type: "UPDATE_QUANTITY_OPTIMISTIC"; payload: { cartLineId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }

const initialState: CartState = {
  shopifyCartId: null,
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
  checkoutUrl: null,
  loading: false,
  error: null,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART_DATA": {
      const { cart, cartId } = action.payload
      if (!cart) {
        return {
          ...state,
          shopifyCartId: cartId,
          items: [],
          total: 0,
          itemCount: 0,
          checkoutUrl: null,
          loading: false,
          error: null,
        }
      }

      const newItems: CartItem[] = cart.lines.edges.map((edge: { node: ShopifyCartLine }) => ({
        id: edge.node.merchandise.id, // ProductVariant ID
        cartLineId: edge.node.id, // CartLine ID
        name: edge.node.merchandise.product.title,
        price: Number.parseFloat(edge.node.merchandise.price.amount),
        image: edge.node.merchandise.product.images.edges[0]?.node.url || "/placeholder.svg",
        quantity: edge.node.quantity,
        handle: edge.node.merchandise.product.handle,
      }))

      const total = Number.parseFloat(cart.cost.totalAmount.amount)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        shopifyCartId: cartId,
        items: newItems,
        total,
        itemCount,
        checkoutUrl: cart.checkoutUrl,
        loading: false,
        error: null,
      }
    }

    case "ADD_ITEM_OPTIMISTIC": {
      const { id, name, price, image, handle } = action.payload
      const existingItem = state.items.find((item) => item.id === id)

      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Assign a temporary cartLineId for optimistic updates
        newItems = [...state.items, { ...action.payload, quantity: 1, cartLineId: `temp-${Date.now()}` }]
      }

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      }
    }

    case "REMOVE_ITEM_OPTIMISTIC": {
      const newItems = state.items.filter((item) => item.cartLineId !== action.payload)
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      }
    }

    case "UPDATE_QUANTITY_OPTIMISTIC": {
      const { cartLineId, quantity } = action.payload
      const newItems = state.items
        .map((item) => (item.cartLineId === cartLineId ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0) // Remove if quantity becomes 0

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      }
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
        checkoutUrl: null,
      }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case "OPEN_CART":
      return {
        ...state,
        isOpen: true,
      }

    case "CLOSE_CART":
      return {
        ...state,
        isOpen: false,
      }

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (item: Omit<CartItem, "cartLineId" | "quantity">, quantity?: number) => Promise<void>
  removeItem: (cartLineId: string) => Promise<void>
  updateItemQuantity: (cartLineId: string, quantity: number) => Promise<void>
  clearShopifyCart: () => Promise<void>
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Check if Shopify is configured
  const isShopifyConfigured = !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

  // helper: create a new cart, persist ID, update state
  const createFreshCart = useCallback(async () => {
    // Don't try to create cart if Shopify is not configured
    if (!isShopifyConfigured) {
      return null
    }

    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const newCart = await createCart()
      localStorage.setItem("shopify_cart_id", newCart.id)
      dispatch({ type: "SET_CART_DATA", payload: { cart: newCart, cartId: newCart.id } })
      return newCart.id
    } catch (err) {
      console.error("Failed to create Shopify cart:", err)
      dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Failed to create cart" })
      return null
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [isShopifyConfigured])

  const fetchShopifyCart = useCallback(
    async (cartId: string) => {
      // Don't try to fetch cart if Shopify is not configured
      if (!isShopifyConfigured) {
        return
      }

      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })
      try {
        const shopifyCart = await getCart(cartId)
        dispatch({ type: "SET_CART_DATA", payload: { cart: shopifyCart, cartId } })
      } catch (err) {
        console.error("Failed to fetch Shopify cart:", err)
        dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Failed to load cart" })
        // Clear local cart if Shopify cart cannot be loaded
        dispatch({ type: "SET_CART_DATA", payload: { cart: null, cartId: null } })
        localStorage.removeItem("shopify_cart_id")
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [isShopifyConfigured],
  )

  // Initialize cart on mount
  useEffect(() => {
    // Only initialize cart if Shopify is configured
    if (!isShopifyConfigured) {
      // Set initial state for unconfigured Shopify
      dispatch({ type: "SET_LOADING", payload: false })
      return
    }

    const storedCartId = localStorage.getItem("shopify_cart_id")
    if (storedCartId) {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })
      fetchShopifyCart(storedCartId)
    } else {
      // Create a new cart if none exists
      const createNewShopifyCart = async () => {
        dispatch({ type: "SET_LOADING", payload: true })
        dispatch({ type: "SET_ERROR", payload: null })
        try {
          const newCart = await createCart()
          localStorage.setItem("shopify_cart_id", newCart.id)
          dispatch({ type: "SET_CART_DATA", payload: { cart: newCart, cartId: newCart.id } })
        } catch (err) {
          console.error("Failed to create Shopify cart:", err)
          dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Failed to create cart" })
        } finally {
          dispatch({ type: "SET_LOADING", payload: false })
        }
      }
      createNewShopifyCart()
    }
  }, [fetchShopifyCart, isShopifyConfigured])

  const addItem = useCallback(
    async (item: Omit<CartItem, "cartLineId" | "quantity">, quantity = 1) => {
      // Don't try to add items if Shopify is not configured
      if (!isShopifyConfigured) {
        return
      }

      // STEP 1: ensure we have a cart id – if not, create one
      let cartId = state.shopifyCartId
      if (!cartId) {
        cartId = await createFreshCart()
        if (!cartId) return // bail if we still have no cart
      }

      dispatch({ type: "ADD_ITEM_OPTIMISTIC", payload: { ...item, quantity } })
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      try {
        const updatedCart = await addCartLines(cartId, [{ merchandiseId: item.id, quantity }])
        dispatch({ type: "SET_CART_DATA", payload: { cart: updatedCart, cartId } })
      } catch (err: any) {
        // if the cart was invalidated ("does not exist"), create a new one once and retry
        const message = err instanceof Error ? err.message : ""
        if (message.toLowerCase().includes("does not exist")) {
          console.warn("Cart invalid, creating fresh cart and retrying…")
          cartId = await createFreshCart()
          if (!cartId) return
          try {
            const updatedCart = await addCartLines(cartId, [{ merchandiseId: item.id, quantity }])
            dispatch({ type: "SET_CART_DATA", payload: { cart: updatedCart, cartId } })
          } catch (retryErr) {
            console.error("Retry failed:", retryErr)
            dispatch({
              type: "SET_ERROR",
              payload: retryErr instanceof Error ? retryErr.message : "Failed to add item",
            })
            fetchShopifyCart(cartId) // attempt to sync
          }
        } else {
          console.error("Failed to add item to Shopify cart:", err)
          dispatch({ type: "SET_ERROR", payload: message || "Failed to add item" })
          fetchShopifyCart(cartId) // revert optimistic update
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.shopifyCartId, fetchShopifyCart, createFreshCart, isShopifyConfigured],
  )

  const removeItem = useCallback(
    async (cartLineId: string) => {
      // Don't try to remove items if Shopify is not configured
      if (!isShopifyConfigured) {
        return
      }

      if (!state.shopifyCartId) {
        dispatch({ type: "SET_ERROR", payload: "Cart not initialized. Please refresh." })
        return
      }

      dispatch({ type: "REMOVE_ITEM_OPTIMISTIC", payload: cartLineId })
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      try {
        const updatedCart = await removeCartLines(state.shopifyCartId, [cartLineId])
        dispatch({ type: "SET_CART_DATA", payload: { cart: updatedCart, cartId: state.shopifyCartId } })
      } catch (err) {
        console.error("Failed to remove item from Shopify cart:", err)
        dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Failed to remove item" })
        // Revert optimistic update by refetching
        fetchShopifyCart(state.shopifyCartId)
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.shopifyCartId, fetchShopifyCart, isShopifyConfigured],
  )

  const updateItemQuantity = useCallback(
    async (cartLineId: string, quantity: number) => {
      // Don't try to update items if Shopify is not configured
      if (!isShopifyConfigured) {
        return
      }

      if (!state.shopifyCartId) {
        dispatch({ type: "SET_ERROR", payload: "Cart not initialized. Please refresh." })
        return
      }

      dispatch({ type: "UPDATE_QUANTITY_OPTIMISTIC", payload: { cartLineId, quantity } })
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      try {
        const updatedCart = await updateCartLines(state.shopifyCartId, [{ id: cartLineId, quantity }])
        dispatch({ type: "SET_CART_DATA", payload: { cart: updatedCart, cartId: state.shopifyCartId } })
      } catch (err) {
        console.error("Failed to update item quantity in Shopify cart:", err)
        dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Failed to update quantity" })
        // Revert optimistic update by refetching
        fetchShopifyCart(state.shopifyCartId)
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.shopifyCartId, fetchShopifyCart, isShopifyConfigured],
  )

  const clearShopifyCart = useCallback(async () => {
    // Don't try to clear cart if Shopify is not configured
    if (!isShopifyConfigured) {
      return
    }

    if (!state.shopifyCartId) return

    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })
    try {
      // Remove all lines by updating their quantity to 0
      const lineIdsToRemove = state.items.map((item) => item.cartLineId!).filter(Boolean) as string[]
      if (lineIdsToRemove.length > 0) {
        await removeCartLines(state.shopifyCartId, lineIdsToRemove)
      }
      dispatch({ type: "CLEAR_CART" })
      // Optionally, create a new empty cart or just rely on the next page load to create one
      // For now, we'll just clear local state and let the next interaction create a new cart if needed.
      localStorage.removeItem("shopify_cart_id")
    } catch (err) {
      console.error("Failed to clear Shopify cart:", err)
      dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Failed to clear cart" })
      fetchShopifyCart(state.shopifyCartId) // Attempt to restore state
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [state.shopifyCartId, state.items, fetchShopifyCart, isShopifyConfigured])

  return (
    <CartContext.Provider value={{ state, dispatch, addItem, removeItem, updateItemQuantity, clearShopifyCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
