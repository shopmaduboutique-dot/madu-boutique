// Supabase client configuration
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
}

// Singleton pattern to prevent multiple client instances in dev mode
let supabaseInstance: SupabaseClient<Database> | null = null

function getSupabaseClient(): SupabaseClient<Database> {
    if (supabaseInstance) return supabaseInstance

    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        realtime: {
            params: {
                eventsPerSecond: 10,
            },
        },
        global: {
            headers: {
                'X-Client-Info': 'madu-boutique',
            },
        },
    })

    return supabaseInstance
}

export const supabase = getSupabaseClient()

// Server-side client for API routes (uses service role key if available)
export function createServerClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    return createClient<Database>(
        supabaseUrl,
        serviceRoleKey || supabaseAnonKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
}

