"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden hero-gradient">
            {/* Circuit Pattern Overlay */}
            <div className="absolute inset-0 circuit-pattern-dark opacity-40" />

            {/* Animated Grid Lines */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
            </div>

            {/* Floating Orbs */}
            <motion.div
                animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-primary text-sm font-medium">
                            Anand District, Gujarat
                        </span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6"
                >
                    Protecting Wetlands.
                    <br />
                    <span className="text-gradient">Preserving Biodiversity.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed"
                >
                    AI-powered monitoring system for protecting wetlands and Sarus crane
                    habitats in Anand district. Real-time satellite analysis, pollution
                    tracking, and biodiversity preservation.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/wetland-monitoring"
                        className="group px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-dark rounded-2xl font-semibold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        Explore Wetlands
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-8 py-4 border border-gray-600 text-white rounded-2xl font-semibold text-lg hover:bg-white/5 hover:border-primary/50 transition-all"
                    >
                        View Dashboard
                    </Link>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto"
                >
                    {[
                        { label: "Wetlands Monitored", value: "120+" },
                        { label: "Bird Sightings", value: "350+" },
                        { label: "Pollution Reports", value: "95+" },
                        { label: "Active Alerts", value: "24" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="text-center p-4 rounded-2xl bg-white/5 border border-white/10"
                        >
                            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
