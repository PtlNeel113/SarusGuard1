"use client";

import { motion } from "framer-motion";
import { Activity, TrendingUp, AlertCircle, CheckCircle, Droplets, Wind } from "lucide-react";
import { HealthTrendChart } from "@/components/chart-analytics";

const healthMetrics = [
    { label: "Overall Score", value: "78%", trend: "up", change: "+2.1%", icon: Activity, color: "from-purple-500 to-purple-600" },
    { label: "Water Quality", value: "82%", trend: "up", change: "+1.5%", icon: Droplets, color: "from-blue-500 to-blue-600" },
    { label: "Air Quality", value: "72%", trend: "up", change: "+3.2%", icon: Wind, color: "from-cyan-500 to-cyan-600" },
    { label: "Biodiversity Index", value: "85%", trend: "up", change: "+2.8%", icon: TrendingUp, color: "from-green-500 to-green-600" },
];

const healthAlerts = [
    { wetland: "Pariej Lake", status: "critical", message: "Water quality decline detected", action: "View Details" },
    { wetland: "Dakor Wetland", status: "warning", message: "Pollution levels rising", action: "Take Action" },
    { wetland: "Kanewal", status: "healthy", message: "All parameters normal", action: "Monitor" },
];

export default function HealthAnalytics() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Health Score Analytics</h1>
                <p className="text-gray-400 text-sm mt-1">Monitor and analyze wetland ecosystem health across all locations</p>
            </div>

            {/* Health Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {healthMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#1E293B] rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xs text-green-400 font-semibold">{metric.change}</span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                            <div className="text-xs text-gray-500">{metric.label}</div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Health Trend Chart */}
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-gray-800">
                <h2 className="text-lg font-bold text-white mb-6">Health Trend Over Time</h2>
                <HealthTrendChart dark />
            </div>

            {/* Health Alerts */}
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-gray-800">
                <h2 className="text-lg font-bold text-white mb-6">Health Status by Wetland</h2>
                <div className="space-y-4">
                    {healthAlerts.map((alert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-gray-700 hover:border-gray-600 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                {alert.status === "critical" ? (
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                ) : alert.status === "warning" ? (
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                ) : (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                                <div>
                                    <p className="font-semibold text-white">{alert.wetland}</p>
                                    <p className="text-sm text-gray-400">{alert.message}</p>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                                {alert.action}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
