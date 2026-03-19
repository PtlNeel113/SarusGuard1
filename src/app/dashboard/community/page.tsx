"use client";

import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Clock, MapPin, User, Filter } from "lucide-react";

const communityReports = [
    {
        id: 1,
        author: "Rajesh Kumar",
        avatar: "RK",
        location: "Pariej Lake",
        date: "2 hours ago",
        title: "Bird Migration Alert",
        description: "Spotted unusual bird migration pattern near the northern shore. More sarus cranes than usual.",
        likes: 24,
        comments: 8,
        category: "sighting",
    },
    {
        id: 2,
        author: "Priya Singh",
        avatar: "PS",
        location: "Dakor Wetland",
        date: "5 hours ago",
        title: "Water Pollution Concern",
        description: "Noticed discolored water at the east boundary. Possible industrial waste discharge.",
        likes: 45,
        comments: 12,
        category: "alert",
    },
    {
        id: 3,
        author: "Vikram Patel",
        avatar: "VP",
        location: "Kanewal",
        date: "8 hours ago",
        title: "Encroachment Activity",
        description: "Construction equipment observed near protected area boundary. Local authorities notified.",
        likes: 67,
        comments: 21,
        category: "critical",
    },
    {
        id: 4,
        author: "Anjali Sharma",
        avatar: "AS",
        location: "Borsad Region",
        date: "1 day ago",
        title: "Volunteer Cleanup Drive",
        description: "Successfully cleaned 2 km stretch. Collected 150 kg of waste. Great community participation!",
        likes: 89,
        comments: 31,
        category: "positive",
    },
];

const getCategoryColor = (category: string) => {
    switch (category) {
        case "sighting":
            return "bg-primary/10 text-primary border-primary/20";
        case "alert":
            return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
        case "critical":
            return "bg-red-500/10 text-red-400 border-red-500/20";
        case "positive":
            return "bg-green-500/10 text-green-400 border-green-500/20";
        default:
            return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
};

export default function CommunityReports() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Community Reports</h1>
                    <p className="text-gray-400 text-sm mt-1">Share and view reports from the community monitoring the wetlands</p>
                </div>
                <button className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-dark rounded-xl font-semibold text-sm">
                    + New Report
                </button>
            </div>

            {/* Filter and Sort */}
            <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-xl text-sm text-gray-300 hover:text-white hover:border-gray-700 transition-all">
                    <Filter className="w-4 h-4" />
                    All Categories
                </button>
                {["Sightings", "Alerts", "Cleanup", "Updates"].map((filter) => (
                    <button
                        key={filter}
                        className="px-4 py-2 bg-white/5 border border-gray-700 rounded-xl text-sm text-gray-300 hover:text-white hover:border-primary/50 transition-all"
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {communityReports.map((report, index) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-[#1E293B] rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
                    >
                        {/* Report Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-dark font-bold text-sm">
                                    {report.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{report.author}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {report.date}
                                    </p>
                                </div>
                            </div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${getCategoryColor(report.category)}`}>
                                {report.category}
                            </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                            <MapPin className="w-4 h-4" />
                            {report.location}
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-semibold text-white mb-2">{report.title}</h3>
                        <p className="text-gray-300 mb-4">{report.description}</p>

                        {/* Actions */}
                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{report.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span>{report.comments}</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
