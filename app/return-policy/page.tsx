import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Link from "next/link";

export default function ReturnPolicyPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                {/* Header */}
                <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Return & Refund Policy</h1>
                        <p className="mt-4 text-lg text-gray-600">
                            At Madu Boutique, we want you to love your purchase. Here is our policy on returns and refunds.
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-orange max-w-none text-gray-600">

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns & Replacements</h2>
                            <p className="mb-4">
                                We take great pride in our collection of sarees and chudithars. As we operate on a reseller model with trusted suppliers, we have specific guidelines for returns and replacements to ensure fairness and quality.
                            </p>

                            <div className="bg-orange-50 bg-opacity-50 p-6 rounded-lg border border-orange-100 mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Eligibility for Returns</h3>
                                <p className="mb-2">We accept returns/replacements ONLY in the following cases:</p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-800">
                                    <li><strong>Damaged Product:</strong> If you receive a product that is physically damaged.</li>
                                    <li><strong>Defective Product:</strong> If the product has a genuine manufacturing defect.</li>
                                    <li><strong>Wrong Product:</strong> If you receive a product different from what you ordered (wrong color, design, or item).</li>
                                </ul>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Non-Returnable Items</h3>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>Products that have been worn, washed, or used.</li>
                                <li>Products without original tags and packaging.</li>
                                <li>Sarees with stitched blouses or fall/pico work done.</li>
                                <li>Minor color variations (due to screen resolution and photography lighting).</li>
                                <li>Change of mind or "don't like the style" reasons.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reporting a Return</h2>
                            <p className="mb-4">
                                To initiate a return or replacement, you must report the issue within <strong>48 hours</strong> of delivery.
                            </p>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">How to Report:</h3>
                            <ol className="list-decimal pl-5 mb-4 space-y-2">
                                <li><strong>Unboxing Video:</strong> For safety and verification, we highly recommend taking a continuous unboxing video of the package. This is mandatory for claiming damage/missing items.</li>
                                <li><strong>Contact Us:</strong> Email us at <a href="mailto:shop.maduboutique@gmail.com" className="text-orange-600">shop.maduboutique@gmail.com</a> or WhatsApp/Call +91 91592 77034.</li>
                                <li><strong>Provide Details:</strong> Include your Order ID, clear photos/video of the damage, and a description of the issue.</li>
                            </ol>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
                            <p className="mb-4">
                                Once your return request is approved and the item is received by us/our supplier:
                            </p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li><strong>Quality Check:</strong> We will inspect the returned item for usage and original condition.</li>
                                <li><strong>Approval:</strong> If the return is approved, we will initiate a refund or dispatch a replacement (based on your preference and stock availability).</li>
                                <li><strong>Refund Timeline:</strong> Refunds will be processed to the original payment method within <strong>7-10 business days</strong>.</li>
                            </ul>
                            <p className="text-sm italic">
                                Note: Shipping charges are non-refundable unless the return is due to our error (wrong/damaged item).
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellations</h2>
                            <p className="mb-4">
                                You can cancel your order before it has been shipped. Once the order is shipped/dispatched, IT CANNOT be cancelled.
                            </p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>To cancel, contact our support immediately with your Order ID.</li>
                                <li>If cancelled before shipping, a full refund will be initiated.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Undeliverable Orders</h2>
                            <p className="mb-4">
                                As per our <Link href="/shipping-policy" className="text-orange-600 hover:underline">Shipping Policy</Link>, if a package is returned to us due to incorrect address or customer unavailability, we will refund the product cost after deducting shipping and reverse logistics charges.
                            </p>
                        </section>

                        <section className="mb-8 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                            <p className="mb-4">
                                For any questions regarding returns or refunds, please reach out to us:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p><strong>Email:</strong> <a href="mailto:shop.maduboutique@gmail.com" className="text-orange-600 hover:text-orange-700">shop.maduboutique@gmail.com</a></p>
                                <p><strong>Phone:</strong> +91 91592 77034</p>
                                <p><strong>Support Hours:</strong> Monday to Saturday, 10:00 AM - 7:00 PM IST</p>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
