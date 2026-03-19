"use client";

import Navbar from "@/components/navbar";
import PageBanner from "@/components/page-banner";
import Footer from "@/components/footer";
import MapView from "@/components/map-view";
import { motion } from "framer-motion";
import { Bird, Camera, MapPin, Filter, Search, Upload } from "lucide-react";
import { useState } from "react";

const birdSightings = [
    { id: 1, species: "Sarus Crane", location: "Pariej Lake", date: "2026-03-12", user: "Dr. Patel", image: "🦩", status: "Verified" },
    { id: 2, species: "Painted Stork", location: "Kanewal Lake", date: "2026-03-11", user: "Amit Shah", image: "🦢", status: "Verified" },
    { id: 3, species: "Sarus Crane", location: "Borsad Wetland", date: "2026-03-10", user: "Priya Desai", image: "🦩", status: "Pending" },
    { id: 4, species: "Indian Skimmer", location: "Pariej Lake", date: "2026-03-09", user: "Raj Kumar", image: "🐦", status: "Verified" },
    { id: 5, species: "Sarus Crane (pair)", location: "Dakor Wetland", date: "2026-03-08", user: "Neha Joshi", image: "🦩", status: "Verified" },
    { id: 6, species: "Spot-billed Pelican", location: "Kanewal Lake", date: "2026-03-07", user: "Vikram Singh", image: "🦆", status: "Pending" },
    { id: 7, species: "Sarus Crane (nesting)", location: "Petlad Lake", date: "2026-03-06", user: "Dr. Patel", image: "🦩", status: "Verified" },
    { id: 8, species: "Greater Flamingo", location: "Pariej Lake", date: "2026-03-05", user: "Amit Shah", image: "🦩", status: "Verified" },
];

const migrationZones = [
    { zone: "Pariej Lake Complex", status: "Active nesting", count: 45 },
    { zone: "Kanewal Reservoir", status: "Migratory halt", count: 32 },
    { zone: "Borsad Wetlands", status: "Feeding grounds", count: 18 },
    { zone: "Dakor Zone", status: "Active nesting", count: 12 },
];

export default function SarusMapPage() {
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSightings = birdSightings.filter((s) => {
        const matchesFilter = filter === "all" || s.species.toLowerCase().includes(filter.toLowerCase());
        const matchesSearch = searchQuery === "" ||
            s.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <main>
            <Navbar />
            <PageBanner title="Sarus Habitat Mapping" breadcrumb="Sarus Map" />

            {/* Map Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-dark">Interactive Habitat Map</h2>
                            <p className="text-gray-500 text-sm mt-1">Bird sightings, nest locations, and migration zones</p>
                        </div>
                        <button className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-dark rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                            <Upload className="w-4 h-4" />
                            Upload Photo
                        </button>
                    </div>
                    <MapView height="450px" />
                </div>
            </section>

            {/* Migration Zones */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-section-bg">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-dark mb-6">Migration Zones</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {migrationZones.map((zone, i) => (
                            <motion.div
                                key={zone.zone}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-primary/30 transition-all card-hover"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-medium text-primary uppercase tracking-wider">{zone.status}</span>
                                </div>
                                <h3 className="font-bold text-dark mb-1">{zone.zone}</h3>
                                <p className="text-2xl font-bold text-primary">{zone.count} <span className="text-sm font-normal text-gray-500">sightings</span></p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bird Sightings Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-dark">Recent Sightings</h2>
                        <div className="flex gap-3 flex-wrap">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search sightings..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white"
                            >
                                <option value="all">All Species</option>
                                <option value="sarus">Sarus Crane</option>
                                <option value="stork">Painted Stork</option>
                                <option value="flamingo">Flamingo</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredSightings.map((sighting, index) => (
                            <motion.div
                                key={sighting.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden card-hover group"
                            >
                                {/* Image placeholder */}
                                <div className="h-40 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center text-6xl">
                                    {sighting.image}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sighting.status === 'Verified' ? 'bg-primary/10 text-primary-dark' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {sighting.status}
                                        </span>
                                        <Camera className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <h3 className="font-bold text-dark text-sm mb-1">{sighting.species}</h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                        <MapPin className="w-3 h-3" />
                                        {sighting.location}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span>{sighting.date}</span>
                                        <span>by {sighting.user}</span>
                                    </div>
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
