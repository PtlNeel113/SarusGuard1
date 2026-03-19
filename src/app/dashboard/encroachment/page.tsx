"use client";

import { motion } from "framer-motion";
import { Shield, AlertTriangle, Calendar, MapPin, Eye } from "lucide-react";

const encroachmentAlerts = [
    {
        id: 1,
        location: "Pariej Lake - North Bank",
        type: "Construction",
        detected: "2026-03-10",
        severity: "Critical",
        area: "0.15 km²",
        status: "Active",
        description: "Unauthorized construction activity detected near the north bank of Pariej Lake.",
    },
    {
        id: 2,
        location: "Kanewal Lake - West Zone",
        type: "Agricultural Expansion",
        detected: "2026-03-08",
        severity: "High",
        area: "0.32 km²",
        status: "Under Investigation",
        description: "Agricultural land expansion into protected wetland buffer zone.",
    },
    {
        id: 3,
        location: "Borsad Wetland",
        type: "Land Filling",
        detected: "2026-03-05",
        severity: "Critical",
        area: "0.08 km²",
        status: "Active",
        description: "Land filling activity detected in the eastern portion of Borsad Wetland.",
    },
    {
        id: 4,
        location: "Petlad Lake - South",
        type: "Road Construction",
        detected: "2026-02-28",
        severity: "Medium",
        area: "0.04 km²",
        status: "Resolved",
        description: "Illegal road construction near Petlad Lake southern boundary.",
    },
];

export default function EncroachmentPage() {
    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-primary" />
                    <h1 className="text-3xl font-bold text-white">Encroachment Alerts</h1>
                </div>
                <p className="text-gray-400">Track illegal land use and wetland encroachment in real-time.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Alerts", value: "47", color: "from-primary to-primary-dark" },
                    { label: "Critical", value: "8", color: "from-red-500 to-red-600" },
                    { label: "Under Investigation", value: "12", color: "from-yellow-500 to-orange-500" },
                    { label: "Resolved", value: "27", color: "from-green-500 to-emerald-600" },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}
                    >
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm opacity-90">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">Active Alerts</h2>
                {encroachmentAlerts.map((alert, index) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/30 hover:bg-white/10 transition-all"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        alert.severity === 'Critical' ? 'bg-red-500/20 text-red-300' :
                                        alert.severity === 'High' ? 'bg-orange-500/20 text-orange-300' :
                                        alert.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                        'bg-green-500/20 text-green-300'
                                    }`}>
                                        {alert.severity}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        alert.status === 'Active' ? 'bg-red-500/20 text-red-300' :
                                        alert.status === 'Under Investigation' ? 'bg-blue-500/20 text-blue-300' :
                                        'bg-green-500/20 text-green-300'
                                    }`}>
                                        {alert.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{alert.type}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {alert.location}</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {alert.detected}</span>
                                    <span>Area: {alert.area}</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">{alert.description}</p>
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary/20 text-primary rounded-xl font-semibold text-sm hover:bg-primary/30 transition-colors shrink-0 whitespace-nowrap">
                                <Eye className="w-4 h-4" />
                                View Details
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </>
    );
}
