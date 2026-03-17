"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Tag } from "lucide-react"
import { useAdminCategories, type Category } from "@/lib/admin/hooks/use-admin-categories"
import { toast } from "sonner"

export default function CategoriesPage() {
    const { categories, loading, error, createCategory, deleteCategory } = useAdminCategories()

    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [newName, setNewName] = useState("")
    const [newSlug, setNewSlug] = useState("")

    // Auto-slugify
    useEffect(() => {
        const slugified = newName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        
        setNewSlug(slugified)
    }, [newName])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName || !newSlug) return

        setIsCreating(true)
        const result = await createCategory(newName, newSlug)
        
        if (result.success) {
            toast.success("Category created successfully")
            setNewName("")
            setNewSlug("")
        } else {
            toast.error(result.error || "Failed to create category")
        }
        setIsCreating(false)
    }

    const handleDelete = async (id: number) => {
        const result = await deleteCategory(id)
        if (result.success) {
            toast.success("Category deleted successfully")
        } else {
            toast.error(result.error || "Failed to delete category")
        }
        setDeleteConfirm(null)
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-orange-600 font-medium hover:text-orange-700"
                >
                    Try again
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500 mt-1">Manage product categories</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Menswear"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    value={newSlug}
                                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                    placeholder="e.g. menswear"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Used in URLs. Only lowercase letters, numbers, and hyphens.
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={isCreating || !newName || !newSlug}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                {isCreating ? "Adding..." : "Add Category"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        {loading ? (
                            <div className="divide-y divide-gray-200 animate-pulse">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                                            <div>
                                                <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                                                <div className="h-3 w-24 bg-gray-100 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="p-12 text-center">
                                <Tag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories</h3>
                                <p className="text-gray-500">
                                    Create your first category using the form.
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {categories.map((category) => (
                                    <li key={category.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{category.name}</h3>
                                                <p className="text-sm font-mono text-gray-500">/{category.slug}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setDeleteConfirm(category.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete category"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Category?</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete this category? This action cannot be undone.
                            If there are products using this category, the deletion will fail.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
