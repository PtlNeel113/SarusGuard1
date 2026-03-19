"use client";

import { motion } from "framer-motion";
import { TreePine, Bird, FileWarning, Shield, TrendingUp, Users } from "lucide-react";

const metrics = [
    {
        icon: TreePine,
        value: "120+",
        label: "Protected Wetlands",
        description: "Wetland ecosystems being actively monitored across Anand district",
        highlight: false,
    },
    {
        icon: Bird,
        value: "350+",
        label: "Bird Sightings Recorded",
        description: "Sarus crane and migratory bird sightings documented by our community",
        highlight: true,
    },
    {
        icon: FileWarning,
        value: "95+",
        label: "Pollution Reports Submitted",
        description: "Environmental violations reported and acted upon by local authorities",
        highlight: false,
    },
];

const additionalStats = [
    { icon: Shield, label: "Encroachments Detected", value: "47" },
    { icon: TrendingUp, label: "Health Score Avg", value: "78%" },
    { icon: Users, label: "Active Volunteers", value: "200+" },
];

export default function ImpactMetrics() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                        Environmental Impact
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-heading mt-4 mb-6">
                        We Make Wetland Protection{" "}
                        <span className="text-gradient">Smarter</span>, Faster,
                        <br /> And Less Expensive
                    </h2>
                    <p className="text-text-body max-w-2xl mx-auto text-lg">
                        Our AI-powered platform has made a measurable impact on wetland
                        conservation in the Anand district.
                    </p>
                </motion.div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        return (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className={`rounded-2xl p-8 text-center card-hover cursor-default ${metric.highlight
                                        ? "bg-gradient-to-br from-primary to-primary-dark text-dark shadow-xl shadow-primary/20"
                                        : "bg-white border border-gray-200 hover:border-primary/30"
                                    }`}
                            >
                                <div
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${metric.highlight
                                            ? "bg-dark/20"
                                            : "bg-primary/10"
                                        }`}
                                >
                                    <Icon
                                        className={`w-8 h-8 ${metric.highlight ? "text-dark" : "text-primary"
                                            }`}
                                    />
                                </div>
                                <div
                                    className={`text-5xl font-bold mb-2 ${metric.highlight ? "text-dark" : "text-text-heading"
                                        }`}
                                >
                                    {metric.value}
                                </div>
                                <h3
                                    className={`text-xl font-semibold mb-3 ${metric.highlight ? "text-dark" : "text-text-heading"
                                        }`}
                                >
                                    {metric.label}
                                </h3>
                                <p
                                    className={`text-sm ${metric.highlight ? "text-dark/70" : "text-text-body"
                                        }`}
                                >
                                    {metric.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {additionalStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                className="flex items-center gap-4 p-5 rounded-xl bg-section-bg"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-text-heading">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-text-body">{stat.label}</div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
