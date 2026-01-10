"use client"

import type React from "react"
import { useState, useEffect, use } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/types"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAddToCartSuccess, setShowAddToCartSuccess] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Fetch product from API
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/products/${id}`)
        const data = await response.json()

        if (data.success && data.data) {
          setProduct(data.data)
          // Set default size after product loads
          const isSaree = data.data.category === "saree"
          setSelectedSize(isSaree ? "Free Size" : data.data.sizes?.[0] || "")
        } else {
          setError("Product not found")
        }
      } catch (err) {
        setError("Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!product) return

    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const cartIcon = document.querySelector("[data-cart-icon]")

    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect()

      const event = new CustomEvent("startFlyingAnimation", {
        detail: {
          startX: rect.left + rect.width / 2,
          startY: rect.top + rect.height / 2,
          targetX: cartRect.left + cartRect.width / 2,
          targetY: cartRect.top + cartRect.height / 2,
          image: product.image,
        },
      })
      window.dispatchEvent(event)
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity,
      category: product.category,
    })

    setShowAddToCartSuccess(true)
    setTimeout(() => setShowAddToCartSuccess(false), 2000)
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-100 rounded-2xl aspect-square animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
                <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse" />
                <div className="h-12 bg-gray-100 rounded w-1/3 animate-pulse" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Error or not found state
  if (error || !product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white">
          <div className="max-w-6xl mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-black mb-4">{error || "Product not found"}</h1>
            <Link href="/" className="text-orange-600 font-bold hover:text-orange-700">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const isSaree = product.category === "saree"
  const images = product.images || [product.image]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/category/${product.category}`}
              className="text-gray-500 hover:text-orange-600 capitalize"
            >
              {product.category === "saree" ? "Sarees" : "Chudithars"}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-orange-600 font-medium">{product.name}</span>
          </nav>
        </div>

        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="flex flex-col gap-4">
              {/* Main image */}
              <div className="flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-8 aspect-square">
                <img
                  src={images[activeImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl transition-all duration-300"
                />
              </div>

              {/* Image gallery - horizontal scroll */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === index
                          ? "border-orange-500 shadow-lg"
                          : "border-gray-200 hover:border-orange-300"
                        }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-2">
                      {product.category === "saree" ? "Saree" : "Chudithar"}
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">{product.name}</h1>
                  </div>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-3 bg-gray-100 rounded-full hover:bg-orange-50 transition-all"
                  >
                    <svg
                      className={`w-6 h-6 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
                        }`}
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
                </div>

                <p className="text-gray-600 mb-6">{product.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <p className="text-4xl font-bold text-orange-600">{product.price}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through mt-2">{product.originalPrice}</p>
                  )}
                </div>

                {!isSaree && product.sizes && (
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-black mb-3 uppercase tracking-widest">
                      Select Size
                    </label>
                    <div className="flex gap-3 flex-wrap">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-3 text-sm font-bold rounded-lg border-2 transition-all active:scale-95 ${selectedSize === size
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-gray-200 text-black hover:border-orange-300"
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-black mb-3 uppercase tracking-widest">Quantity</label>
                  <div className="flex items-center gap-4 border border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-xl font-bold text-black hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-6 text-lg font-bold text-black">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-xl font-bold text-black hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mb-8 bg-orange-50 rounded-lg p-6 border border-orange-100">
                  {product.details && <p className="text-sm text-gray-700 mb-4">{product.details}</p>}
                  <div className="space-y-2 text-sm">
                    {product.material && (
                      <p>
                        <span className="font-bold text-black">Material: </span>
                        <span className="text-gray-600">{product.material}</span>
                      </p>
                    )}
                    {product.care && (
                      <p>
                        <span className="font-bold text-black">Care: </span>
                        <span className="text-gray-600">{product.care}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {showAddToCartSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg font-bold text-center">
                    ✓ Added to cart!
                  </div>
                )}
                <Link href={`/checkout?productId=${product.id}&size=${encodeURIComponent(selectedSize)}&quantity=${quantity}`}>
                  <button
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg font-bold hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all active:scale-95 text-base"
                  >
                    Buy Now
                  </button>
                </Link>
                <button
                  onClick={handleAddToCart}
                  className="w-full border-2 border-orange-500 text-orange-600 py-4 rounded-lg font-bold hover:bg-orange-50 transition-all active:scale-95 text-base"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
