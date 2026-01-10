// Auto-generated Supabase database types
// You can regenerate this file using: npx supabase gen types typescript

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    full_name: string
                    email: string | null
                    phone: string
                    address: string | null
                    city: string | null
                    state: string | null
                    zip_code: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    full_name: string
                    email?: string | null
                    phone: string
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    zip_code?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    email?: string | null
                    phone?: string
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    zip_code?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            products: {
                Row: {
                    id: number
                    name: string
                    price: number
                    original_price: number | null
                    image: string | null
                    images: string[] | null
                    sizes: string[] | null
                    description: string | null
                    details: string | null
                    material: string | null
                    care: string | null
                    category: string
                    is_new: boolean
                    in_stock: boolean
                    stock_quantity: number
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    price: number
                    original_price?: number | null
                    image?: string | null
                    images?: string[] | null
                    sizes?: string[] | null
                    description?: string | null
                    details?: string | null
                    material?: string | null
                    care?: string | null
                    category: string
                    is_new?: boolean
                    in_stock?: boolean
                    stock_quantity?: number
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    price?: number
                    original_price?: number | null
                    image?: string | null
                    images?: string[] | null
                    sizes?: string[] | null
                    description?: string | null
                    details?: string | null
                    material?: string | null
                    care?: string | null
                    category?: string
                    is_new?: boolean
                    in_stock?: boolean
                    stock_quantity?: number
                    created_at?: string
                }
                Relationships: []
            }
            orders: {
                Row: {
                    id: string
                    order_number: string
                    user_id: string | null
                    status: string
                    subtotal: number
                    shipping_cost: number
                    total: number
                    delivery_name: string
                    delivery_phone: string
                    delivery_email: string | null
                    delivery_address: string
                    delivery_city: string
                    delivery_state: string | null
                    delivery_zip: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_number: string
                    user_id?: string | null
                    status?: string
                    subtotal: number
                    shipping_cost?: number
                    total: number
                    delivery_name: string
                    delivery_phone: string
                    delivery_email?: string | null
                    delivery_address: string
                    delivery_city: string
                    delivery_state?: string | null
                    delivery_zip: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_number?: string
                    user_id?: string | null
                    status?: string
                    subtotal?: number
                    shipping_cost?: number
                    total?: number
                    delivery_name?: string
                    delivery_phone?: string
                    delivery_email?: string | null
                    delivery_address?: string
                    delivery_city?: string
                    delivery_state?: string | null
                    delivery_zip?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "orders_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            order_items: {
                Row: {
                    id: number
                    order_id: string
                    product_id: number | null
                    product_name: string
                    product_price: number
                    size: string | null
                    quantity: number
                    line_total: number
                }
                Insert: {
                    id?: number
                    order_id: string
                    product_id?: number | null
                    product_name: string
                    product_price: number
                    size?: string | null
                    quantity?: number
                    line_total: number
                }
                Update: {
                    id?: number
                    order_id?: string
                    product_id?: number | null
                    product_name?: string
                    product_price?: number
                    size?: string | null
                    quantity?: number
                    line_total?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey"
                        columns: ["order_id"]
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey"
                        columns: ["product_id"]
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
