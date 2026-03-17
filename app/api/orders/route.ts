// POST /api/orders - Create a new order in Supabase
import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import type { CartItem, CheckoutForm } from "@/lib/types"

interface OrderRequest {
    items: CartItem[]
    customer: CheckoutForm
    shippingCost: number
}

function generateOrderNumber(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `ORD-${date}-${random}`
}

function calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => {
        const price = parseInt(item.price.replace("₹", "").replace(",", ""))
        return sum + price * item.quantity
    }, 0)
}

function validateCheckoutForm(form: CheckoutForm): string | null {
    if (!form.fullName?.trim()) return "Full name is required"
    if (!form.phone?.trim()) return "Phone number is required"
    if (!form.address?.trim()) return "Address is required"
    if (!form.city?.trim()) return "City is required"
    if (!form.zipCode?.trim()) return "Pin code is required"
    if (!form.agreedToTerms) return "You must agree to terms and conditions"
    return null
}

export async function POST(request: Request) {
    try {
        const body: OrderRequest = await request.json()

        // Validate request body
        if (!body.items || body.items.length === 0) {
            return NextResponse.json(
                { success: false, error: "Cart is empty" },
                { status: 400 }
            )
        }

        if (!body.customer) {
            return NextResponse.json(
                { success: false, error: "Customer information is required" },
                { status: 400 }
            )
        }

        // Validate checkout form
        const validationError = validateCheckoutForm(body.customer)
        if (validationError) {
            return NextResponse.json(
                { success: false, error: validationError },
                { status: 400 }
            )
        }

        const supabase = createServerClient()
        const shippingCost = body.shippingCost || 99
        const subtotal = calculateTotal(body.items)
        const total = subtotal + shippingCost
        const orderNumber = generateOrderNumber()

        // First, find or create user based on phone number
        let userId: string | null = null

        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("phone", body.customer.phone)
            .single()

        if (existingUser) {
            userId = existingUser.id
            // Update user info
            await supabase
                .from("users")
                .update({
                    full_name: body.customer.fullName,
                    email: body.customer.email || null,
                    address: body.customer.address,
                    city: body.customer.city,
                    state: body.customer.state || null,
                    zip_code: body.customer.zipCode,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", userId)
        } else {
            // Create new user
            const { data: newUser, error: userError } = await supabase
                .from("users")
                .insert({
                    full_name: body.customer.fullName,
                    email: body.customer.email || null,
                    phone: body.customer.phone,
                    address: body.customer.address,
                    city: body.customer.city,
                    state: body.customer.state || null,
                    zip_code: body.customer.zipCode,
                })
                .select("id")
                .single()

            if (newUser) {
                userId = newUser.id
            }
        }

        // Create order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                order_number: orderNumber,
                user_id: userId,
                status: "confirmed",
                subtotal,
                shipping_cost: shippingCost,
                total,
                delivery_name: body.customer.fullName,
                delivery_phone: body.customer.phone,
                delivery_email: body.customer.email || null,
                delivery_address: body.customer.address,
                delivery_city: body.customer.city,
                delivery_state: body.customer.state || null,
                delivery_zip: body.customer.zipCode,
            })
            .select()
            .single()

        if (orderError || !order) {
            console.error("Order creation error:", orderError)
            return NextResponse.json(
                { success: false, error: "Failed to create order" },
                { status: 500 }
            )
        }

        // Create order items
        const orderItems = body.items.map((item) => {
            const price = parseInt(item.price.replace("₹", "").replace(",", ""))
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

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems)

        if (itemsError) {
            console.error("Order items error:", itemsError)
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: order.order_number,
                    orderId: order.id,
                    total,
                    status: order.status,
                    createdAt: order.created_at,
                },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Order creation error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to create order" },
            { status: 500 }
        )
    }
}

// GET /api/orders - Get orders (optional: by user phone or email)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const phone = searchParams.get("phone")
        const email = searchParams.get("email")

        const supabase = createServerClient()

        let query = supabase
            .from("orders")
            .select(`
        *,
        order_items (*)
      `)
            .order("created_at", { ascending: false })

        // If both phone and email are provided, search by either (OR condition)
        if (phone && email) {
            query = query.or(`delivery_phone.eq.${phone},delivery_email.eq.${email}`)
        } else if (phone) {
            query = query.eq("delivery_phone", phone)
        } else if (email) {
            query = query.eq("delivery_email", email)
        }

        const { data: orders, error } = await query

        if (error) {
            return NextResponse.json(
                { success: false, error: "Failed to fetch orders" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: orders,
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch orders" },
            { status: 500 }
        )
    }
}
