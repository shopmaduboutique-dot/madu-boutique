import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="bg-gradient-to-b from-orange-50 to-white py-16 sm:py-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-6">About Madu Boutique</h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Where tradition meets modern elegance. We bring you the finest collection of handcrafted sarees and
                            chudithars from the heart of India.
                        </p>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-black mb-6">Our Story</h2>
                                <div className="space-y-4 text-gray-600">
                                    <p>
                                        Founded in 2020, Madu Boutique began with a simple vision: to make premium traditional Indian wear
                                        accessible to women everywhere, without compromising on quality or elegance.
                                    </p>
                                    <p>
                                        Our name "Madu" means honey in many Indian languages – symbolizing the sweetness and richness we
                                        bring to every piece in our collection.
                                    </p>
                                    <p>
                                        Each saree and chudithar in our collection is carefully sourced from skilled artisans across India,
                                        ensuring that every purchase supports traditional craftsmanship while giving you a piece of
                                        wearable art.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-8 aspect-square flex items-center justify-center">
                                <img
                                    src="/logo.jpg"
                                    alt="Madu Boutique Logo"
                                    className="w-48 h-48 object-contain rounded-2xl shadow-xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16 px-4 bg-gray-50">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-black text-center mb-12">What We Stand For</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                                <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-black mb-3">Quality First</h3>
                                <p className="text-gray-600">
                                    We never compromise on quality. Each piece is inspected for craftsmanship before reaching you.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                                <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-black mb-3">Artisan Love</h3>
                                <p className="text-gray-600">
                                    We partner with local artisans, ensuring fair wages and keeping traditional crafts alive.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                                <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-black mb-3">Fair Prices</h3>
                                <p className="text-gray-600">
                                    Premium quality doesn't have to break the bank. We offer competitive prices for exceptional products.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-black mb-6">Ready to Explore?</h2>
                        <p className="text-gray-600 mb-8">
                            Discover our latest collection of sarees and chudithars, handpicked for the modern woman.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/category/saree"
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                            >
                                Shop Sarees
                            </a>
                            <a
                                href="/category/chudithar"
                                className="px-8 py-4 border-2 border-orange-500 text-orange-500 font-bold rounded-lg hover:bg-orange-50 transition-all"
                            >
                                Shop Chudithars
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
