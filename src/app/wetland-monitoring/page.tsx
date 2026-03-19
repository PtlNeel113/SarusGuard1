"use client";

import Navbar from "@/components/navbar";
import PageBanner from "@/components/page-banner";
import Footer from "@/components/footer";
import MapView from "@/components/map-view";
import { motion } from "framer-motion";
import { Satellite, Waves, AlertTriangle, Eye, TrendingUp, Radio } from "lucide-react";

const capabilities = [
    {
        icon: Satellite,
        title: "Satellite Data Analysis",
        description: "Multi-spectral satellite imagery processed using NDWI and NDVI indices for accurate water body mapping.",
    },
    {
        icon: Waves,
        title: "Water Body Detection",
        description: "AI algorithms detect water level changes, seasonal patterns, and identify new water bodies.",
    },
    {
        icon: AlertTriangle,
        title: "Encroachment Alerts",
        description: "Real-time alerts when unauthorized construction or land-use changes are detected near wetlands.",
    },
    {
        icon: Eye,
        title: "Change Detection",
        description: "Temporal analysis comparing satellite images over time to track wetland area changes.",
    },
    {
        icon: TrendingUp,
        title: "Predictive Analytics",
        description: "ML models predict future wetland health based on current trends and environmental factors.",
    },
    {
        icon: Radio,
        title: "IoT Sensor Integration",
        description: "Real-time water quality data from deployed IoT sensors at key wetland locations.",
    },
];

const recentAlerts = [
    { id: 1, type: "Encroachment", location: "Pariej Lake - North Bank", severity: "High", time: "2 hours ago" },
    { id: 2, type: "Water Level", location: "Kanewal Lake", severity: "Medium", time: "5 hours ago" },
    { id: 3, type: "Pollution", location: "Anand Village Pond 1", severity: "High", time: "1 day ago" },
    { id: 4, type: "Vegetation", location: "Borsad Wetland", severity: "Low", time: "2 days ago" },
];

export default function WetlandMonitoringPage() {
    return (
        <main>
            <Navbar />
            <PageBanner title="AI Wetland Monitoring" breadcrumb="Wetland Monitoring" />

            {/* Capabilities Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-dark mb-4">
                            Advanced Monitoring <span className="text-gradient">Capabilities</span>
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Our AI-powered system combines satellite imagery, IoT sensors, and machine learning to provide comprehensive wetland monitoring.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {capabilities.map((cap, index) => {
                            const Icon = cap.icon;
                            return (
                                <motion.div
                                    key={cap.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 rounded-2xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-dark mb-2">{cap.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{cap.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-section-bg">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-dark mb-8">
                        Live Wetland Map
                    </h2>
                    <MapView height="500px" />
                </div>
            </section>

            {/* Alerts Table */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-dark mb-8">Recent Alerts</h2>
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-section-bg">
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Alert Type</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Location</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Severity</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentAlerts.map((alert) => (
                                        <tr key={alert.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-dark">{alert.type}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{alert.location}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${alert.severity === 'High' ? 'bg-red-100 text-red-700' :
                                                        alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {alert.severity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{alert.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
