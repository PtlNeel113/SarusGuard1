"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Satellite,
    Map,
    AlertTriangle,
    Activity,
    Shield,
    LayoutDashboard,
} from "lucide-react";

const features = [
    {
        title: "AI Wetland Monitoring",
        description:
            "Satellite data analysis, water body detection, and encroachment alerts powered by advanced AI algorithms.",
        icon: Satellite,
        href: "/wetland-monitoring",
        variant: "dark" as const,
    },
    {
        title: "Wetland Health Analytics",
        description:
            "Comprehensive health scoring based on water area, bird sightings, pollution reports, and vegetation cover.",
        icon: Activity,
        href: "/wetland-health",
        variant: "green" as const,
    },
    {
        title: "Sarus Habitat Mapping",
        description:
            "Interactive maps showing bird sightings, nest locations, and migration zones across Anand district.",
        icon: Map,
        href: "/sarus-map",
        variant: "dark" as const,
    },
    {
        title: "Pollution Reporting",
        description:
            "Community-powered pollution reporting with auto GPS detection, photo uploads, and classification.",
        icon: AlertTriangle,
        href: "/pollution-report",
        variant: "light" as const,
    },
    {
        title: "Encroachment Detection",
        description:
            "Satellite imagery comparison to detect illegal land use changes with before/after visualization.",
        icon: Shield,
        href: "/encroachment",
        variant: "light" as const,
    },
    {
        title: "Panchayat Dashboard",
        description:
            "Admin interface for monitoring wetlands, tracking reports, and managing environmental data.",
        icon: LayoutDashboard,
        href: "/dashboard",
        variant: "light" as const,
    },
];

const cardStyles = {
    dark: "bg-dark-card text-white hover:shadow-2xl hover:shadow-primary/10",
    green:
        "bg-gradient-to-br from-primary to-primary-dark text-dark hover:shadow-2xl hover:shadow-primary/30",
    light:
        "bg-white text-dark border border-gray-200 hover:shadow-2xl hover:border-primary/30",
};

const iconStyles = {
    dark: "bg-primary/10 text-primary",
    green: "bg-dark/20 text-dark",
    light: "bg-primary/10 text-primary",
};

const descStyles = {
    dark: "text-gray-400",
    green: "text-dark/70",
    light: "text-gray-500",
};

const arrowStyles = {
    dark: "text-primary",
    green: "text-dark",
    light: "text-primary",
};

export default function FeatureCards() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-section-bg">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                        Our Services
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-heading mt-4 mb-6">
                        Our Mission Is To Make{" "}
                        <span className="text-gradient">Wetland Protection</span>
                        <br /> Better Through Technology
                    </h2>
                    <p className="text-text-body max-w-2xl mx-auto text-lg">
                        Leveraging AI, satellite imagery, and community participation to
                        preserve critical wetland ecosystems and protect endangered species.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link href={feature.href} className="block h-full group">
                                    <div
                                        className={`p-8 rounded-2xl h-full card-hover cursor-pointer transition-all ${cardStyles[feature.variant]}`}
                                    >
                                        {/* Icon */}
                                        <div
                                            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${iconStyles[feature.variant]}`}
                                        >
                                            <Icon className="w-7 h-7" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>

                                        {/* Description */}
                                        <p className={`text-sm leading-relaxed mb-6 ${descStyles[feature.variant]}`}>
                                            {feature.description}
                                        </p>

                                        {/* Arrow */}
                                        <div
                                            className={`flex items-center gap-2 text-sm font-semibold ${arrowStyles[feature.variant]} group-hover:gap-3 transition-all`}
                                        >
                                            Learn more
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
