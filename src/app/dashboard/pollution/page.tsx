"use client";

import { PollutionChart, PollutionFrequencyChart } from "@/components/chart-analytics";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

const reports = [
    { id: 1, type: "Plastic Waste", location: "Pariej Lake", status: "Approved", severity: "High", date: "2026-03-12" },
    { id: 2, type: "Sewage Dumping", location: "Village Pond 1", status: "Pending", severity: "Critical", date: "2026-03-11" },
    { id: 3, type: "Chemical", location: "Kanewal Lake", status: "Approved", severity: "Medium", date: "2026-03-10" },
    { id: 4, type: "Plastic Waste", location: "Borsad", status: "Under Review", severity: "Low", date: "2026-03-09" },
    { id: 5, type: "Agricultural", location: "Petlad Lake", status: "Approved", severity: "Medium", date: "2026-03-08" },
    { id: 6, type: "Sewage", location: "Dakor Wetland", status: "Rejected", severity: "High", date: "2026-03-07" },
];

export default function DashboardPollution() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Pollution Reports</h1>
                <p className="text-gray-400 text-sm mt-1">Manage and review community pollution reports</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Reports", value: "95", color: "text-white" },
                    { label: "Pending", value: "12", color: "text-yellow-400" },
                    { label: "Approved", value: "78", color: "text-green-400" },
                    { label: "Critical", value: "5", color: "text-red-400" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-[#1E293B] rounded-2xl p-4 border border-gray-800">
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PollutionChart dark />
                <PollutionFrequencyChart dark />
            </div>

            {/* Reports Table */}
            <div className="bg-[#1E293B] rounded-2xl border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                    <h3 className="font-semibold text-white">Recent Reports</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Severity</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((r) => (
                                <tr key={r.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-white">{r.type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{r.location}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                                r.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                                    r.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-green-500/20 text-green-400'
                                            }`}>
                                            {r.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{r.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-sm">
                                            {r.status === 'Approved' && <CheckCircle className="w-4 h-4 text-green-400" />}
                                            {r.status === 'Pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                                            {r.status === 'Under Review' && <AlertTriangle className="w-4 h-4 text-blue-400" />}
                                            {r.status === 'Rejected' && <XCircle className="w-4 h-4 text-red-400" />}
                                            <span className="text-gray-300">{r.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {r.status === 'Pending' && (
                                                <>
                                                    <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition-colors">Approve</button>
                                                    <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-colors">Reject</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
