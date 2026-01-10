"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import PhoneAuthModal from "@/components/phone-auth-modal"

export function CartDrawer() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Handle checkout - check auth first
  const handleCheckout = () => {
    if (authLoading) return
    if (isAuthenticated) {
      setIsCartOpen(false)
      router.push("/checkout")
    } else {
      setShowAuthModal(true)
    }
  }

  // After successful auth, proceed to checkout
  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    setIsCartOpen(false)
    router.push("/checkout")
  }

  if (!isCartOpen) return null

  const total = cartItems.reduce((sum, item) => {
    const price = Number.parseInt(item.price.replace("₹", "").replace(/,/g, ""))
    return sum + price * item.quantity
  }, 0)

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsCartOpen(false)} />

      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-sm bg-white shadow-xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Shopping Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-black text-2xl">
            ×
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-orange-600 font-medium hover:text-orange-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 border border-gray-200 rounded-lg p-3">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-black text-sm">{item.name}</h3>
                  <p className="text-orange-600 font-bold text-sm">{item.price}</p>
                  {item.size !== "Free Size" && item.size !== "One Size" && (
                    <p className="text-gray-600 text-xs">Size: {item.size}</p>
                  )}

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="ml-auto text-red-500 hover:text-red-700 text-sm font-bold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex justify-between font-bold text-black">
              <span>Total:</span>
              <span className="text-orange-600">₹{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {authLoading ? "Loading..." : "Proceed to Checkout"}
            </button>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <PhoneAuthModal isOpen={showAuthModal} onSuccess={handleAuthSuccess} />
    </>
  )
}

