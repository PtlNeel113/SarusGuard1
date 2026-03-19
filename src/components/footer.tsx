"use client";

import Link from "next/link";
import { Leaf, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

const footerLinks = {
    "Other Pages": [
        { label: "Home", href: "/" },
        { label: "Wetland Monitoring", href: "/wetland-monitoring" },
        { label: "Sarus Map", href: "/sarus-map" },
        { label: "Pollution Reports", href: "/pollution-report" },
        { label: "Dashboard", href: "/dashboard" },
    ],
    "Quick Links": [
        { label: "About SarusGuard", href: "/about" },
        { label: "Our Mission", href: "/about" },
        { label: "Wetland Data", href: "/wetland-health" },
        { label: "Bird Biodiversity", href: "/sarus-map" },
        { label: "Partners", href: "/about" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-dark text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-dark" />
                            </div>
                            <span className="text-xl font-bold">
                                Sarus<span className="text-primary">Guard</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            AI-powered wetland protection system safeguarding ecosystems and
                            Sarus crane habitats in Anand district, Gujarat.
                        </p>
                        <div className="flex gap-3">
                            {["twitter", "github", "linkedin"].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all"
                                >
                                    <ArrowUpRight className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-semibold text-white mb-6">{title}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-primary text-sm transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Contact Info</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span>Anand District, Gujarat, India</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span>info@sarusguard.org</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span>+91 98765 43210</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2026 SarusGuard. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">
                            Terms of Use
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
