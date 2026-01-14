"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Menu, Store } from "lucide-react"

interface AdminUser {
    email: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
    const [checkingAdmin, setCheckingAdmin] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Check if we're on the login page - don't require auth
    const isLoginPage = pathname === "/admin/login"

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname])

    useEffect(() => {
        // Skip auth check for login page
        if (isLoginPage) {
            setCheckingAdmin(false)
            return
        }

        // Check admin status via API (uses admin-session cookie)
        const checkAdminStatus = async () => {
            try {
                const response = await fetch("/api/admin/verify", {
                    credentials: "include" // Ensure cookies are sent
                })
                const data = await response.json()

                if (data.isAdmin) {
                    setIsAdmin(true)
                    setAdminUser(data.user)
                } else {
                    setIsAdmin(false)
                    router.replace("/admin/login")
                }
            } catch {
                setIsAdmin(false)
                router.replace("/admin/login")
            } finally {
                setCheckingAdmin(false)
            }
        }

        checkAdminStatus()
    }, [router, isLoginPage])

    // Render login page without sidebar/wrapper
    if (isLoginPage) {
        return <>{children}</>
    }

    // Show loading while checking auth
    if (checkingAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600 font-medium">Verifying admin access...</p>
                </div>
            </div>
        )
    }

    // If not admin, show nothing (redirect is happening)
    if (!isAdmin) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Store className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900">Admin</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <AdminSidebar
                    userName="Admin"
                    userEmail={adminUser?.email || ""}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-auto min-h-screen lg:min-h-[calc(100vh)]">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
