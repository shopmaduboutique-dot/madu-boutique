"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface AdminAuthContextType {
    isAdmin: boolean
    isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType>({
    isAdmin: false,
    isLoading: true,
})

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoading: authLoading } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!authLoading) {
            if (user && user.isAdmin) {
                setIsAdmin(true)
            } else {
                setIsAdmin(false)
            }
            setIsLoading(false)
        }
    }, [user, authLoading])

    return (
        <AdminAuthContext.Provider value={{ isAdmin, isLoading }}>
            {children}
        </AdminAuthContext.Provider>
    )
}

export function useAdminAuth() {
    return useContext(AdminAuthContext)
}

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
    const { isAdmin, isLoading } = useAdminAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAdmin) {
            router.push("/admin")
        }
    }, [isLoading, isAdmin, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
        )
    }

    if (!isAdmin) {
        return null // Will redirect
    }

    return <>{children}</>
}
