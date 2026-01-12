"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

interface AuthModalProps {
    isOpen: boolean
    onSuccess: () => void
    onClose?: () => void
}

type AuthMode = "signin" | "signup" | "forgot"

export default function PhoneAuthModal({ isOpen, onSuccess, onClose }: AuthModalProps) {
    const { signIn, signUp, signInWithGoogle, forgotPassword, isLoading } = useAuth()
    const [mode, setMode] = useState<AuthMode>("signin")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [googleLoading, setGoogleLoading] = useState(false)

    // Reset form state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setFullName("")
            setError("")
            setSuccessMessage("")
            setMode("signin")
        }
    }, [isOpen])

    const handleClose = () => {
        if (onClose) {
            onClose()
        }
    }

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleGoogleSignIn = async () => {
        setError("")
        setGoogleLoading(true)
        const result = await signInWithGoogle()
        if (!result.success) {
            setError(result.error || "Failed to sign in with Google")
            setGoogleLoading(false)
        }
        // If successful, user will be redirected to Google
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address")
            return
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        const result = await signIn(email, password)

        if (result.success) {
            onSuccess()
        } else {
            // Better error messages
            const errorMsg = result.error || "Invalid email or password"
            if (errorMsg.toLowerCase().includes("invalid")) {
                setError("Invalid email or password. Please check your credentials and try again.")
            } else if (errorMsg.toLowerCase().includes("not found")) {
                setError("No account found with this email. Please sign up first.")
            } else {
                setError(errorMsg)
            }
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")

        if (!fullName.trim()) {
            setError("Please enter your full name")
            return
        }
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address")
            return
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        const result = await signUp(email, password, fullName)

        if (result.success) {
            if (result.error) {
                // Email confirmation required
                setSuccessMessage(result.error)
            } else {
                onSuccess()
            }
        } else {
            // Better error messages for sign up
            const errorMsg = result.error || "Failed to create account"
            if (errorMsg.toLowerCase().includes("already") || errorMsg.toLowerCase().includes("exists")) {
                setError("An account with this email already exists. Please sign in instead.")
            } else if (errorMsg.toLowerCase().includes("weak") || errorMsg.toLowerCase().includes("password")) {
                setError("Password is too weak. Please use at least 6 characters with a mix of letters and numbers.")
            } else {
                setError(errorMsg)
            }
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address")
            return
        }

        const result = await forgotPassword(email)

        if (result.success) {
            setSuccessMessage("Password reset link sent! Check your email.")
        } else {
            setError(result.error || "Failed to send reset email")
        }
    }

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode)
        setError("")
        setSuccessMessage("")
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white relative">
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold">
                        {mode === "signin" && "Welcome Back"}
                        {mode === "signup" && "Create Account"}
                        {mode === "forgot" && "Reset Password"}
                    </h2>
                    <p className="text-orange-100 text-sm mt-1">
                        {mode === "signin" && "Sign in to continue to checkout"}
                        {mode === "signup" && "Create an account to get started"}
                        {mode === "forgot" && "We'll send you a reset link"}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="flex items-center gap-3 p-4 mb-4 bg-green-50 border border-green-200 rounded-xl">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-green-700 font-medium text-sm">{successMessage}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Google Sign In - Show on signin and signup modes */}
                    {(mode === "signin" || mode === "signup") && (
                        <>
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={googleLoading || isLoading}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-4 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
                            >
                                {googleLoading ? (
                                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                                Continue with Google
                            </button>

                            {/* Divider */}
                            <div className="relative mb-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">or</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Sign In Form */}
                    {mode === "signin" && (
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => switchMode("forgot")}
                                    className="text-sm text-orange-600 hover:text-orange-700"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                            <p className="text-center text-sm text-gray-600">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode("signup")}
                                    className="text-orange-600 font-medium hover:text-orange-700"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </form>
                    )}

                    {/* Sign Up Form */}
                    {mode === "signup" && (
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Your full name"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                            <p className="text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode("signin")}
                                    className="text-orange-600 font-medium hover:text-orange-700"
                                >
                                    Sign In
                                </button>
                            </p>
                        </form>
                    )}

                    {/* Forgot Password Form */}
                    {mode === "forgot" && (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                            <p className="text-center text-sm text-gray-600">
                                Remember your password?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode("signin")}
                                    className="text-orange-600 font-medium hover:text-orange-700"
                                >
                                    Sign In
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
