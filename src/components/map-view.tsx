"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

interface WetlandMarker {
    id: string;
    name: string;
    lat: number;
    lng: number;
    type: string;
    healthScore: number;
    area: string;
    birds: number;
    // Position on the map image (percentage)
    mapX: number;
    mapY: number;
}

// Wetland locations in Anand district with positions calibrated to the actual map image
// Map layout: Khambhat (left), Petlad (center), Anand (upper-center), Borsad (right-center), Dakor (top-right)
const wetlands: WetlandMarker[] = [
    {
        id: "1", name: "Pariej Lake", lat: 22.567, lng: 72.683,
        type: "Lake", healthScore: 82, area: "3.2 km²", birds: 120,
        mapX: 40, mapY: 72  // Below Khambhat, near Kanewal area
    },
    {
        id: "2", name: "Kanewal Lake", lat: 22.617, lng: 72.750,
        type: "Lake", healthScore: 75, area: "2.8 km²", birds: 95,
        mapX: 48, mapY: 68  // Near Kanewal label on map
    },
    {
        id: "3", name: "Dakor Wetland", lat: 22.750, lng: 73.150,
        type: "Wetland", healthScore: 68, area: "1.5 km²", birds: 45,
        mapX: 72, mapY: 18  // Top-right area near Dakor
    },
    {
        id: "4", name: "Anand Village Pond", lat: 22.570, lng: 72.960,
        type: "Pond", healthScore: 55, area: "0.3 km²", birds: 18,
        mapX: 52, mapY: 38  // Near Anand town center
    },
    {
        id: "5", name: "Borsad Wetland", lat: 22.410, lng: 72.890,
        type: "Wetland", healthScore: 72, area: "1.1 km²", birds: 35,
        mapX: 62, mapY: 62  // Borsad area (right-center-lower)
    },
    {
        id: "6", name: "Petlad Lake", lat: 22.470, lng: 72.800,
        type: "Lake", healthScore: 61, area: "0.8 km²", birds: 28,
        mapX: 50, mapY: 48  // Center - Petlad area
    },
    {
        id: "7", name: "Khambhat Wetland", lat: 22.317, lng: 72.617,
        type: "Wetland", healthScore: 58, area: "1.8 km²", birds: 42,
        mapX: 35, mapY: 55  // Khambhat town area (left-center)
    },
    {
        id: "8", name: "Sarsa Lake", lat: 22.650, lng: 73.050,
        type: "Lake", healthScore: 77, area: "0.6 km²", birds: 55,
        mapX: 65, mapY: 30  // Near Sarsa in Anand taluka (right of center)
    },
];

interface MapViewProps {
    height?: string;
    showSidebar?: boolean;
}

export default function MapView({ height = "500px", showSidebar = true }: MapViewProps) {
    const [selected, setSelected] = useState<WetlandMarker | null>(null);

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Map Container */}
            <div
                className="flex-1 rounded-2xl overflow-hidden border border-gray-700 relative bg-[#0F172A]"
                style={{ height }}
            >
                {/* Anand District Map Image - fills entire container */}
                <div className="absolute inset-0">
                    <img
                        src="/anand-map.png"
                        alt="Anand District Map"
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                </div>

                {/* Dark overlay for better marker visibility */}
                <div className="absolute inset-0 bg-[#0F172A]/15 pointer-events-none" />

                {/* Map Title */}
                <div className="absolute top-4 left-4 z-20 bg-[#0F172A]/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-gray-700">
                    <div className="text-sm font-semibold text-white">Anand District Wetlands</div>
                    <div className="text-xs text-gray-400">Interactive Map View</div>
                </div>

                {/* Red Markers on actual positions */}
                {wetlands.map((w) => (
                    <button
                        key={w.id}
                        onClick={() => setSelected(w)}
                        className={`absolute z-10 group transition-all duration-300 ${selected?.id === w.id ? 'scale-125 z-30' : 'hover:scale-110'
                            }`}
                        style={{
                            top: `${w.mapY}%`,
                            left: `${w.mapX}%`,
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        {/* Marker pin */}
                        <div className={`relative flex flex-col items-center ${selected?.id === w.id ? 'text-[#8AE234]' : 'text-red-500'
                            }`}>
                            <MapPin
                                className="w-8 h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                                fill="currentColor"
                                strokeWidth={1.5}
                                stroke={selected?.id === w.id ? '#0F172A' : '#7F1D1D'}
                            />

                            {/* Tooltip label */}
                            <div className="absolute -top-9 whitespace-nowrap bg-[#0F172A]/95 text-white text-[10px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-gray-700 font-medium pointer-events-none">
                                {w.name}
                                <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-[#0F172A] rotate-45 border-r border-b border-gray-700" />
                            </div>
                        </div>

                        {/* Pulse ring for selected */}
                        {selected?.id === w.id && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                                <div className="w-6 h-6 rounded-full bg-[#8AE234]/30 animate-ping" />
                            </div>
                        )}

                        {/* Always visible shadow dot */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-black/20 rounded-full blur-[1px]" />
                    </button>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 z-20 bg-[#0F172A]/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700">
                    <div className="flex items-center gap-4 text-[10px] text-gray-300">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-500" fill="currentColor" />
                            <span>Wetland Location</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#8AE234]" fill="currentColor" />
                            <span>Selected</span>
                        </div>
                    </div>
                </div>

                {/* Zoom controls */}
                <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1">
                    <button className="w-8 h-8 bg-[#1E293B] rounded-lg shadow-md flex items-center justify-center text-gray-300 hover:bg-[#334155] text-lg font-bold border border-gray-700 transition-colors">+</button>
                    <button className="w-8 h-8 bg-[#1E293B] rounded-lg shadow-md flex items-center justify-center text-gray-300 hover:bg-[#334155] text-lg font-bold border border-gray-700 transition-colors">−</button>
                </div>
            </div>

            {/* Information Panel */}
            {showSidebar && (
                <div className="w-full lg:w-80 space-y-4">
                    {selected ? (
                        <div className="bg-[#1E293B] rounded-2xl border border-gray-700 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-[#8AE234] animate-pulse" />
                                <span className="text-xs font-medium text-[#8AE234] uppercase tracking-wider">Selected Wetland</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{selected.name}</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-700">
                                    <span className="text-sm text-gray-400">Type</span>
                                    <span className="text-sm font-semibold text-white">{selected.type}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-700">
                                    <span className="text-sm text-gray-400">Area</span>
                                    <span className="text-sm font-semibold text-white">{selected.area}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-700">
                                    <span className="text-sm text-gray-400">Health Score</span>
                                    <span className={`text-sm font-bold ${selected.healthScore >= 70 ? 'text-[#8AE234]' : selected.healthScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                        {selected.healthScore}/100
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-700">
                                    <span className="text-sm text-gray-400">Coordinates</span>
                                    <span className="text-sm font-semibold text-gray-300">{selected.lat}°N, {selected.lng}°E</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-gray-400">Bird Sightings</span>
                                    <span className="text-sm font-semibold text-white">{selected.birds}</span>
                                </div>
                            </div>
                            {/* Health Bar */}
                            <div className="mt-4">
                                <div className="text-xs text-gray-500 mb-2">Health Status</div>
                                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${selected.healthScore >= 70 ? 'bg-[#8AE234]' : selected.healthScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                                            }`}
                                        style={{ width: `${selected.healthScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#1E293B] rounded-2xl border border-gray-700 p-6 shadow-sm text-center">
                            <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">Click a marker on the map to view wetland details</p>
                        </div>
                    )}

                    {/* Quick List */}
                    <div className="bg-[#1E293B] rounded-2xl border border-gray-700 p-4 shadow-sm">
                        <h4 className="font-semibold text-white text-sm mb-3">All Wetlands</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                            {wetlands.map((w) => (
                                <button
                                    key={w.id}
                                    onClick={() => setSelected(w)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${selected?.id === w.id ? 'bg-[#8AE234]/10 border border-[#8AE234]/20' : 'hover:bg-[#334155]'
                                        }`}
                                >
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${w.healthScore >= 70 ? 'bg-[#8AE234]' : w.healthScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                                    <div>
                                        <div className="text-sm font-medium text-white">{w.name}</div>
                                        <div className="text-xs text-gray-500">{w.type} · Score: {w.healthScore}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
