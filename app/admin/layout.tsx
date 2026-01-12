"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
    const [checkingAdmin, setCheckingAdmin] = useState(true)

    // Check if we're on the login page - don't require auth
    const isLoginPage = pathname === "/admin/login"

    useEffect(() => {
        // Skip auth check for login page
        if (isLoginPage) {
            setCheckingAdmin(false)
            return
        }

        // Check admin status once auth is loaded
        const checkAdminStatus = async () => {
            if (isLoading) return

            if (!isAuthenticated) {
                router.replace("/admin/login")
                return
            }

            try {
                // Fetch the current user's role from the API
                const response = await fetch("/api/admin/verify")
                const data = await response.json()

                if (data.isAdmin) {
                    setIsAdmin(true)
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
    }, [isAuthenticated, isLoading, router, isLoginPage])

    // Render login page without sidebar/wrapper
    if (isLoginPage) {
        return <>{children}</>
    }

    // Show loading while checking auth
    if (isLoading || checkingAdmin) {
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
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar userName={user?.fullName || "Admin"} userEmail={user?.email || ""} />
            <main className="flex-1 overflow-auto">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
