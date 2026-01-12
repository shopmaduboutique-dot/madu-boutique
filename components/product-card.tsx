"use client"

import { useState } from "react"
import Link from "next/link"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])

  const isSaree = product.category === "saree"

  return (
    <div className="group bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 relative">
      <Link href={`/product/${product.id}`}>
        <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 aspect-square overflow-hidden cursor-pointer">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

          {/* New badge */}
          {product.isNew && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              New
            </div>
          )}
        </div>
      </Link>

      {/* Favorite button */}
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-12 right-3 p-2.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all z-10 active:scale-95 hover:scale-110"
      >
        <svg
          className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"}`}
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Product details */}
      <div className="p-4 sm:p-5">
        <h3 className="text-sm sm:text-base font-bold text-black mb-1.5 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-1">{product.description}</p>

        {/* Price with badge */}
        <div className="mb-4 flex items-baseline gap-2">
          <p className="text-lg sm:text-2xl font-bold text-orange-600">{product.price}</p>
          <p className="text-xs text-gray-500 line-through">{product.originalPrice}</p>
        </div>

        {!isSaree && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-black mb-2 uppercase tracking-widest">Size</label>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border-2 transition-all active:scale-95 ${selectedSize === size
                    ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                    : "border-gray-200 text-black hover:border-orange-300 hover:bg-orange-50"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <Link href={`/product/${product.id}`}>
          <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 sm:py-3.5 rounded-lg font-bold hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all active:scale-95 text-sm sm:text-base">
            Buy Now
          </button>
        </Link>
      </div>
    </div>
  )
}
