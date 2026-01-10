"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"

// User type for the app
export interface User {
    id: string
    email: string
    phone: string | null
    fullName: string
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
}

interface AuthResult {
    success: boolean
    error?: string
}

interface AuthContextType {
    user: User | null
    session: Session | null
    isAuthenticated: boolean
    isLoading: boolean
    signUp: (email: string, password: string, fullName?: string) => Promise<AuthResult>
    signIn: (email: string, password: string) => Promise<AuthResult>
    signInWithGoogle: () => Promise<AuthResult>
    forgotPassword: (email: string) => Promise<AuthResult>
    resetPassword: (newPassword: string) => Promise<AuthResult>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch user profile from users table
    const fetchUserProfile = useCallback(async (email: string): Promise<User | null> => {
        try {
            const { data } = await supabase
                .from("users")
                .select("*")
                .eq("email", email.toLowerCase())
                .single()

            if (data) {
                return {
                    id: data.id,
                    email: data.email || email,
                    phone: data.phone,
                    fullName: data.full_name || "",
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zip_code,
                }
            }
            return null
        } catch {
            return null
        }
    }, [])

    // Create user profile if doesn't exist
    const createUserProfile = useCallback(async (email: string, fullName?: string) => {
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", email.toLowerCase())
            .single()

        if (!existingUser) {
            await supabase.from("users").insert({
                email: email.toLowerCase(),
                phone: "",
                full_name: fullName || "",
            })
        }
    }, [])

    // Listen to auth state changes
    useEffect(() => {
        let mounted = true

        const initAuth = async () => {
            // Check if this is an OAuth callback (URL contains access_token or error)
            const hashParams = new URLSearchParams(window.location.hash.substring(1))
            const isOAuthCallback = hashParams.has('access_token') || hashParams.has('error')

            if (isOAuthCallback) {
                // Let onAuthStateChange handle the OAuth callback
                // Don't set loading to false yet
                return
            }

            // Get initial session
            const { data: { session } } = await supabase.auth.getSession()

            if (mounted) {
                setSession(session)
                if (session?.user?.email) {
                    const profile = await fetchUserProfile(session.user.email)
                    setUser(profile)
                }
                setIsLoading(false)
            }
        }

        initAuth()

        // Listen for auth changes (handles OAuth callbacks)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return

                setSession(session)

                if (session?.user?.email) {
                    // Create profile if new user
                    await createUserProfile(
                        session.user.email,
                        session.user.user_metadata?.full_name || session.user.user_metadata?.name
                    )
                    const profile = await fetchUserProfile(session.user.email)
                    setUser(profile)
                } else {
                    setUser(null)
                }
                setIsLoading(false)
            }
        )

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [fetchUserProfile, createUserProfile])

    // Sign Up with Email & Password
    const signUp = useCallback(async (email: string, password: string, fullName?: string): Promise<AuthResult> => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password,
                options: {
                    data: {
                        full_name: fullName || "",
                    },
                    emailRedirectTo: window.location.href,
                },
            })

            if (error) {
                console.error("Sign up error:", error)
                return { success: false, error: error.message }
            }

            // Check if email confirmation is required
            if (data.user && !data.session) {
                return { success: true, error: "Please check your email to confirm your account" }
            }

            return { success: true }
        } catch (error: any) {
            return { success: false, error: error.message || "Failed to sign up" }
        }
    }, [])

    // Sign In with Email & Password
    const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            })

            if (error) {
                console.error("Sign in error:", error)
                return { success: false, error: error.message }
            }

            return { success: true }
        } catch (error: any) {
            return { success: false, error: error.message || "Failed to sign in" }
        }
    }, [])

    // Sign In with Google
    const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
        try {
            // Use current URL to preserve query params (productId, size, etc.)
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: window.location.href,
                },
            })

            if (error) {
                console.error("Google sign in error:", error)
                return { success: false, error: error.message }
            }

            return { success: true }
        } catch (error: any) {
            return { success: false, error: error.message || "Failed to sign in with Google" }
        }
    }, [])

    // Forgot Password - Send Reset Email
    const forgotPassword = useCallback(async (email: string): Promise<AuthResult> => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                email.trim().toLowerCase(),
                {
                    redirectTo: window.location.href,
                }
            )

            if (error) {
                console.error("Reset password error:", error)
                return { success: false, error: error.message }
            }

            return { success: true }
        } catch (error: any) {
            return { success: false, error: error.message || "Failed to send reset email" }
        }
    }, [])

    // Reset Password (called after clicking email link)
    const resetPassword = useCallback(async (newPassword: string): Promise<AuthResult> => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            })

            if (error) {
                console.error("Update password error:", error)
                return { success: false, error: error.message }
            }

            return { success: true }
        } catch (error: any) {
            return { success: false, error: error.message || "Failed to reset password" }
        }
    }, [])

    // Logout
    const logout = useCallback(async () => {
        await supabase.auth.signOut()
        setUser(null)
        setSession(null)
    }, [])

    const isAuthenticated = !!session

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                isAuthenticated,
                isLoading,
                signUp,
                signIn,
                signInWithGoogle,
                forgotPassword,
                resetPassword,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}
