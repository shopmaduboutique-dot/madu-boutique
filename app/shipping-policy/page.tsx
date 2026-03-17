import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function ShippingPolicyPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                {/* Header */}
                <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Shipping Policy</h1>
                        <p className="mt-4 text-lg text-gray-600">
                            At Madu Boutique, we strive to deliver your favorite traditional and modern sarees and chudithars safely and promptly.
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-orange max-w-none text-gray-600">

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Shipping Coverage</h2>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">1.1 Domestic Shipping Only</h3>
                            <p className="mb-4">We currently ship only within India. We deliver to all states and union territories across the country.</p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">1.2 International Shipping</h3>
                            <p className="mb-4">International shipping is not available at this time. We apologize for any inconvenience and hope to expand our services in the future.</p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">1.3 Serviceable Areas</h3>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>All major cities and towns</li>
                                <li>Rural and remote areas (subject to courier serviceability)</li>
                                <li>PO Box addresses (where courier services are available)</li>
                            </ul>
                            <p className="text-sm italic">Note: Some remote locations may experience longer delivery times.</p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Delivery Timeline</h2>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">2.1 Standard Delivery</h3>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li><strong>Delivery Time:</strong> 4-8 business days from the date of order confirmation</li>
                                <li>Business days exclude Sundays and national/public holidays</li>
                                <li>Delivery timeline starts after successful payment confirmation</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">2.2 Order Processing Time</h3>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>Orders are processed within 24 hours of payment confirmation</li>
                                <li>Orders placed on weekends or holidays will be processed on the next business day</li>
                                <li>You will receive a shipping confirmation email with tracking details once your order is dispatched</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">2.3 Factors Affecting Delivery</h3>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>Your location and pin code</li>
                                <li>Courier service availability in your area</li>
                                <li>Weather conditions and natural calamities</li>
                                <li>Public holidays and festivals</li>
                                <li>Government restrictions or lockdowns</li>
                                <li>Order volume during peak seasons (festivals, sales)</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Shipping Process</h2>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">3.1 Our Business Model</h3>
                            <p className="mb-4">
                                Madu Boutique operates as a reseller of premium sarees and chudithars. We partner with trusted suppliers who maintain high quality standards.
                            </p>
                            <div className="bg-orange-50 p-4 rounded mb-4">
                                <p><strong>Important:</strong> Products are shipped directly from our trusted suppliers to you. We do not physically handle or repackage the products before they reach you. This allows us to:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Offer competitive prices</li>
                                    <li>Ensure faster processing</li>
                                    <li>Maintain product quality from source to delivery</li>
                                </ul>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">3.2 Order Confirmation</h3>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>You will receive an order confirmation email immediately</li>
                                <li>Payment verification takes a few minutes</li>
                                <li>Once payment is confirmed, your order enters processing</li>
                                <li>You will receive a dispatch notification with tracking details within 24-48 hours</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">3.3 Shipping Partners</h3>
                            <p className="mb-4">We work with reliable and trusted courier partners to ensure safe delivery:</p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>Professional courier services with nationwide coverage</li>
                                <li>Trackable shipments for your peace of mind</li>
                                <li>Trained delivery personnel for careful handling</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Shipping Charges</h2>
                            <p className="mb-4">
                                Shipping charges may vary based on your delivery location, weight and dimensions of the product, and current courier rates. Shipping costs (if applicable) will be clearly displayed at checkout before you confirm your order.
                            </p>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">4.2 Free Shipping</h3>
                            <p className="mb-4">We may offer free shipping on:</p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>Orders above a certain value (promotional offers)</li>
                                <li>Special occasions and festivals</li>
                                <li>Specific product categories</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Order Tracking</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">5.1 Tracking Information</h3>
                                    <p>Once your order is shipped, you will receive a shipping confirmation email, tracking number/AWB number, courier partner details, and estimated delivery date.</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">5.2 How to Track Your Order</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Using the tracking link provided in the shipping confirmation email</li>
                                        <li>Visiting the courier partner's website and entering your tracking number</li>
                                        <li>Contacting our customer support for assistance</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">5.3 Tracking Updates</h3>
                                    <p>Tracking information is updated regularly by the courier service. Please allow 24 hours after dispatch for tracking details to become active.</p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Delivery Process</h2>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">6.1 Delivery Attempts</h3>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>Up to 3 delivery attempts at your provided address</li>
                                <li>Delivery during business hours (10:00 AM - 7:00 PM typically)</li>
                                <li>Contact via phone before delivery (ensure your phone is reachable)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">6.2 Failed Delivery</h3>
                            <p className="mb-4">
                                If delivery fails after multiple attempts, the courier will contact you to reschedule delivery. The package may be held at the nearest courier hub for pickup. After 7 days, the package may be returned to us.
                            </p>
                            <div className="bg-red-50 border border-red-100 p-4 rounded mb-4">
                                <p className="font-semibold text-red-800">Important:</p>
                                <p className="text-red-700 mb-2">If the package is returned due to incorrect address, customer unavailability, or refusal to accept, you will be responsible for:</p>
                                <ul className="list-disc pl-5 text-red-700">
                                    <li>Return shipping charges</li>
                                    <li>Any redelivery charges</li>
                                    <li>The product may not be reshipped without additional payment</li>
                                </ul>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">6.3 Receiving Your Order</h3>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li><strong>Inspect the Package:</strong> Check for any visible damage to the outer packaging</li>
                                <li><strong>Verify Contents:</strong> Open the package in the presence of the delivery person if possible</li>
                                <li><strong>Report Issues Immediately:</strong> If there's damage or wrong product, note it with the delivery person</li>
                                <li><strong>Keep Packaging:</strong> Retain all packaging materials, tags, and invoices for potential returns</li>
                            </ul>
                            <p className="font-bold text-orange-600">Critical: Any damage or issues must be reported within 48 hours of delivery to be eligible for refund or replacement.</p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Shipping Address</h2>
                            <p className="mb-4">Please ensure you provide complete and accurate delivery address, correct pin code, landmark, working phone number, and an alternative contact number.</p>
                            <p className="mb-4">Once an order is shipped, the delivery address cannot be changed. Please verify your address carefully before confirming your order. We may contact you to verify your address if it appears incomplete.</p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Shipping Delays</h2>
                            <p className="mb-4">
                                Despite our best efforts, delays may occur due to natural calamities, political unrest, courier service delays, government restrictions, or festival rushes.
                            </p>
                            <div className="bg-gray-50 p-4 rounded">
                                <p><strong>Communication:</strong> If there's a delay, we will notify you via email or phone. You can always contact our customer support for updates.</p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Damaged or Lost Shipments</h2>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">9.1 Damaged Shipments</h3>
                            <p className="mb-2">If your package arrives damaged:</p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>Do not accept the delivery if outer packaging is severely damaged</li>
                                <li>Take photos of the damaged package</li>
                                <li>Contact us immediately at shop.maduboutique@gmail.com or +91 91592 77034</li>
                                <li>We will initiate a claim with the courier and arrange for replacement or refund</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">9.2 Lost Shipments</h3>
                            <p className="mb-4">
                                If your order shows as delivered but you haven't received it, please check with family/neighbors and verify the address. Contact us within 48 hours. We will investigate and resolve the issue within 7-10 business days.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Multiple Items in One Order</h2>
                            <p className="mb-4">
                                If you order multiple items, they may be shipped together or separately depending on supplier availability. Each item may have its own tracking number. If you receive a partial order, please check the tracking status for remaining items.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Holidays and Special Occasions</h2>
                            <p className="mb-4">
                                During festival seasons and sales, order volumes are high which may cause slight delays (1-3 days). Orders placed on or near public holidays will be processed on the next business day.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Undeliverable Shipments</h2>
                            <p className="mb-4">
                                Orders may be marked undeliverable due to incorrect address, customer unavailability, or refusal to accept. Undeliverable shipments will be returned to our supplier. No refund will be provided if the issue is due to customer error. Reshipping will require payment of shipping charges.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Customer Support</h2>
                            <div className="bg-orange-50 p-6 rounded-lg">
                                <p className="font-semibold text-gray-900 mb-2">For any shipping-related queries:</p>
                                <p><strong>Email:</strong> <a href="mailto:shop.maduboutique@gmail.com" className="text-orange-600 hover:text-orange-700">shop.maduboutique@gmail.com</a></p>
                                <p><strong>Phone:</strong> +91 91592 77034</p>
                                <p><strong>Address:</strong> No: 1, 3rd Cross Street, Sambantham Nagar, Kundrathur, Chennai, Tamil Nadu, India</p>
                                <p><strong>Support Hours:</strong> Monday to Saturday, 10:00 AM - 7:00 PM IST</p>
                                <p className="mt-4 text-sm text-gray-600">We aim to respond to all queries within 24 hours during business days.</p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Important Terms</h2>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li><strong>Liability Limitation:</strong> Madu Boutique is not liable for delays caused by courier services, force majeure events, or customer errors.</li>
                                <li><strong>Title and Risk:</strong> Title and risk of loss pass to you upon delivery.</li>
                                <li><strong>Policy Updates:</strong> We reserve the right to update this Shipping Policy at any time.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Tips for Smooth Delivery</h2>
                            <ul className="list-none space-y-2">
                                <li>✓ Provide complete and accurate address with pin code</li>
                                <li>✓ Include landmark for easy navigation</li>
                                <li>✓ Keep your phone reachable during delivery hours</li>
                                <li>✓ Track your order regularly</li>
                                <li>✓ Be available to receive the order</li>
                                <li>✓ Inspect the package upon delivery</li>
                                <li>✓ Report any issues within 48 hours</li>
                            </ul>
                        </section>

                        <div className="text-center pt-8 border-t border-gray-200 mt-12">
                            <p className="text-lg font-medium text-gray-900">Thank you for choosing Madu Boutique!</p>
                            <p className="text-gray-600 mt-2">We are committed to delivering your beautiful sarees and chudithars safely and on time.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
