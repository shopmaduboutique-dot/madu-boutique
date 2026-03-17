import { NextResponse } from "next/server"
import crypto from "crypto"
import { createServerClient } from "@/lib/supabase"

// Environment variable validation
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET

if (!RAZORPAY_WEBHOOK_SECRET) {
    console.warn("RAZORPAY_WEBHOOK_SECRET is not defined. Webhooks will fail verification.")
}

export async function POST(request: Request) {
    try {
        // 1. Read the raw text body for signature verification
        const rawBody = await request.text()
        const signature = request.headers.get("x-razorpay-signature")

        if (!RAZORPAY_WEBHOOK_SECRET) {
            console.error("Webhook Error: RAZORPAY_WEBHOOK_SECRET missing")
            return NextResponse.json(
                { success: false, error: "Server configuration error" },
                { status: 500 }
            )
        }

        if (!signature) {
            return NextResponse.json(
                { success: false, error: "Missing signature" },
                { status: 400 }
            )
        }

        // 2. Verify Signature
        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
            .update(rawBody)
            .digest("hex")

        if (expectedSignature !== signature) {
            console.error("Webhook Error: Invalid signature")
            return NextResponse.json(
                { success: false, error: "Invalid signature" },
                { status: 400 }
            )
        }

        // 3. Parse the event
        const event = JSON.parse(rawBody)
        const eventName = event.event
        console.log(`Received Razorpay webhook: ${eventName}`)

        // 4. Handle specific events
        // We handle 'payment.captured' or 'order.paid' as success
        if (eventName === "payment.captured" || eventName === "order.paid") {
            const payment = event.payload.payment.entity
            const orderId = payment.order_id
            const paymentId = payment.id
            const amount = payment.amount // In paise
            const method = payment.method

            if (!orderId) {
                console.warn(`Webhook: Missing order_id in ${eventName} payload`)
                return NextResponse.json({ success: true, message: "Ignored: No order_id" })
            }

            const supabase = createServerClient()

            // 5. Idempotency Check & Update
            // Check if order is already confirmed to avoid redundant updates
            const { data: existingOrder } = await supabase
                .from("orders")
                .select("id, status")
                .eq("razorpay_order_id", orderId)
                .single()

            if (!existingOrder) {
                console.error(`Webhook: Order not found for razorpay_order_id: ${orderId}`)
                // Return 200 to acknowledge webhook (bad data shouldn't retry indefinitely)
                return NextResponse.json({ success: true, message: "Order not found" })
            }

            if (existingOrder.status === "confirmed" || existingOrder.status === "processing" || existingOrder.status === "shipped") {
                console.log(`Webhook: Order ${orderId} already confirmed/processed. Skipping.`)
                return NextResponse.json({ success: true, message: "Order already confirmed" })
            }

            // Update order status
            const { error: updateError } = await supabase
                .from("orders")
                .update({
                    status: "confirmed",
                    razorpay_payment_id: paymentId,
                    razorpay_signature: signature, // Storing webhook signature for audit
                    updated_at: new Date().toISOString()
                    // We could store 'method' or 'amount' if schema supported it
                })
                .eq("razorpay_order_id", orderId)

            if (updateError) {
                console.error("Webhook: Failed to update order status", updateError)
                return NextResponse.json(
                    { success: false, error: "Database update failed" },
                    { status: 500 }
                )
            }

            console.log(`Webhook: Successfully confirmed order ${orderId}`)
            return NextResponse.json({ success: true, message: "Order confirmed" })
        }

        // Ignore other events
        return NextResponse.json({ success: true, message: "Event ignored" })

    } catch (error: any) {
        console.error("Webhook processing error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
