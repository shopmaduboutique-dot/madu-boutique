"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    LogOut,
    ChevronLeft,
    Store,
    X
} from "lucide-react"

interface AdminSidebarProps {
    userName: string
    userEmail: string
    isOpen: boolean
    onClose: () => void
}

const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
]

export default function AdminSidebar({ userName, userEmail, isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname()
    const { logout } = useAuth()

    const handleLogout = async () => {
        await logout()
        window.location.href = "/"
    }

    const handleNavClick = () => {
        // Close sidebar on mobile when navigating
        onClose()
    }

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 
                    flex flex-col min-h-screen z-50
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo/Brand */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <Store className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900">Madu Boutique</h1>
                                <p className="text-xs text-gray-500">Admin Panel</p>
                            </div>
                        </div>
                        {/* Mobile close button */}
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || pathname.startsWith(href + "/")
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={handleNavClick}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? "bg-orange-50 text-orange-600 border border-orange-200"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-orange-500" : "text-gray-400"}`} />
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Back to Store Link */}
                <div className="p-4 border-t border-gray-200">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Store
                    </Link>
                </div>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    )
}
