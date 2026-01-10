"use client"

import { AdminAuthProvider, ProtectedAdminRoute } from "@/lib/admin-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { usePathname } from "next/navigation"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isLoginPage = pathname === "/admin"

    return (
        <AdminAuthProvider>
            {isLoginPage ? (
                children
            ) : (
                <ProtectedAdminRoute>
                    <div className="flex h-screen bg-gray-100">
                        <AdminSidebar />
                        <main className="flex-1 overflow-y-auto">
                            <div className="p-8">
                                {children}
                            </div>
                        </main>
                    </div>
                </ProtectedAdminRoute>
            )}
        </AdminAuthProvider>
    )
}
