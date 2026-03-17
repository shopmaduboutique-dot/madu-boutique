import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    const BASE_URL = "https://maduboutique.shop"

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin/",
                    "/api/",
                    "/cart/",
                    "/checkout/",
                    "/orders/",
                    "/profile/",
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}
