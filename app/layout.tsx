import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { CartDrawer } from "@/components/cart-drawer"
import { FlyingAnimationContainer } from "@/components/flying-animation"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Madu Boutique - Premium Women's Traditional Wear",
  description:
    "Discover exquisite sarees and chudithars. Premium quality traditional Indian clothing for modern women.",
  generator: "v0.app",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Madu Boutique - Premium Women's Traditional Wear",
    description: "Discover exquisite sarees and chudithars. Premium quality traditional Indian clothing for modern women.",
    images: ["/logo.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased bg-white`}>
        <AuthProvider>
          <CartProvider>
            <FlyingAnimationContainer>
              {children}
              <CartDrawer />
            </FlyingAnimationContainer>
            <Analytics />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
