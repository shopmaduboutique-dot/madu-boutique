"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"
import { SupabaseErrorSuppressor } from "@/components/supabase-error-suppressor"

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
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("email", email.toLowerCase())
                .maybeSingle()

            if (error) {
                console.debug('Profile fetch issue:', error)
                return null
            }

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
        try {
            // Use upsert to handle race conditions (409s)
            // ignoreDuplicates: true means "Insert if not exists, otherwise do nothing"
            // This prevents overwriting existing data (like phone numbers) if the user already exists
            const { error } = await supabase.from("users").upsert({
                email: email.toLowerCase(),
                phone: "",
                full_name: fullName || "",
            }, {
                onConflict: 'email',
                ignoreDuplicates: true
            })

            if (error) {
                console.debug('Profile creation failed:', error)
            }
        } catch (err) {
            console.debug('Profile operation failed:', err)
        }
    }, [])

    // Listen to auth state changes
    // Ref to prevent parallel auth operations (signIn, signUp, etc.)
    const authOperationRef = useRef(false)

    useEffect(() => {
        let mounted = true

        // Listen for auth changes (handles OAuth callbacks, initial load, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return

                console.debug("Auth state change:", event)
                setSession(session)

                if (session?.user?.email) {
                    // Only create profile on explicit sign-in event
                    if (event === 'SIGNED_IN') {
                        await createUserProfile(
                            session.user.email,
                            session.user.user_metadata?.full_name || session.user.user_metadata?.name
                        )
                    }

                    // Fetch profile if we have a session (mostly for initial load or refresh)
                    // We can optimize this by checking if 'user' is already set, 
                    // but to be safe and ensure data freshness on auth events, we fetch.
                    // This uses maybeSingle() so it's cheap and safe.
                    const profile = await fetchUserProfile(session.user.email)
                    if (mounted) setUser(profile)
                } else {
                    if (mounted) setUser(null)
                }

                if (mounted) setIsLoading(false)
            }
        )

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [fetchUserProfile, createUserProfile])

    // Sign Up with Email & Password
    const signUp = useCallback(async (email: string, password: string, fullName?: string): Promise<AuthResult> => {
        if (authOperationRef.current) return { success: false, error: "Operation in progress" }
        authOperationRef.current = true
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
        } finally {
            authOperationRef.current = false
        }
    }, [])

    // Sign In with Email & Password
    const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
        if (authOperationRef.current) return { success: false, error: "Operation in progress" }
        authOperationRef.current = true
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
        } finally {
            authOperationRef.current = false
        }
    }, [])

    // Sign In with Google
    const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
        if (authOperationRef.current) return { success: false, error: "Operation in progress" }
        authOperationRef.current = true
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
        } finally {
            authOperationRef.current = false
        }
    }, [])

    // Forgot Password - Send Reset Email
    const forgotPassword = useCallback(async (email: string): Promise<AuthResult> => {
        if (authOperationRef.current) return { success: false, error: "Operation in progress" }
        authOperationRef.current = true
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
        } finally {
            authOperationRef.current = false
        }
    }, [])

    // Reset Password (called after clicking email link)
    const resetPassword = useCallback(async (newPassword: string): Promise<AuthResult> => {
        if (authOperationRef.current) return { success: false, error: "Operation in progress" }
        authOperationRef.current = true
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
        } finally {
            authOperationRef.current = false
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
            <SupabaseErrorSuppressor />
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
