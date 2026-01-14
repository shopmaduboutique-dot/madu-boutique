import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function PrivacyPolicyPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                {/* Header */}
                <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Privacy Policy</h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-orange max-w-none text-gray-600">
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                            <p className="mb-4">
                                Welcome to Madu Boutique. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and make purchases.
                            </p>
                            <div className="bg-orange-50 p-6 rounded-lg border border-orange-100 mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Details</h3>
                                <ul className="list-none space-y-2 m-0 p-0">
                                    <li><strong>Business Name:</strong> Madu Boutique</li>
                                    <li><strong>Address:</strong> No: 1, 3rd Cross Street, Sambantham Nagar, Kundrathur, Chennai, Tamil Nadu, India</li>
                                    <li><strong>Email:</strong> shop.maduboutique@gmail.com</li>
                                    <li><strong>Phone:</strong> +91 91592 77034</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                            <p className="mb-4">We collect the following personal information when you use our website or make a purchase:</p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li><strong>Name:</strong> To process and deliver your orders</li>
                                <li><strong>Phone Number:</strong> For order updates and customer support</li>
                                <li><strong>Email Address:</strong> For order confirmations, shipping updates, and marketing communications</li>
                                <li><strong>Shipping Address:</strong> To deliver your purchased products</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Automatic Information</h3>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>We use Google Analytics to understand how visitors interact with our website</li>
                                <li>Cookies and similar tracking technologies to improve user experience</li>
                                <li>Device information, browser type, and IP address for security and analytics purposes</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                            <p className="mb-4">We use your personal information for the following purposes:</p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li><strong>Order Processing:</strong> To process your orders, arrange shipping, and provide customer support</li>
                                <li><strong>Communication:</strong> To send order confirmations, shipping updates, and delivery notifications</li>
                                <li><strong>Marketing:</strong> To send promotional offers, new product updates, and special discounts (you can opt-out anytime)</li>
                                <li><strong>Customer Support:</strong> To respond to your queries and resolve any issues</li>
                                <li><strong>Analytics:</strong> To improve our website performance and user experience using Google Analytics</li>
                                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Information</h2>
                            <p className="mb-4">
                                All payment transactions are processed securely through Razorpay, our trusted payment gateway. We do not store or have access to your complete credit/debit card information, CVV, or other sensitive payment details. Razorpay handles all payment data in compliance with PCI-DSS standards.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
                            <p className="mb-4">
                                We respect your privacy and do not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:
                            </p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li><strong>Shipping Partners:</strong> With our trusted suppliers and courier services to fulfill and deliver your orders</li>
                                <li><strong>Payment Processor:</strong> With Razorpay to process your payments securely</li>
                                <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
                                <li><strong>Business Protection:</strong> To protect our rights, property, and safety</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                            <p className="mb-4">
                                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                            <p className="mb-4">You have the following rights regarding your personal information:</p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                                <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
                            </ul>
                            <p className="mt-4">
                                To exercise any of these rights, please contact us at <a href="mailto:shop.maduboutique@gmail.com" className="text-orange-600 hover:text-orange-700">shop.maduboutique@gmail.com</a> or call +91 91592 77034.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Marketing Communications</h2>
                            <p className="mb-4">
                                By providing your contact information, you consent to receive promotional emails, SMS, and WhatsApp messages about our products, offers, and updates. You can opt-out at any time by:
                            </p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>Clicking the "unsubscribe" link in our emails</li>
                                <li>Replying "STOP" to our SMS messages</li>
                                <li>Contacting us directly at shop.maduboutique@gmail.com</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
                            <p className="mb-4">We use cookies and Google Analytics to:</p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>Remember your preferences and settings</li>
                                <li>Understand how you use our website</li>
                                <li>Improve our website functionality and user experience</li>
                            </ul>
                            <p className="mt-4">
                                You can control cookies through your browser settings, but disabling them may affect website functionality.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
                            <p className="mb-4">We retain your personal information for as long as necessary to:</p>
                            <ul className="list-disc pl-5 mb-4 space-y-2">
                                <li>Fulfill the purposes outlined in this policy</li>
                                <li>Comply with legal and regulatory requirements</li>
                                <li>Resolve disputes and enforce our agreements</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
                            <p className="mb-4">
                                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. Please review their privacy policies before providing any personal information.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                            <p className="mb-4">
                                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                            <p className="mb-4">
                                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the updated policy on our website with a new "Last Updated" date.
                            </p>
                        </section>

                        <section className="mb-8 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                            <p className="mb-4">
                                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="font-semibold text-gray-900">Madu Boutique</p>
                                <p>No: 1, 3rd Cross Street, Sambantham Nagar</p>
                                <p>Kundrathur, Chennai, Tamil Nadu, India</p>
                                <p className="mt-2"><strong>Email:</strong> <a href="mailto:shop.maduboutique@gmail.com" className="text-orange-600 hover:text-orange-700">shop.maduboutique@gmail.com</a></p>
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
