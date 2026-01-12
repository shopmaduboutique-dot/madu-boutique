"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ImageUpload from "./image-upload"
import { toast } from "sonner"

interface ProductFormData {
    name: string
    price: string
    original_price: string
    description: string
    details: string
    material: string
    care: string
    category: "saree" | "chudithar"
    sizes: string[]
    is_new: boolean
    in_stock: boolean
    stock_quantity: string
    images: string[]
}

interface ProductFormProps {
    initialData?: ProductFormData
    productId?: number
    mode: "create" | "edit"
}

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"]

export default function ProductForm({ initialData, productId, mode }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<ProductFormData>(
        initialData || {
            name: "",
            price: "",
            original_price: "",
            description: "",
            details: "",
            material: "",
            care: "",
            category: "saree",
            sizes: ["Free Size"],
            is_new: false,
            in_stock: true,
            stock_quantity: "0",
            images: [],
        }
    )

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target
        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSizeToggle = (size: string) => {
        setFormData((prev) => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size]
            return { ...prev, sizes: newSizes.length > 0 ? newSizes : ["Free Size"] }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.price || !formData.category) {
            toast.error("Please fill in required fields")
            return
        }

        if (formData.images.length === 0) {
            toast.error("Please upload at least one image")
            return
        }

        setLoading(true)

        try {
            const url = mode === "create" ? "/api/admin/products" : `/api/admin/products/${productId}`
            const method = mode === "create" ? "POST" : "PUT"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    price: Number(formData.price),
                    original_price: formData.original_price ? Number(formData.original_price) : null,
                    description: formData.description,
                    details: formData.details,
                    material: formData.material,
                    care: formData.care,
                    category: formData.category,
                    sizes: formData.sizes,
                    is_new: formData.is_new,
                    in_stock: formData.in_stock,
                    stock_quantity: Number(formData.stock_quantity),
                    image: formData.images[0],
                    images: formData.images,
                }),
            })

            const data = await response.json()

            if (data.success) {
                toast.success(mode === "create" ? "Product created!" : "Product updated!")
                router.push("/admin/products")
                router.refresh()
            } else {
                toast.error(data.error || "Failed to save product")
            }
        } catch (error) {
            console.error("Error saving product:", error)
            toast.error("Failed to save product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="e.g., Royal Silk Saree"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="4999"
                            required
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Original Price (₹)
                        </label>
                        <input
                            type="number"
                            name="original_price"
                            value={formData.original_price}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="6999 (for showing discount)"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="saree">Saree</option>
                            <option value="chudithar">Chudithar</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Quantity
                        </label>
                        <input
                            type="number"
                            name="stock_quantity"
                            value={formData.stock_quantity}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="10"
                            min="0"
                        />
                    </div>
                </div>
            </div>

            {/* Sizes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Sizes</h3>
                <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeToggle(size)}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${formData.sizes.includes(size)
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-orange-400"
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
                <ImageUpload
                    images={formData.images}
                    onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
                />
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Premium silk with intricate gold work"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Details
                        </label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="This luxurious royal silk saree features..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Material
                            </label>
                            <input
                                type="text"
                                name="material"
                                value={formData.material}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="100% Pure Silk"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Care Instructions
                            </label>
                            <input
                                type="text"
                                name="care"
                                value={formData.care}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Dry clean only"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>

                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="in_stock"
                            checked={formData.in_stock}
                            onChange={handleChange}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">In Stock</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="is_new"
                            checked={formData.is_new}
                            onChange={handleChange}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Mark as New</span>
                    </label>
                </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
