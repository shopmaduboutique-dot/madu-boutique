"use client"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
    images: string[]
    onChange: (images: string[]) => void
    maxImages?: number
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        if (images.length + files.length > maxImages) {
            setError(`Maximum ${maxImages} images allowed`)
            return
        }

        setUploading(true)
        setError(null)

        const newImages: string[] = []

        for (const file of Array.from(files)) {
            try {
                const formData = new FormData()
                formData.append("file", file)

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                })

                const data = await response.json()

                if (data.success) {
                    newImages.push(data.data.url)
                } else {
                    setError(data.error || "Failed to upload image")
                }
            } catch (err) {
                console.error("Upload error:", err)
                setError("Failed to upload image")
            }
        }

        if (newImages.length > 0) {
            onChange([...images, ...newImages])
        }

        setUploading(false)
        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        onChange(newImages)
    }

    return (
        <div className="space-y-3">
            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                            <Image
                                src={url}
                                alt={`Product image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {index === 0 && (
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                                    Main
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {images.length < maxImages && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <>
                                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2" />
                                <p className="text-sm text-gray-500">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium text-orange-600">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
                            </>
                        )}
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                </label>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Help Text */}
            <p className="text-xs text-gray-400">
                {images.length}/{maxImages} images • First image is the main product image
            </p>
        </div>
    )
}
