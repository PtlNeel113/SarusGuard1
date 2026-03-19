"use client";

import Navbar from "@/components/navbar";
import PageBanner from "@/components/page-banner";
import Footer from "@/components/footer";
import { HealthTrendChart, PollutionChart, BirdPopulationChart, PollutionFrequencyChart } from "@/components/chart-analytics";
import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

const wetlandScores = [
    { name: "Pariej Lake", score: 82, trend: "up", water: 85, birds: 90, pollution: 72, vegetation: 80 },
    { name: "Kanewal Lake", score: 75, trend: "up", water: 78, birds: 80, pollution: 65, vegetation: 76 },
    { name: "Dakor Wetland", score: 68, trend: "down", water: 60, birds: 72, pollution: 58, vegetation: 82 },
    { name: "Borsad Wetland", score: 72, trend: "stable", water: 70, birds: 68, pollution: 75, vegetation: 74 },
    { name: "Petlad Lake", score: 61, trend: "down", water: 55, birds: 58, pollution: 62, vegetation: 68 },
    { name: "Anand Village Pond 1", score: 55, trend: "down", water: 45, birds: 50, pollution: 48, vegetation: 76 },
];

function ScoreGauge({ score }: { score: number }) {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 70 ? "#8AE234" : score >= 50 ? "#F59E0B" : "#EF4444";

    return (
        <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold" style={{ color }}>{score}</span>
            </div>
        </div>
    );
}

export default function WetlandHealthPage() {
    return (
        <main>
            <Navbar />
            <PageBanner title="Wetland Health Score" breadcrumb="Wetland Health" />

            {/* Score Cards */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-dark mb-4">
                            Individual Wetland <span className="text-gradient">Health Scores</span>
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Scores calculated using water area, bird sightings, pollution reports, and vegetation cover analysis.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wetlandScores.map((wetland, index) => (
                            <motion.div
                                key={wetland.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 card-hover"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-dark text-lg">{wetland.name}</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            {wetland.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                                            {wetland.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                                            {wetland.trend === 'stable' && <Minus className="w-4 h-4 text-yellow-500" />}
                                            <span className={`text-xs font-medium ${wetland.trend === 'up' ? 'text-green-500' : wetland.trend === 'down' ? 'text-red-500' : 'text-yellow-500'
                                                }`}>
                                                {wetland.trend === 'up' ? 'Improving' : wetland.trend === 'down' ? 'Declining' : 'Stable'}
                                            </span>
                                        </div>
                                    </div>
                                    <ScoreGauge score={wetland.score} />
                                </div>

                                {/* Sub-scores */}
                                <div className="space-y-3 mt-4">
                                    {[
                                        { label: "Water Area", value: wetland.water },
                                        { label: "Bird Population", value: wetland.birds },
                                        { label: "Pollution Level", value: wetland.pollution },
                                        { label: "Vegetation Cover", value: wetland.vegetation },
                                    ].map((metric) => (
                                        <div key={metric.label}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-500">{metric.label}</span>
                                                <span className="font-semibold text-dark">{metric.value}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${metric.value >= 70 ? 'bg-primary' : metric.value >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                                                        }`}
                                                    style={{ width: `${metric.value}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Charts Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-section-bg">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-dark mb-8">Analytics & Trends</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <HealthTrendChart />
                        <PollutionChart />
                        <BirdPopulationChart />
                        <PollutionFrequencyChart />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
