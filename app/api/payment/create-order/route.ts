// POST /api/payment/create-order - Create Razorpay order
import { NextResponse } from "next/server"
import Razorpay from "razorpay"

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
    // Check if Razorpay is properly configured
    if (!razorpay) {
        return NextResponse.json(
            { success: false, error: "Payment gateway not configured" },
            { status: 500 }
        )
    }
    try {
        const { amount, currency = "INR", receipt, notes } = await request.json()

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { success: false, error: "Invalid amount" },
                { status: 400 }
            )
        }

        // Razorpay expects amount in paise (smallest currency unit)
        const amountInPaise = Math.round(amount * 100)

        const options = {
            amount: amountInPaise,
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: notes || {},
        }

        const order = await razorpay.orders.create(options)

        return NextResponse.json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt,
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
