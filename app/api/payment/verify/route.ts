// POST /api/payment/verify - Verify Razorpay payment signature
import { NextResponse } from "next/server"
import crypto from "crypto"
import { createServerClient } from "@/lib/supabase"

// Validate environment variables
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
if (!RAZORPAY_KEY_SECRET) {
    console.error("RAZORPAY_KEY_SECRET is not set in environment variables")
}

export async function POST(request: Request) {
    // Check if secret is available
    if (!RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
            { success: false, error: "Payment configuration error" },
            { status: 500 }
        )
    }
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData, // Contains items, customer info, etc.
        } = await request.json()

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex")

        const isAuthentic = expectedSignature === razorpay_signature

        if (!isAuthentic) {
            return NextResponse.json(
                { success: false, error: "Payment verification failed" },
                { status: 400 }
            )
        }

        // Payment verified - now create the order in database
        const supabase = createServerClient()
        const shippingCost = orderData.shippingCost || 99

        // Calculate totals
        const subtotal = orderData.items.reduce((sum: number, item: any) => {
            const price = parseInt(item.price.replace("₹", "").replace(/,/g, ""))
            return sum + price * item.quantity
        }, 0)
        const total = subtotal + shippingCost

        // Generate order number
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
        const random = Math.random().toString(36).substring(2, 8).toUpperCase()
        const orderNumber = `ORD-${date}-${random}`

        // First, find or create user
        let userId: string | null = null
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("phone", orderData.customer.phone)
            .single()

        if (existingUser) {
            userId = existingUser.id
            await supabase
                .from("users")
                .update({
                    full_name: orderData.customer.fullName,
                    email: orderData.customer.email || null,
                    address: orderData.customer.address,
                    city: orderData.customer.city,
                    state: orderData.customer.state || null,
                    zip_code: orderData.customer.zipCode,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", userId)
        } else {
            const { data: newUser } = await supabase
                .from("users")
                .insert({
                    full_name: orderData.customer.fullName,
                    email: orderData.customer.email || null,
                    phone: orderData.customer.phone,
                    address: orderData.customer.address,
                    city: orderData.customer.city,
                    state: orderData.customer.state || null,
                    zip_code: orderData.customer.zipCode,
                })
                .select("id")
                .single()

            if (newUser) {
                userId = newUser.id
            }
        }

        // Create order with payment info
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                order_number: orderNumber,
                user_id: userId,
                status: "confirmed",
                subtotal,
                shipping_cost: shippingCost,
                total,
                delivery_name: orderData.customer.fullName,
                delivery_phone: orderData.customer.phone,
                delivery_email: orderData.customer.email || null,
                delivery_address: orderData.customer.address,
                delivery_city: orderData.customer.city,
                delivery_state: orderData.customer.state || null,
                delivery_zip: orderData.customer.zipCode,
            })
            .select()
            .single()

        if (orderError || !order) {
            console.error("Order creation error:", orderError)
            return NextResponse.json(
                { success: false, error: "Payment successful but order creation failed" },
                { status: 500 }
            )
        }

        // Create order items
        const orderItems = orderData.items.map((item: any) => {
            const price = parseInt(item.price.replace("₹", "").replace(/,/g, ""))
            return {
                order_id: order.id,
                product_id: item.id,
                product_name: item.name,
                product_price: price,
                size: item.size,
                quantity: item.quantity,
                line_total: price * item.quantity,
            }
        })

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

        if (itemsError) {
            console.error("Order items insertion error:", itemsError)
            // Note: Order was created but items failed - log for manual intervention
            // We still return success since payment was verified
        }

        return NextResponse.json({
            success: true,
            data: {
                orderId: order.order_number,
                paymentId: razorpay_payment_id,
                total,
                status: "confirmed",
            },
        })
    } catch (error: any) {
        console.error("Payment verification error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Payment verification failed" },
            { status: 500 }
        )
    }
}
