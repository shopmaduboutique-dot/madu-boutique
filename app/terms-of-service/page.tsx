import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function TermsOfServicePage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                {/* Header */}
                <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Terms of Service</h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Please read these terms carefully before using our website.
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-orange max-w-none text-gray-600">

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="mb-4">
                                By accessing and using this website (Madu Boutique), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Product Information</h2>
                            <p className="mb-4">
                                We strive to be as accurate as possible in the description of our products. However, we do not warrant that product descriptions, colors, or other content of this site is accurate, complete, reliable, current, or error-free.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded mb-4">
                                <p className="font-semibold text-yellow-800">Color Disclaimer:</p>
                                <p className="text-yellow-700">
                                    Due to lighting conditions at the time of photography and the settings of your device's screen, the actual color of the product may vary slightly from the image.
                                </p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Pricing and Payments</h2>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>All prices are listed in Indian Rupees (INR) and are subject to change without notice.</li>
                                <li>We reserve the right to modify or discontinue any product or service without notice.</li>
                                <li>Payments are processed securely via Razorpay. We are not responsible for any issues arising from the payment gateway regarding transaction failures, although we will assist where possible.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Shipping and Delivery</h2>
                            <p className="mb-4">
                                Our shipping and delivery practices are governed by our <a href="/shipping-policy" className="text-orange-600 hover:underline">Shipping Policy</a>. By placing an order, you agree to the terms outlined therein regarding delivery timelines, charges, and responsibilities.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Returns and Refunds</h2>
                            <p className="mb-4">
                                Returns and refunds are subject to our <a href="/return-policy" className="text-orange-600 hover:underline">Return & Refund Policy</a>. Please review this policy to understand your rights and our obligations regarding damaged or defective items.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Account</h2>
                            <p className="mb-4">
                                If you create an account on this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account or password.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
                            <p className="mb-4">
                                In no event shall Madu Boutique, its directors, employees, or suppliers be liable for any indirect, special, incidental, or consequential damages including but not limited to loss of data, loss of profit, or business interruption, arising out of the use or inability to use the materials on this site.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
                            <p className="mb-4">
                                These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
                            <p className="mb-4">
                                Questions about the Terms of Service should be sent to us at:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="font-semibold text-gray-900">Madu Boutique</p>
                                <p>No: 1, 3rd Cross Street, Sambantham Nagar</p>
                                <p>Kundrathur, Chennai, Tamil Nadu, India</p>
                                <p><strong>Email:</strong> <a href="mailto:shop.maduboutique@gmail.com" className="text-orange-600 hover:text-orange-700">shop.maduboutique@gmail.com</a></p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
