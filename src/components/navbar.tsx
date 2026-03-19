"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Leaf,
    Menu,
    X,
    ChevronDown,
} from "lucide-react";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Wetlands Monitoring", href: "/wetland-monitoring" },
    { label: "Sarus Habitat Map", href: "/sarus-map" },
    { label: "Pollution Reporting", href: "/pollution-report" },
    { label: "Wetland Health Score", href: "/wetland-health" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-100"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                            <Leaf className="w-5 h-5 text-dark" />
                        </div>
                        <span className={`text-xl font-bold transition-colors ${scrolled ? 'text-dark' : 'text-white'}`}>
                            Sarus<span className="text-primary">Guard</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary ${scrolled ? "text-gray-700" : "text-gray-200"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-dark rounded-xl font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all"
                        >
                            Open Dashboard
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-dark hover:bg-gray-100" : "text-white hover:bg-white/10"
                            }`}
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-gray-100 shadow-xl"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/10 hover:text-primary font-medium transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileOpen(false)}
                                className="block w-full mt-3 px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-dark rounded-xl font-semibold text-center shadow-lg"
                            >
                                Open Dashboard
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
