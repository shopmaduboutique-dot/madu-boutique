"use client"

import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart()

    const subtotal = cartItems.reduce((sum, item) => {
        const price = parseInt(item.price.replace("₹", "").replace(",", ""))
        return sum + price * item.quantity
    }, 0)

    const shippingCost = subtotal > 0 ? 99 : 0
    const total = subtotal + shippingCost

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-black">Shopping Cart</h1>
                        {cartItems.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-red-500 hover:text-red-600 font-medium text-sm"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {cartItems.length === 0 ? (
                        /* Empty Cart State */
                        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-16 text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-12 h-12 text-orange-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-black mb-2">Your cart is empty</h2>
                            <p className="text-gray-600 mb-6">
                                Looks like you haven't added anything to your cart yet.
                            </p>
                            <Link
                                href="/"
                                className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        /* Cart with Items */
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={`${item.id}-${item.size}`}
                                        className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex gap-4 sm:gap-6"
                                    >
                                        <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.name}
                                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-black text-lg">{item.name}</h3>
                                                    <p className="text-gray-500 text-sm capitalize">{item.category}</p>
                                                    {item.size !== "Free Size" && item.size !== "One Size" && (
                                                        <p className="text-gray-500 text-sm">Size: {item.size}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.size)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3 border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="text-xl font-bold text-orange-600">{item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                                    <h2 className="text-lg font-bold text-black mb-6">Order Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                                            <span className="font-medium text-black">₹{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span className="font-medium text-black">₹{shippingCost}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-4 flex justify-between">
                                            <span className="font-bold text-black">Total</span>
                                            <span className="text-2xl font-bold text-orange-600">₹{total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg font-bold text-center hover:shadow-lg transition-all"
                                    >
                                        Proceed to Checkout
                                    </Link>

                                    <Link
                                        href="/"
                                        className="block w-full text-center text-orange-600 font-medium mt-4 hover:text-orange-700"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
