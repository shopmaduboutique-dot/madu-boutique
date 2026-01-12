import ProductForm from "@/components/admin/product-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Products
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-500 mt-1">Create a new product listing</p>
            </div>

            {/* Form */}
            <ProductForm mode="create" />
        </div>
    )
}
