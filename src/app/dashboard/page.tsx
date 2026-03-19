"use client";

import { motion } from "framer-motion";
import {
    Waves,
    Bird,
    AlertTriangle,
    Activity,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Bell,
    FileText,
} from "lucide-react";
import { HealthTrendChart, PollutionChart, BirdPopulationChart } from "@/components/chart-analytics";
import { exportDashboardReport } from "@/lib/export-report";

const statCards = [
    { label: "Total Wetlands", value: "120", change: "+5", trend: "up", icon: Waves, color: "from-blue-500 to-blue-600" },
    { label: "Active Pollution Reports", value: "12", change: "+3", trend: "up", icon: AlertTriangle, color: "from-red-500 to-red-600" },
    { label: "Sarus Sightings", value: "350", change: "+28", trend: "up", icon: Bird, color: "from-primary to-primary-dark" },
    { label: "Avg Health Score", value: "78%", change: "+2.1%", trend: "up", icon: Activity, color: "from-purple-500 to-purple-600" },
];

const recentActivities = [
    { text: "New pollution report at Pariej Lake", time: "2 min ago", type: "alert" },
    { text: "Sarus crane pair spotted at Kanewal", time: "15 min ago", type: "sighting" },
    { text: "Encroachment alert cleared - Borsad", time: "1 hour ago", type: "resolved" },
    { text: "Health score updated for Dakor Wetland", time: "2 hours ago", type: "update" },
    { text: "New volunteer registered", time: "3 hours ago", type: "info" },
    { text: "Weekly report generated", time: "5 hours ago", type: "report" },
];

export default function DashboardOverview() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Welcome back! Here&apos;s what&apos;s happening with your wetlands.
                    </p>
                </div>
                <button
                    onClick={() => exportDashboardReport()}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-dark rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                    <FileText className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#1E293B] rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    {stat.trend === "up" ? (
                                        <ArrowUpRight className="w-3.5 h-3.5 text-green-400" />
                                    ) : (
                                        <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                                    )}
                                    <span className={stat.trend === "up" ? "text-green-400" : "text-red-400"}>
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-xs text-gray-500">{stat.label}</div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HealthTrendChart dark />
                <PollutionChart dark />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bird Population Chart */}
                <div className="lg:col-span-2">
                    <BirdPopulationChart dark />
                </div>

                {/* Recent Activity */}
                <div className="bg-[#1E293B] rounded-2xl p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white">Recent Activity</h3>
                        <Bell className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex items-start gap-3"
                            >
                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${activity.type === 'alert' ? 'bg-red-500' :
                                        activity.type === 'sighting' ? 'bg-primary' :
                                            activity.type === 'resolved' ? 'bg-green-500' :
                                                activity.type === 'update' ? 'bg-blue-500' :
                                                    activity.type === 'report' ? 'bg-purple-500' :
                                                        'bg-gray-500'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-300 truncate">{activity.text}</p>
                                    <p className="text-xs text-gray-600">{activity.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
