import { createServerClient } from "@/lib/supabase"

export type AdminAction =
    | "product_create"
    | "product_update"
    | "product_delete"
    | "order_status_update"
    | "order_tracking_update"

export type EntityType = "product" | "order" | "user"

interface LogDetails {
    [key: string]: unknown
}

/**
 * Log an admin action to the admin_logs table for audit purposes.
 */
export async function logAdminAction(
    adminId: string,
    adminEmail: string,
    action: AdminAction,
    entityType: EntityType,
    entityId: string,
    details?: LogDetails
): Promise<void> {
    try {
        const supabase = createServerClient()

        const { error } = await supabase.from("admin_logs").insert({
            admin_id: adminId,
            admin_email: adminEmail,
            action,
            entity_type: entityType,
            entity_id: entityId,
            details: details || {},
        })

        if (error) {
            console.error("Failed to log admin action:", error)
        }
    } catch (error) {
        // Don't throw - logging should not break the main operation
        console.error("Error logging admin action:", error)
    }
}
