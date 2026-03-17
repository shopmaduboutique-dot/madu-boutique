// Centralized product data - Single source of truth
import type { Product } from "@/lib/types"

export const products: Product[] = [
    // ========== SAREES ==========
    {
        id: 1,
        name: "Royal Silk Saree",
        price: "₹4,999",
        originalPrice: "₹6,999",
        image: "/elegant-purple-silk-saree-with-gold-embroidery.jpg",
        images: [
            "/elegant-purple-silk-saree-with-gold-embroidery.jpg",
            "/beautiful-blue-cotton-saree-traditional-design.jpg",
            "/luxurious-green-silk-saree-with-beaded-work.jpg",
            "/rich-red-saree-with-traditional-zari-border.jpg",
            "/stunning-gold-embellished-traditional-saree.jpg",
        ],
        sizes: ["Free Size"],
        description: "Premium silk with intricate gold work",
        details:
            "This luxurious royal silk saree features exquisite hand-embroidered gold work on premium quality silk. Perfect for weddings, festivals, and special occasions. The saree has a traditional pallu with detailed embroidery and a decorative border.",
        material: "100% Pure Silk",
        care: "Dry clean only. Handle with care.",
        category: "saree",
        isNew: true,
        inStock: true,
    },
    {
        id: 2,
        name: "Azure Dreamer",
        price: "₹3,899",
        originalPrice: "₹5,499",
        image: "/beautiful-blue-cotton-saree-traditional-design.jpg",
        images: [
            "/beautiful-blue-cotton-saree-traditional-design.jpg",
            "/luxurious-green-silk-saree-with-beaded-work.jpg",
            "/rich-red-saree-with-traditional-zari-border.jpg",
            "/stunning-gold-embellished-traditional-saree.jpg",
            "/elegant-purple-silk-saree-with-gold-embroidery.jpg",
        ],
        sizes: ["Free Size"],
        description: "Breathable cotton with traditional patterns",
        details:
            "Beautiful azure blue cotton saree with traditional woven patterns. This saree is lightweight and comfortable for daily wear or casual gatherings. Features a classic design that complements all skin tones.",
        material: "100% Pure Cotton",
        care: "Machine wash cold. Dry in shade.",
        category: "saree",
        isNew: true,
        inStock: true,
    },
    {
        id: 3,
        name: "Emerald Grace",
        price: "₹5,299",
        originalPrice: "₹7,499",
        image: "/luxurious-green-silk-saree-with-beaded-work.jpg",
        images: [
            "/luxurious-green-silk-saree-with-beaded-work.jpg",
            "/rich-red-saree-with-traditional-zari-border.jpg",
            "/stunning-gold-embellished-traditional-saree.jpg",
            "/elegant-purple-silk-saree-with-gold-embroidery.jpg",
            "/beautiful-blue-cotton-saree-traditional-design.jpg",
        ],
        sizes: ["Free Size"],
        description: "Luxurious silk with beaded detailing",
        details:
            "An elegant emerald green silk saree adorned with exquisite beaded work and stone embellishments. This statement piece is perfect for grand celebrations and evening events. Each bead is carefully placed for maximum elegance.",
        material: "Premium Silk with Beadwork",
        care: "Dry clean only. Store in a cool, dry place.",
        category: "saree",
        isNew: true,
        inStock: true,
    },
    {
        id: 4,
        name: "Crimson Elegance",
        price: "₹4,499",
        originalPrice: "₹6,299",
        image: "/rich-red-saree-with-traditional-zari-border.jpg",
        images: [
            "/rich-red-saree-with-traditional-zari-border.jpg",
            "/stunning-gold-embellished-traditional-saree.jpg",
            "/elegant-purple-silk-saree-with-gold-embroidery.jpg",
            "/beautiful-blue-cotton-saree-traditional-design.jpg",
            "/luxurious-green-silk-saree-with-beaded-work.jpg",
        ],
        sizes: ["Free Size"],
        description: "Rich fabric with traditional zari border",
        details:
            "A stunning crimson red saree with a rich traditional zari border. This timeless classic is perfect for weddings and festive occasions. The rich color and traditional border make it an absolute showstopper.",
        material: "Silk with Zari Border",
        care: "Dry clean only.",
        category: "saree",
        isNew: false,
        inStock: true,
    },
    {
        id: 5,
        name: "Golden Twilight",
        price: "₹5,799",
        originalPrice: "₹7,999",
        image: "/stunning-gold-embellished-traditional-saree.jpg",
        images: [
            "/stunning-gold-embellished-traditional-saree.jpg",
            "/elegant-purple-silk-saree-with-gold-embroidery.jpg",
            "/beautiful-blue-cotton-saree-traditional-design.jpg",
            "/luxurious-green-silk-saree-with-beaded-work.jpg",
            "/rich-red-saree-with-traditional-zari-border.jpg",
        ],
        sizes: ["Free Size"],
        description: "Stunning with exquisite gold work",
        details:
            "A breathtaking gold-embellished saree with intricate traditional work throughout. Perfect for bridesmaids, engagements, and festive celebrations. The golden embellishments catch light beautifully.",
        material: "Premium Silk with Gold Embroidery",
        care: "Dry clean only.",
        category: "saree",
        isNew: true,
        inStock: true,
    },

    // ========== CHUDITHARS ==========
    {
        id: 6,
        name: "Floral Charm",
        price: "₹2,499",
        originalPrice: "₹3,499",
        image: "/beautiful-floral-printed-chudithar-suit.jpg",
        images: [
            "/beautiful-floral-printed-chudithar-suit.jpg",
            "/soft-pastel-pink-chudithar-with-embroidery.jpg",
            "/elegant-dark-blue-chudithar-with-pearl-embellishme.jpg",
            "/bright-sunny-yellow-traditional-chudithar.jpg",
            "/peaceful-mauve-purple-chudithar-suit-traditional.jpg",
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        description: "Colorful floral print on soft cotton",
        details:
            "A vibrant floral printed chudithar suit perfect for everyday wear. The colorful floral patterns bring life to your wardrobe. Comfortable and stylish, this is ideal for casual outings and family gatherings.",
        material: "100% Cotton",
        care: "Machine wash. Dry in shade.",
        category: "chudithar",
        isNew: true,
        inStock: true,
    },
    {
        id: 7,
        name: "Pastel Dreams",
        price: "₹2,199",
        originalPrice: "₹2,999",
        image: "/soft-pastel-pink-chudithar-with-embroidery.jpg",
        images: [
            "/soft-pastel-pink-chudithar-with-embroidery.jpg",
            "/elegant-dark-blue-chudithar-with-pearl-embellishme.jpg",
            "/bright-sunny-yellow-traditional-chudithar.jpg",
            "/peaceful-mauve-purple-chudithar-suit-traditional.jpg",
            "/beautiful-floral-printed-chudithar-suit.jpg",
        ],
        sizes: ["S", "M", "L", "XL"],
        description: "Soft pastel with delicate embroidery",
        details:
            "A soft pastel pink chudithar suit featuring delicate embroidery work. This gentle colored suit is perfect for casual gatherings and everyday wear. The fine embroidery adds a touch of elegance.",
        material: "Cotton with Embroidery",
        care: "Hand wash recommended. Dry in shade.",
        category: "chudithar",
        isNew: false,
        inStock: true,
    },
    {
        id: 8,
        name: "Midnight Pearl",
        price: "₹3,199",
        originalPrice: "₹4,299",
        image: "/elegant-dark-blue-chudithar-with-pearl-embellishme.jpg",
        images: [
            "/elegant-dark-blue-chudithar-with-pearl-embellishme.jpg",
            "/bright-sunny-yellow-traditional-chudithar.jpg",
            "/peaceful-mauve-purple-chudithar-suit-traditional.jpg",
            "/beautiful-floral-printed-chudithar-suit.jpg",
            "/soft-pastel-pink-chudithar-with-embroidery.jpg",
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        description: "Elegant with subtle pearl embellishments",
        details:
            "An elegant dark blue chudithar suit adorned with subtle pearl embellishments. This sophisticated piece is perfect for evening events and celebrations. The pearl work adds a touch of glamour.",
        material: "Cotton with Pearl Work",
        care: "Dry clean for best results.",
        category: "chudithar",
        isNew: true,
        inStock: true,
    },
    {
        id: 9,
        name: "Sunshine Yellow",
        price: "₹2,899",
        originalPrice: "₹3,999",
        image: "/bright-sunny-yellow-traditional-chudithar.jpg",
        images: [
            "/bright-sunny-yellow-traditional-chudithar.jpg",
            "/peaceful-mauve-purple-chudithar-suit-traditional.jpg",
            "/beautiful-floral-printed-chudithar-suit.jpg",
            "/soft-pastel-pink-chudithar-with-embroidery.jpg",
            "/elegant-dark-blue-chudithar-with-pearl-embellishme.jpg",
        ],
        sizes: ["S", "M", "L", "XL"],
        description: "Bright and cheerful with traditional motifs",
        details:
            "A bright and cheerful sunshine yellow chudithar suit with traditional motifs. This energetic colored suit brings joy and positivity. Perfect for festivals, family functions, and celebrations.",
        material: "Cotton",
        care: "Machine wash. Iron on medium heat.",
        category: "chudithar",
        isNew: false,
        inStock: true,
    },
    {
        id: 10,
        name: "Mauve Serenity",
        price: "₹2,699",
        originalPrice: "₹3,799",
        image: "/peaceful-mauve-purple-chudithar-suit-traditional.jpg",
        images: [
            "/peaceful-mauve-purple-chudithar-suit-traditional.jpg",
            "/beautiful-floral-printed-chudithar-suit.jpg",
            "/soft-pastel-pink-chudithar-with-embroidery.jpg",
            "/elegant-dark-blue-chudithar-with-pearl-embellishme.jpg",
            "/bright-sunny-yellow-traditional-chudithar.jpg",
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        description: "Serene mauve with classic patterns",
        details:
            "A serene mauve colored chudithar suit with classic traditional patterns. This versatile piece works for any occasion. The calming color and classic design make it a wardrobe staple.",
        material: "Cotton",
        care: "Machine wash cold. Dry in shade.",
        category: "chudithar",
        isNew: true,
        inStock: true,
    },
]

// Data access functions
export function getAllProducts(): Product[] {
    return products
}

export function getProductById(id: number): Product | undefined {
    return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: "saree" | "chudithar"): Product[] {
    return products.filter((p) => p.category === category)
}

export function getSarees(): Product[] {
    return getProductsByCategory("saree")
}

export function getChudithars(): Product[] {
    return getProductsByCategory("chudithar")
}

export function searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase()
    return products.filter(
        (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
    )
}
