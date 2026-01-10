"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "saree",
        price: "",
        original_price: "",
        stock_quantity: "",
        sizes: "",
        material: "",
        care: "",
    })
    const [currentImage, setCurrentImage] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    useEffect(() => {
        if (id) fetchProduct()
    }, [id])

    async function fetchProduct() {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", parseInt(id))
                .single()

            if (error) throw error

            if (data) {
                setFormData({
                    name: data.name,
                    description: data.description || "",
                    category: data.category,
                    price: data.price.toString(),
                    original_price: data.original_price?.toString() || "",
                    stock_quantity: data.stock_quantity.toString(),
                    sizes: data.sizes ? data.sizes.join(", ") : "",
                    material: data.material || "",
                    care: data.care || "",
                })
                setCurrentImage(data.image)
            }
        } catch (error) {
            console.error("Error fetching product:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            let imageUrl = currentImage

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, imageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(fileName)

                imageUrl = publicUrl
            }

            const { error: updateError } = await supabase
                .from('products')
                .update({
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    price: parseFloat(formData.price),
                    original_price: formData.original_price ? parseFloat(formData.original_price) : null,
                    stock_quantity: parseInt(formData.stock_quantity),
                    sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : [],
                    material: formData.material,
                    care: formData.care,
                    image: imageUrl,
                    in_stock: parseInt(formData.stock_quantity) > 0,
                })
                .eq("id", parseInt(id))

            if (updateError) throw updateError

            router.push('/admin/products')
            router.refresh()

        } catch (error) {
            console.error("Error updating product:", error)
            alert("Failed to update product")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <div>Loading product...</div>

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="text-gray-500 hover:text-gray-900">
                    ← Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                            <option value="saree">Saree</option>
                            <option value="chudithar">Chudithar</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                        <input
                            type="number"
                            name="stock_quantity"
                            required
                            min="0"
                            value={formData.stock_quantity}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Original Price</label>
                        <input
                            type="number"
                            name="original_price"
                            min="0"
                            value={formData.original_price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Sizes (Comma separated)</label>
                    <input
                        name="sizes"
                        value={formData.sizes}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Image</label>
                    {currentImage && (
                        <div className="mb-2">
                            <img src={currentImage} alt="Current" className="h-20 w-20 object-cover rounded" />
                        </div>
                    )}
                    <label className="text-sm font-medium text-gray-700">Change Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Update Product"}
                </button>
            </form>
        </div>
    )
}
