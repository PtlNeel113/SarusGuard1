"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, User, Bell, Lock, Eye, Database, Shield } from "lucide-react";

const settingsGroups = [
    {
        title: "Profile Settings",
        icon: User,
        items: [
            { label: "Full Name", value: "John Doe", editable: true },
            { label: "Email", value: "john@example.com", editable: false },
            { label: "Role", value: "Wetland Monitor", editable: true },
        ],
    },
    {
        title: "Notifications",
        icon: Bell,
        items: [
            { label: "Alert Notifications", value: true, toggle: true },
            { label: "Daily Reports", value: true, toggle: true },
            { label: "Community Updates", value: false, toggle: true },
            { label: "Email Alerts", value: true, toggle: true },
        ],
    },
    {
        title: "Privacy & Security",
        icon: Shield,
        items: [
            { label: "Profile Visibility", value: "Public", editable: true },
            { label: "Data Sharing", value: "Enabled", toggle: true },
            { label: "Two-Factor Auth", value: false, toggle: true },
        ],
    },
    {
        title: "Data Management",
        icon: Database,
        items: [
            { label: "Last Backup", value: "2 hours ago", editable: false },
            { label: "Storage Used", value: "2.3 GB / 10 GB", editable: false },
        ],
    },
];

export default function Settings() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 text-sm mt-1">Manage your account, preferences, and security settings</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {settingsGroups.map((group, groupIndex) => {
                    const Icon = group.icon;
                    return (
                        <motion.div
                            key={group.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: groupIndex * 0.1 }}
                            className="bg-[#1E293B] rounded-2xl p-6 border border-gray-800"
                        >
                            {/* Section Title */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-lg font-bold text-white">{group.title}</h2>
                            </div>

                            {/* Settings Items */}
                            <div className="space-y-4">
                                {group.items.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-gray-700 hover:border-gray-600 transition-all"
                                    >
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-300">{item.label}</label>
                                        </div>

                                        {item.toggle ? (
                                            <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-700 transition-colors">
                                                <span
                                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                                        item.value ? "translate-x-6" : "translate-x-1"
                                                    }`}
                                                />
                                            </button>
                                        ) : item.editable ? (
                                            <input
                                                type="text"
                                                defaultValue={item.value}
                                                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-400">{item.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Save Button */}
            <motion.button
                onClick={handleSave}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-dark rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Save className="w-4 h-4" />
                {saved ? "Changes Saved!" : "Save Changes"}
            </motion.button>

            {/* Additional Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="px-5 py-3 bg-white/5 border border-gray-700 text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Change Password
                </button>
                <button className="px-5 py-3 bg-white/5 border border-gray-700 text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                    <Eye className="w-4 h-4 inline mr-2" />
                    Activity Log
                </button>
            </div>
        </div>
    );
}
