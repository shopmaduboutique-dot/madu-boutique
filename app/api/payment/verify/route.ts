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
        } = await request.json()

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { success: false, error: "Missing payment details" },
                { status: 400 }
            )
        }

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

        // Payment verified - Update existing order in database
        const supabase = createServerClient()

        // Find order by razorpay_order_id and update status
        const { data: order, error: updateError } = await supabase
            .from("orders")
            .update({
                status: "confirmed",
                razorpay_payment_id: razorpay_payment_id,
                razorpay_signature: razorpay_signature,
                updated_at: new Date().toISOString()
            })
            .eq("razorpay_order_id", razorpay_order_id)
            .select()
            .single()

        if (updateError || !order) {
            console.error("Order update failed:", updateError)
            return NextResponse.json(
                { success: false, error: "Payment verified but order update failed" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: {
                orderId: order.order_number,
                paymentId: razorpay_payment_id,
                total: order.total,
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
