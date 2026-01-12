import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/auth-guard"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
    const { admin, errorResponse } = await requireAdmin(request)
    if (errorResponse) return errorResponse

    try {
        const supabase = createServerClient()
        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 }
            )
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
                { status: 400 }
            )
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: "File too large. Maximum size is 5MB." },
                { status: 400 }
            )
        }

        // Generate unique filename
        const timestamp = Date.now()
        const ext = file.name.split(".").pop()
        const filename = `product-${timestamp}.${ext}`

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from("product-images")
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            })

        if (error) {
            console.error("Upload error:", error)
            return NextResponse.json(
                { success: false, error: "Failed to upload file" },
                { status: 500 }
            )
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(data.path)

        return NextResponse.json({
            success: true,
            data: {
                path: data.path,
                url: urlData.publicUrl,
            },
        })
    } catch (error) {
        console.error("Error in POST /api/upload:", error)
        return NextResponse.json(
            { success: false, error: "Failed to upload file" },
            { status: 500 }
        )
    }
}
