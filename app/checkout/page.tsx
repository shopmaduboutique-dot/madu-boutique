"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import PhoneAuthModal from "@/components/phone-auth-modal"
import type { CheckoutForm, CartItem, Product } from "@/lib/types"

declare global {
    interface Window {
        Razorpay: any
    }
}

// Loading fallback for Suspense
function CheckoutLoading() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
        </div>
    )
}

// Main checkout content component
function CheckoutContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { cartItems, clearCart } = useCart()
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(false)
    const [orderId, setOrderId] = useState("")
    const [paymentId, setPaymentId] = useState("")
    const [loading, setLoading] = useState(false)
    const [razorpayLoaded, setRazorpayLoaded] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)

    // Load Razorpay script dynamically on mount
    useEffect(() => {
        // Check if already loaded
        if (window.Razorpay) {
            setRazorpayLoaded(true)
            return
        }

        // Check if script is already in DOM
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
        if (existingScript) {
            existingScript.addEventListener('load', () => setRazorpayLoaded(true))
            return
        }

        // Create and load script
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => {
            console.log('Razorpay script loaded successfully')
            setRazorpayLoaded(true)
        }
        script.onerror = () => {
            console.error('Failed to load Razorpay script')
        }
        document.body.appendChild(script)

        return () => {
            // Cleanup only if we added the script
            if (script.parentNode) {
                script.parentNode.removeChild(script)
            }
        }
    }, [])

    // Show/hide auth modal based on authentication state
    useEffect(() => {
        if (authLoading) {
            // Still loading, don't change modal state
            return
        }
        if (isAuthenticated) {
            // User is authenticated, hide modal
            setShowAuthModal(false)
        } else {
            // User is not authenticated, show modal
            setShowAuthModal(true)
        }
    }, [authLoading, isAuthenticated])

    // Check if this is a direct buy (productId in URL)
    const directBuyProductId = searchParams.get("productId")
    const directBuySize = searchParams.get("size") || "Free Size"
    const directBuyQuantity = parseInt(searchParams.get("quantity") || "1", 10)

    // Get the items to checkout - either from direct buy or cart
    const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([])

    useEffect(() => {
        if (directBuyProductId) {
            // Direct buy flow - fetch product from API
            setLoading(true)
            fetch(`/api/products/${directBuyProductId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data) {
                        const product: Product = data.data
                        setCheckoutItems([{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            size: directBuySize,
                            quantity: directBuyQuantity,
                            category: product.category,
                        }])
                    }
                })
                .finally(() => setLoading(false))
        } else {
            // Cart checkout flow
            setCheckoutItems(cartItems)
        }
    }, [directBuyProductId, directBuySize, directBuyQuantity, cartItems])

    const [formData, setFormData] = useState<CheckoutForm>({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        agreedToTerms: false,
    })

    // Auto-fill form from user data when authenticated
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.fullName || prev.fullName,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
                address: user.address || prev.address,
                city: user.city || prev.city,
                state: user.state || prev.state,
                zipCode: user.zipCode || prev.zipCode,
            }))
        }
    }, [user])

    const subtotal = checkoutItems.reduce((sum, item) => {
        const price = parseInt(item.price.replace("₹", "").replace(/,/g, ""))
        return sum + price * item.quantity
    }, 0)

    const shippingCost = 99
    const total = subtotal + shippingCost

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const validateForm = () => {
        if (!formData.fullName?.trim()) return "Full name is required"
        if (!formData.phone?.trim()) return "Phone number is required"
        if (!formData.address?.trim()) return "Address is required"
        if (!formData.city?.trim()) return "City is required"
        if (!formData.zipCode?.trim()) return "Pin code is required"
        if (!formData.agreedToTerms) return "Please agree to terms and conditions"
        return null
    }

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()

        const validationError = validateForm()
        if (validationError) {
            alert(validationError)
            return
        }

        if (!razorpayLoaded) {
            alert("Payment system is loading. Please try again.")
            return
        }

        setIsSubmitting(true)

        try {
            // Step 1: Create Razorpay order
            const orderResponse = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: total,
                    currency: "INR",
                    receipt: `rcpt_${Date.now()}`,
                    notes: {
                        customerName: formData.fullName,
                        customerPhone: formData.phone,
                    },
                }),
            })

            const orderData = await orderResponse.json()

            if (!orderData.success) {
                throw new Error(orderData.error || "Failed to create payment order")
            }

            // Step 2: Open Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.data.amount,
                currency: orderData.data.currency,
                name: "Madu Boutique",
                description: `Order: ${checkoutItems.length} item(s)`,
                order_id: orderData.data.orderId,
                handler: async function (response: any) {
                    // Step 3: Verify payment on server
                    try {
                        const verifyResponse = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderData: {
                                    items: checkoutItems,
                                    customer: formData,
                                    shippingCost,
                                },
                            }),
                        })

                        const verifyData = await verifyResponse.json()

                        if (verifyData.success) {
                            setOrderId(verifyData.data.orderId)
                            setPaymentId(verifyData.data.paymentId)
                            setOrderSuccess(true)
                            // Only clear cart if this was a cart checkout
                            if (!directBuyProductId) {
                                clearCart()
                            }
                        } else {
                            alert(verifyData.error || "Payment verification failed")
                        }
                    } catch (error) {
                        alert("Payment verification failed. Please contact support.")
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email || "",
                    contact: formData.phone,
                },
                notes: {
                    address: formData.address,
                    city: formData.city,
                },
                theme: {
                    color: "#f97316",
                },
                // Enable all payment methods including UPI and QR
                config: {
                    display: {
                        blocks: {
                            upi: {
                                name: "Pay using UPI",
                                instruments: [
                                    { method: "upi", flows: ["qrcode", "collect", "intent"] }
                                ]
                            },
                            other: {
                                name: "Other Payment Methods",
                                instruments: [
                                    { method: "card" },
                                    { method: "netbanking" },
                                    { method: "wallet" }
                                ]
                            }
                        },
                        sequence: ["block.upi", "block.other"],
                        preferences: {
                            show_default_blocks: true
                        }
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsSubmitting(false)
                    },
                },
            }

            const razorpay = new window.Razorpay(options)
            razorpay.on("payment.failed", function (response: any) {
                alert(`Payment failed: ${response.error.description}`)
                setIsSubmitting(false)
            })
            razorpay.open()
        } catch (error: any) {
            alert(error.message || "An error occurred. Please try again.")
            setIsSubmitting(false)
        }
    }

    // Loading state
    if (loading) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading checkout...</p>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    // Empty checkout - no items
    if (checkoutItems.length === 0 && !orderSuccess && !loading) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-8">
                        <h2 className="text-2xl font-bold text-black mb-4">Nothing to checkout</h2>
                        <p className="text-gray-600 mb-6">Add some items to your cart or select a product to buy.</p>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    // Order success state
    if (orderSuccess) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-gray-500 mb-2">
                                Order ID: <span className="font-mono font-bold text-black">{orderId}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Payment ID: <span className="font-mono font-bold text-black">{paymentId}</span>
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-bold hover:shadow-lg"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            {/* Phone Auth Modal */}
            <PhoneAuthModal
                isOpen={showAuthModal}
                onSuccess={() => setShowAuthModal(false)}
            />

            <Navbar />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    {/* Header with user info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-black">
                            {directBuyProductId ? "Complete Your Purchase" : "Checkout"}
                        </h1>
                        {isAuthenticated && user && (
                            <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="text-sm">
                                    <p className="text-gray-600">Logged in as</p>
                                    <p className="font-medium text-black truncate max-w-[180px]">{user.email}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="ml-2 text-xs text-gray-500 hover:text-red-500 underline"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handlePayment}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Shipping Information */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            1
                                        </span>
                                        Billing & Shipping Information
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter your email"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter your phone"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                                placeholder="Enter your complete address"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="City"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="State"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code *</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Pin Code"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Terms */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="agreedToTerms"
                                            checked={formData.agreedToTerms}
                                            onChange={handleInputChange}
                                            required
                                            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            I agree to the <span className="font-medium text-black">Terms and Conditions</span> and{" "}
                                            <span className="font-medium text-black">Privacy Policy</span>
                                        </span>
                                    </label>
                                </div>

                                {/* Payment Info */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                                    <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-blue-700">
                                        Secure payment powered by <span className="font-bold">Razorpay</span>. Your payment information is encrypted.
                                    </p>
                                </div>
                            </div>

                            {/* Right: Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                                    <h2 className="text-lg font-bold text-black mb-6">Order Summary</h2>

                                    {/* Items Preview */}
                                    <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                                        {checkoutItems.map((item) => (
                                            <div key={`${item.id}-${item.size}`} className="flex gap-3">
                                                <img
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-black text-sm line-clamp-1">{item.name}</p>
                                                    <p className="text-gray-500 text-xs">
                                                        {item.size !== "Free Size" && item.size !== "One Size" && `Size: ${item.size} • `}
                                                        Qty: {item.quantity}
                                                    </p>
                                                    <p className="text-orange-600 font-medium text-sm">{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium">₹{shippingCost}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3 flex justify-between">
                                            <span className="font-bold">Total</span>
                                            <span className="text-xl font-bold text-orange-600">₹{total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !razorpayLoaded}
                                        className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                🔒 Pay ₹{total.toLocaleString()}
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-3 mt-4">
                                        <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-6" />
                                        <span className="text-xs text-gray-500">Secured by Razorpay</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main >
            <Footer />
        </>
    )
}
