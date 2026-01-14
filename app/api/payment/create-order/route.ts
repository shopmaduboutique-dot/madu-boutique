import { NextResponse } from "next/server"
import Razorpay from "razorpay"
import { createServerClient } from "@/lib/supabase"
import { limiter } from "@/lib/rate-limit"

// Validate environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.error("Missing Razorpay environment variables: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET")
}

const razorpay = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
    })
    : null

export async function POST(request: Request) {
    try {
        // Rate Limiter: 5 requests per minute per IP
        await limiter.check(5, "CACHE_TOKEN") // In real app, use IP
    } catch {
        return NextResponse.json(
            { success: false, error: "Rate limit exceeded" },
            { status: 429 }
        )
    }

    // Check if Razorpay is properly configured
    if (!razorpay) {
        return NextResponse.json(
            { success: false, error: "Payment gateway not configured" },
            { status: 500 }
        )
    }
    try {
        const { items, customer, currency = "INR", receipt, notes } = await request.json()

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, error: "Invalid items" },
                { status: 400 }
            )
        }

        if (!customer || !customer.phone) {
            return NextResponse.json(
                { success: false, error: "Invalid customer data" },
                { status: 400 }
            )
        }

        const supabase = createServerClient()
        let totalAmount = 0
        const shippingCost = 99 // Fixed shipping cost for now
        const verifiedItems: any[] = []

        // Calculate total amount from database prices
        for (const item of items) {
            const { data: product } = await supabase
                .from("products")
                .select("id, name, price")
                .eq("id", item.id)
                .single()

            if (product) {
                const lineTotal = product.price * item.quantity
                totalAmount += lineTotal
                verifiedItems.push({
                    product_id: product.id,
                    product_name: product.name,
                    product_price: product.price,
                    quantity: item.quantity,
                    line_total: lineTotal,
                    size: item.size
                })
            }
        }

        // Add shipping
        totalAmount += shippingCost

        if (totalAmount <= 0) {
            return NextResponse.json(
                { success: false, error: "Invalid amount" },
                { status: 400 }
            )
        }

        // Razorpay expects amount in paise (smallest currency unit)
        const amountInPaise = Math.round(totalAmount * 100)

        const options = {
            amount: amountInPaise,
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: notes || {},
        }

        const order = await razorpay.orders.create(options)

        // --- PERSIST ORDER IN DB (PENDING) ---

        // 1. Find or Create User
        let userId: string | null = null
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("phone", customer.phone)
            .single()

        if (existingUser) {
            userId = existingUser.id
            // Update latest address
            await supabase.from("users").update({
                full_name: customer.fullName,
                email: customer.email || null,
                address: customer.address,
                city: customer.city,
                state: customer.state || null,
                zip_code: customer.zipCode,
            }).eq("id", userId)
        } else {
            const { data: newUser } = await supabase.from("users").insert({
                full_name: customer.fullName,
                email: customer.email || null,
                phone: customer.phone,
                address: customer.address,
                city: customer.city,
                state: customer.state || null,
                zip_code: customer.zipCode,
            }).select("id").single()

            if (newUser) userId = newUser.id
        }

        // 2. Insert Order
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
        const random = Math.random().toString(36).substring(2, 8).toUpperCase()
        const orderNumber = `ORD-${date}-${random}`

        const { data: dbOrder, error: orderError } = await supabase.from("orders").insert({
            order_number: orderNumber,
            user_id: userId,
            status: "pending", // Waiting for payment
            subtotal: totalAmount - shippingCost,
            shipping_cost: shippingCost,
            total: totalAmount,
            razorpay_order_id: order.id, // LINK TO RAZORPAY
            delivery_name: customer.fullName,
            delivery_phone: customer.phone,
            delivery_email: customer.email || null,
            delivery_address: customer.address,
            delivery_city: customer.city,
            delivery_state: customer.state || null,
            delivery_zip: customer.zipCode,
        }).select().single()

        if (orderError || !dbOrder) {
            console.error("Failed to create pending order:", orderError)
            return NextResponse.json(
                { success: false, error: "Failed to initialize order" },
                { status: 500 }
            )
        }

        // 3. Insert Order Items
        const orderItemsData = verifiedItems.map(item => ({
            order_id: dbOrder.id,
            product_id: item.product_id,
            product_name: item.product_name,
            product_price: item.product_price,
            quantity: item.quantity,
            line_total: item.line_total,
            size: item.size
        }))

        await supabase.from("order_items").insert(orderItemsData)

        return NextResponse.json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt,
                dbOrderId: dbOrder.order_number
            },
        })
    } catch (error: any) {
        console.error("Razorpay order creation error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create payment order" },
            { status: 500 }
        )
    }
}
