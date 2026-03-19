"use client";

import Navbar from "@/components/navbar";
import PageBanner from "@/components/page-banner";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Calendar, MapPin, Eye, ArrowRight } from "lucide-react";

const encroachmentAlerts = [
    {
        id: 1,
        location: "Pariej Lake - North Bank",
        type: "Construction",
        detected: "2026-03-10",
        severity: "Critical",
        area: "0.15 km²",
        status: "Active",
        description: "Unauthorized construction activity detected near the north bank of Pariej Lake. Construction materials visible in satellite imagery.",
    },
    {
        id: 2,
        location: "Kanewal Lake - West Zone",
        type: "Agricultural Expansion",
        detected: "2026-03-08",
        severity: "High",
        area: "0.32 km²",
        status: "Under Investigation",
        description: "Agricultural land expansion into protected wetland buffer zone. Vegetation clearing detected over 3 months.",
    },
    {
        id: 3,
        location: "Borsad Wetland",
        type: "Land Filling",
        detected: "2026-03-05",
        severity: "Critical",
        area: "0.08 km²",
        status: "Active",
        description: "Land filling activity detected in the eastern portion of Borsad Wetland. Debris and earth work visible.",
    },
    {
        id: 4,
        location: "Petlad Lake - South",
        type: "Road Construction",
        detected: "2026-02-28",
        severity: "Medium",
        area: "0.04 km²",
        status: "Resolved",
        description: "Illegal road construction near Petlad Lake southern boundary. Action taken by local authorities.",
    },
];

export default function EncroachmentPage() {
    return (
        <main>
            <Navbar />
            <PageBanner title="Encroachment Detection" breadcrumb="Encroachment" />

            {/* Before/After Comparison */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-dark mb-4">
                            Satellite Imagery <span className="text-gradient">Comparison</span>
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            AI-powered change detection using multi-temporal satellite imagery to identify illegal land use changes.
                        </p>
                    </motion.div>

                    {/* Before/After Viewer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="rounded-2xl overflow-hidden border border-gray-200"
                        >
                            <div className="bg-dark-card p-3 flex items-center justify-between">
                                <span className="text-white text-sm font-medium">Before - Jan 2026</span>
                                <Calendar className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="h-72 bg-gradient-to-br from-green-100 via-blue-50 to-green-100 flex items-center justify-center relative">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(34,197,94,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.2) 0%, transparent 40%)',
                                }} />
                                <div className="text-center z-10">
                                    <div className="text-6xl mb-2">🛰️</div>
                                    <p className="text-sm text-gray-500 font-medium">Pariej Lake - North Bank</p>
                                    <p className="text-xs text-green-600 mt-1">✓ Intact wetland boundary</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="rounded-2xl overflow-hidden border border-red-200"
                        >
                            <div className="bg-red-600 p-3 flex items-center justify-between">
                                <span className="text-white text-sm font-medium">After - Mar 2026</span>
                                <AlertTriangle className="w-4 h-4 text-white" />
                            </div>
                            <div className="h-72 bg-gradient-to-br from-yellow-50 via-red-50 to-orange-50 flex items-center justify-center relative">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(34,197,94,0.2) 0%, transparent 50%), radial-gradient(circle at 60% 50%, rgba(239,68,68,0.2) 0%, transparent 30%)',
                                }} />
                                {/* Encroachment markers */}
                                <div className="absolute top-12 right-16 w-20 h-20 border-2 border-red-500 rounded-lg bg-red-500/10 flex items-center justify-center">
                                    <span className="text-xs font-bold text-red-600">NEW</span>
                                </div>
                                <div className="text-center z-10">
                                    <div className="text-6xl mb-2">🏗️</div>
                                    <p className="text-sm text-gray-500 font-medium">Pariej Lake - North Bank</p>
                                    <p className="text-xs text-red-600 mt-1">⚠ Construction detected</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Change Detection Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "Total Alerts", value: "47", color: "text-primary" },
                            { label: "Critical", value: "8", color: "text-red-500" },
                            { label: "Under Investigation", value: "12", color: "text-yellow-500" },
                            { label: "Resolved", value: "27", color: "text-green-500" },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-section-bg rounded-2xl p-5 text-center"
                            >
                                <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                                <div className="text-xs text-gray-500">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alerts List */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-section-bg">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-dark mb-8">Active Alerts</h2>
                    <div className="space-y-4">
                        {encroachmentAlerts.map((alert, index) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary/30 transition-all card-hover"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                                    alert.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {alert.severity}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${alert.status === 'Active' ? 'bg-red-50 text-red-600' :
                                                    alert.status === 'Under Investigation' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-green-50 text-green-600'
                                                }`}>
                                                {alert.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-dark mb-1">{alert.type}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {alert.location}</span>
                                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {alert.detected}</span>
                                            <span>Area: {alert.area}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">{alert.description}</p>
                                    </div>
                                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold text-sm hover:bg-primary/20 transition-colors shrink-0">
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
