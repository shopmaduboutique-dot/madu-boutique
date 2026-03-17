import { createClient } from "@supabase/supabase-js"
import type { MetadataRoute } from "next"

const BASE_URL = "https://maduboutique.shop"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all products from database
    const { data: products } = await supabase
        .from("products")
        .select("slug, updated_at, category")
        .eq("in_stock", true)

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${BASE_URL}/category/sarees`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/category/chudithars`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terms-of-service`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/shipping-policy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/return-policy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ]

    // Product pages
    const productPages: MetadataRoute.Sitemap = (products || []).map(
        (product: { slug: string; updated_at: string | null; category: string }) => ({
            url: `${BASE_URL}/product/${product.slug}`,
            lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        })
    )

    return [...staticPages, ...productPages]
}

