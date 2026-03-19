"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface PageBannerProps {
    title: string;
    breadcrumb: string;
}

export default function PageBanner({ title, breadcrumb }: PageBannerProps) {
    return (
        <section className="relative bg-gradient-to-r from-primary to-primary-dark py-20 pt-28 overflow-hidden">
            {/* Circuit Pattern */}
            <div className="absolute inset-0 circuit-pattern opacity-30" />

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-dark/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl sm:text-5xl font-bold text-dark mb-4"
                >
                    {title}
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center justify-center gap-2 text-dark/70 text-sm"
                >
                    <Link href="/" className="hover:text-dark transition-colors">
                        Home
                    </Link>
                    <span>›</span>
                    <span>{breadcrumb}</span>
                </motion.div>
            </div>
        </section>
    );
}
