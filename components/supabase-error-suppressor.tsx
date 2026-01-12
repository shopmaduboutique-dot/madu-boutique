"use client"

import { useEffect } from "react"

/**
 * Suppresses Supabase AbortError that occurs in Next.js dev mode.
 * This is a known issue with Supabase real-time and auth listeners.
 * The error doesn't affect functionality - it's just console noise.
 */
export function SupabaseErrorSuppressor() {
    useEffect(() => {
        const handleError = (event: PromiseRejectionEvent) => {
            // Suppress AbortError from Supabase locks.ts
            if (
                event.reason?.message?.includes('AbortError') ||
                event.reason?.name === 'AbortError' ||
                event.reason?.toString()?.includes('signal is aborted')
            ) {
                event.preventDefault()
                // Optionally log in development for debugging
                if (process.env.NODE_ENV === 'development') {
                    console.debug('[Suppressed] Supabase AbortError - this is normal in dev mode')
                }
            }
        }

        window.addEventListener('unhandledrejection', handleError)

        return () => {
            window.removeEventListener('unhandledrejection', handleError)
        }
    }, [])

    return null
}
