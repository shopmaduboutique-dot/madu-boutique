import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        
        // Basic validation
        if (!body.name || !body.email || !body.subject || !body.message) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            )
        }

        // TODO: In a real application, you would store this in the database or send an email.
        // For now, we simulate a successful submission.
        console.log("Contact form submitted:", body)

        // Simulate a slight delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        return NextResponse.json({
            success: true,
            message: "Your message has been sent successfully."
        })
    } catch (error) {
        console.error("Contact API error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to send message" },
            { status: 500 }
        )
    }
}
