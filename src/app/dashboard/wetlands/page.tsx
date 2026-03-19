"use client";

import MapView from "@/components/map-view";
import { HealthTrendChart } from "@/components/chart-analytics";

export default function DashboardWetlands() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Wetland Monitoring</h1>
                <p className="text-gray-400 text-sm mt-1">Real-time satellite monitoring of wetland ecosystems</p>
            </div>

            <div className="bg-[#1E293B] rounded-2xl p-6 border border-gray-800">
                <MapView height="400px" showSidebar={true} />
            </div>

            <HealthTrendChart dark />
        </div>
    );
}
