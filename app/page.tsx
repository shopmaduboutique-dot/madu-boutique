"use client"

import { useState } from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import Hero from "@/components/hero"
import CategoryToggle from "@/components/category-toggle"
import ProductGrid from "@/components/product-grid"

export default function Home() {
  const [category, setCategory] = useState("saree")

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <Hero />
        <CategoryToggle category={category} setCategory={setCategory} />
        <ProductGrid category={category} />
      </main>
      <Footer />
    </>
  )
}
