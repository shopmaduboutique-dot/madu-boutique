"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { CartItem } from "@/lib/types"

// Re-export CartItem type for backwards compatibility
export type { CartItem } from "@/lib/types"

const CART_STORAGE_KEY = "madu-boutique-cart"

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  addToCart: (item: CartItem, fromElement?: HTMLElement) => void
  removeFromCart: (id: number, size: string) => void
  updateQuantity: (id: number, size: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Helper to safely access localStorage
function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage errors
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    const storedCart = getStoredCart()
    setCartItems(storedCart)
    setIsHydrated(true)
  }, [])

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      saveCart(cartItems)
    }
  }, [cartItems, isHydrated])

  const addToCart = useCallback((item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prev, item]
    })
  }, [])

  const removeFromCart = useCallback((id: number, size: string) => {
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)))
  }, [])

  const updateQuantity = useCallback(
    (id: number, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id, size)
        return
      }
      setCartItems((prev) => prev.map((i) => (i.id === id && i.size === size ? { ...i, quantity } : i)))
    },
    [removeFromCart]
  )

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
