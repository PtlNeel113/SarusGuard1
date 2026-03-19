"use client";

import Navbar from "@/components/navbar";
import PageBanner from "@/components/page-banner";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { Camera, MapPin, Upload, CheckCircle, Clock, XCircle, AlertTriangle, Filter } from "lucide-react";
import { useState } from "react";

const pollutionTypes = [
    { label: "Plastic Waste", color: "bg-red-500", count: 35 },
    { label: "Chemical Pollution", color: "bg-yellow-500", count: 18 },
    { label: "Sewage Dumping", color: "bg-purple-500", count: 22 },
    { label: "Agricultural Runoff", color: "bg-blue-500", count: 15 },
    { label: "Industrial Waste", color: "bg-orange-500", count: 5 },
];

const reports = [
    { id: 1, type: "Plastic Waste", location: "Pariej Lake - East Bank", date: "2026-03-12", status: "Approved", reporter: "Amit Shah", severity: "High" },
    { id: 2, type: "Sewage Dumping", location: "Anand Village Pond 1", date: "2026-03-11", status: "Pending", reporter: "Priya Desai", severity: "Critical" },
    { id: 3, type: "Chemical Pollution", location: "Kanewal Lake", date: "2026-03-10", status: "Approved", reporter: "Raj Kumar", severity: "Medium" },
    { id: 4, type: "Plastic Waste", location: "Borsad Wetland", date: "2026-03-09", status: "Under Review", reporter: "Neha Joshi", severity: "Low" },
    { id: 5, type: "Agricultural Runoff", location: "Petlad Lake", date: "2026-03-08", status: "Approved", reporter: "Dr. Patel", severity: "Medium" },
    { id: 6, type: "Sewage Dumping", location: "Dakor Wetland", date: "2026-03-07", status: "Rejected", reporter: "Vikram Singh", severity: "High" },
];

export default function PollutionReportPage() {
    const [uploadDrag, setUploadDrag] = useState(false);

    return (
        <main>
            <Navbar />
            <PageBanner title="Pollution Reporting" breadcrumb="Pollution Report" />

            {/* Report Form Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Upload Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-bold text-dark mb-2">Submit a Report</h2>
                            <p className="text-gray-500 mb-8">Help protect wetlands by reporting pollution incidents</p>

                            <div className="space-y-5">
                                {/* Photo Upload */}
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setUploadDrag(true); }}
                                    onDragLeave={() => setUploadDrag(false)}
                                    onDrop={() => setUploadDrag(false)}
                                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${uploadDrag ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                                        }`}
                                >
                                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                    <p className="text-sm text-gray-600 font-medium">Drag & drop photos here</p>
                                    <p className="text-xs text-gray-400 mt-1">or click to browse (JPG, PNG up to 10MB)</p>
                                </div>

                                {/* Pollution Type */}
                                <div>
                                    <label className="block text-sm font-medium text-dark mb-2">Pollution Type</label>
                                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white">
                                        <option>Select type...</option>
                                        <option>Plastic Waste</option>
                                        <option>Chemical Pollution</option>
                                        <option>Sewage Dumping</option>
                                        <option>Agricultural Runoff</option>
                                        <option>Industrial Waste</option>
                                    </select>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-dark mb-2">Location</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="Auto-detected via GPS"
                                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                                        />
                                        <button className="px-4 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-dark mb-2">Description</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Describe the pollution incident..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>

                                <button className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark text-dark rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                                    Submit Report
                                </button>
                            </div>
                        </motion.div>

                        {/* Pollution Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-bold text-dark mb-2">Pollution Overview</h2>
                            <p className="text-gray-500 mb-8">Current pollution statistics across monitored wetlands</p>

                            <div className="space-y-4 mb-8">
                                {pollutionTypes.map((type) => (
                                    <div key={type.label} className="bg-section-bg rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-dark">{type.label}</span>
                                            <span className="text-sm font-bold text-dark">{type.count}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${type.color}`}
                                                style={{ width: `${(type.count / 35) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-dark-card rounded-2xl p-5 text-center">
                                    <div className="text-3xl font-bold text-primary mb-1">95</div>
                                    <div className="text-xs text-gray-400">Total Reports</div>
                                </div>
                                <div className="bg-dark-card rounded-2xl p-5 text-center">
                                    <div className="text-3xl font-bold text-yellow-400 mb-1">12</div>
                                    <div className="text-xs text-gray-400">Pending Review</div>
                                </div>
                                <div className="bg-dark-card rounded-2xl p-5 text-center">
                                    <div className="text-3xl font-bold text-green-400 mb-1">78</div>
                                    <div className="text-xs text-gray-400">Resolved</div>
                                </div>
                                <div className="bg-dark-card rounded-2xl p-5 text-center">
                                    <div className="text-3xl font-bold text-red-400 mb-1">5</div>
                                    <div className="text-xs text-gray-400">Critical</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Community Reports Table */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-section-bg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-dark">Community Reports</h2>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-primary hover:text-primary transition-all bg-white">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-section-bg">
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Location</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Reporter</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Severity</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-dark">{report.type}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{report.location}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{report.reporter}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{report.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${report.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                                        report.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                                                            report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-green-100 text-green-700'
                                                    }`}>
                                                    {report.severity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="flex items-center gap-1.5 text-sm">
                                                    {report.status === 'Approved' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                                    {report.status === 'Pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                                                    {report.status === 'Under Review' && <AlertTriangle className="w-4 h-4 text-blue-500" />}
                                                    {report.status === 'Rejected' && <XCircle className="w-4 h-4 text-red-500" />}
                                                    <span className="text-gray-600">{report.status}</span>
                                                </span>
                                            </td>
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
