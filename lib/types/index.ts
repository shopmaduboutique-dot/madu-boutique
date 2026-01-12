// Shared TypeScript types for the e-commerce application

export interface Product {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    images: string[]
    sizes: string[]
    description: string
    details: string
    material: string
    care: string
    category: "saree" | "chudithar"
    isNew?: boolean
    inStock?: boolean
}

export interface CartItem {
    id: number
    name: string
    price: string
    image: string
    size: string
    quantity: number
    category: string
}

export interface Order {
    id: string
    items: CartItem[]
    customer: CheckoutForm
    total: number
    shippingCost: number
    status: "pending" | "confirmed" | "shipped" | "delivered"
    createdAt: string
}

export interface CheckoutForm {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    agreedToTerms: boolean
}

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
}

export type Category = "saree" | "chudithar"
