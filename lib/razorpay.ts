// Razorpay configuration
export const razorpayConfig = {
    keyId: process.env.RAZORPAY_KEY_ID!,
    keySecret: process.env.RAZORPAY_KEY_SECRET!,
}

// Validate Razorpay config
export function validateRazorpayConfig() {
    if (!razorpayConfig.keyId || !razorpayConfig.keySecret) {
        throw new Error("Missing Razorpay environment variables")
    }
}
