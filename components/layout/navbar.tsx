"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import AuthModal from "@/components/phone-auth-modal"

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Sarees", href: "/category/saree" },
    { name: "Chudithars", href: "/category/chudithar" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
]

export default function Navbar() {
    const pathname = usePathname()
    const { cartCount, setIsCartOpen } = useCart()
    const { user, isLoading, isAuthenticated, logout } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    return (
        <>
            <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                            <img
                                src="/logo.jpg"
                                alt="Madu Boutique Logo"
                                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded"
                            />
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-black">Madu Boutique</h1>
                                <p className="text-xs text-gray-500 hidden sm:block">Premium Traditional Wear</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href ||
                                    (link.href !== "/" && pathname?.startsWith(link.href))
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? "bg-orange-100 text-orange-600"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-black"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Right side - User, Cart & Mobile Menu */}
                        <div className="flex items-center gap-2">
                            {/* User Auth Section */}
                            {!isLoading && (
                                <>
                                    {isAuthenticated && user ? (
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowUserMenu(!showUserMenu)}
                                                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                                                    {user.fullName || user.email?.split('@')[0]}
                                                </span>
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* User Dropdown Menu */}
                                            {showUserMenu && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                                                    <div className="px-4 py-2 border-b border-gray-100">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{user.fullName || 'User'}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            logout()
                                                            setShowUserMenu(false)
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        Sign Out
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowAuthModal(true)}
                                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Sign In
                                        </button>
                                    )}
                                </>
                            )}

                            {/* Cart Button */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-3 hover:bg-orange-50 rounded-lg transition-colors"
                                data-cart-icon
                            >
                                <svg
                                    className="w-6 h-6 text-black"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-3 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg
                                    className="w-6 h-6 text-black"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isMobileMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {isMobileMenuOpen && (
                        <nav className="md:hidden py-4 border-t border-gray-100">
                            <div className="flex flex-col gap-1">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href ||
                                        (link.href !== "/" && pathname?.startsWith(link.href))
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive
                                                ? "bg-orange-100 text-orange-600"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-black"
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    )
                                })}

                                {/* Mobile Auth Section */}
                                {!isLoading && (
                                    <>
                                        {isAuthenticated && user ? (
                                            <>
                                                <div className="px-4 py-3 border-t border-gray-100 mt-2">
                                                    <p className="text-sm font-medium text-gray-900">{user.fullName || 'User'}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        logout()
                                                        setIsMobileMenuOpen(false)
                                                    }}
                                                    className="px-4 py-3 text-left text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    Sign Out
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setShowAuthModal(true)
                                                    setIsMobileMenuOpen(false)
                                                }}
                                                className="px-4 py-3 mt-2 text-base font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                                            >
                                                Sign In / Sign Up
                                            </button>
                                        )}
                                    </>
                                )}

                                <Link
                                    href="/cart"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-black"
                                >
                                    View Cart ({cartCount})
                                </Link>
                            </div>
                        </nav>
                    )}
                </div>
            </header>

            {/* Click outside to close user menu */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onSuccess={() => setShowAuthModal(false)}
            />
        </>
    )
}
