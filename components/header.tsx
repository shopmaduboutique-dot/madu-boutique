"use client"

import { useCart } from "@/lib/cart-context"

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart()

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and branding */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Madu Boutique Logo"
              className="w-10 h-10 object-contain rounded flex-shrink-0"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-black">Madu Boutique</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Premium Traditional Wear</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 hover:bg-orange-50 rounded-lg transition-colors flex-shrink-0"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
