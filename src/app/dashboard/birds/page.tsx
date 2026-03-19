"use client";

import { BirdPopulationChart } from "@/components/chart-analytics";
import { Bird, MapPin, Calendar, Search } from "lucide-react";
import { useState } from "react";

const sightings = [
    { id: 1, species: "Sarus Crane", location: "Pariej Lake", date: "2026-03-12", count: 3, observer: "Dr. Patel" },
    { id: 2, species: "Painted Stork", location: "Kanewal Lake", date: "2026-03-11", count: 8, observer: "Amit Shah" },
    { id: 3, species: "Sarus Crane", location: "Borsad Wetland", date: "2026-03-10", count: 2, observer: "Priya Desai" },
    { id: 4, species: "Indian Skimmer", location: "Pariej Lake", date: "2026-03-09", count: 5, observer: "Raj Kumar" },
    { id: 5, species: "Greater Flamingo", location: "Kanewal Lake", date: "2026-03-08", count: 12, observer: "Neha Joshi" },
    { id: 6, species: "Spot-billed Pelican", location: "Dakor Wetland", date: "2026-03-07", count: 4, observer: "Vikram Singh" },
    { id: 7, species: "Sarus Crane (nesting)", location: "Petlad Lake", date: "2026-03-06", count: 2, observer: "Dr. Patel" },
    { id: 8, species: "Bar-headed Goose", location: "Pariej Lake", date: "2026-03-05", count: 15, observer: "Amit Shah" },
];

export default function DashboardBirds() {
    const [search, setSearch] = useState("");
    const filtered = sightings.filter(s =>
        s.species.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Bird Sightings</h1>
                    <p className="text-gray-400 text-sm mt-1">Track and manage bird observation reports</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search species, location..."
                        className="pl-10 pr-4 py-2 bg-[#1E293B] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Sightings", value: "350+", icon: Bird },
                    { label: "Species Recorded", value: "45", icon: Bird },
                    { label: "Active Nests", value: "12", icon: MapPin },
                    { label: "This Month", value: "28", icon: Calendar },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-[#1E293B] rounded-2xl p-4 border border-gray-800">
                            <Icon className="w-5 h-5 text-primary mb-2" />
                            <div className="text-xl font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-gray-500">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            <BirdPopulationChart dark />

            {/* Table */}
            <div className="bg-[#1E293B] rounded-2xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Species</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Location</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Count</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Observer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s) => (
                                <tr key={s.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-white">{s.species}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{s.location}</td>
                                    <td className="px-6 py-4 text-sm text-primary font-bold">{s.count}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{s.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{s.observer}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
