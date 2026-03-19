"use client";

import { useEffect, useState } from "react";
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
}

const wetlands: WetlandMarker[] = [
    { id: "1", name: "Pariej Lake", lat: 22.567, lng: 72.683, type: "Lake", healthScore: 82, area: "3.2 km²", birds: 120 },
    { id: "2", name: "Kanewal Lake", lat: 22.617, lng: 72.750, type: "Lake", healthScore: 75, area: "2.8 km²", birds: 95 },
    { id: "3", name: "Dakor Wetland", lat: 22.750, lng: 73.150, type: "Wetland", healthScore: 68, area: "1.5 km²", birds: 45 },
    { id: "4", name: "Anand Village Pond 1", lat: 22.570, lng: 72.960, type: "Pond", healthScore: 55, area: "0.3 km²", birds: 18 },
    { id: "5", name: "Borsad Wetland", lat: 22.410, lng: 72.890, type: "Wetland", healthScore: 72, area: "1.1 km²", birds: 35 },
    { id: "6", name: "Petlad Lake", lat: 22.470, lng: 72.800, type: "Lake", healthScore: 61, area: "0.8 km²", birds: 28 },
];

interface MapViewProps {
    height?: string;
    showSidebar?: boolean;
}

export default function MapView({ height = "500px", showSidebar = true }: MapViewProps) {
    const [selected, setSelected] = useState<WetlandMarker | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        setMapLoaded(true);
    }, []);

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Map Container */}
            <div className={`flex-1 rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-blue-50 to-green-50 relative`} style={{ height }}>
                {/* Stylized Map Background */}
                <div className="absolute inset-0">
                    {/* Water pattern */}
                    <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="water" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M0 30 Q15 20 30 30 Q45 40 60 30" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
                                <path d="M0 45 Q15 35 30 45 Q45 55 60 45" fill="none" stroke="#3B82F6" strokeWidth="0.3" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#water)" />
                    </svg>

                    {/* Grid overlay */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                {/* Map Title */}
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-gray-100">
                    <div className="text-sm font-semibold text-dark">Anand District Wetlands</div>
                    <div className="text-xs text-gray-500">Interactive Map View</div>
                </div>

                {/* Markers */}
                {wetlands.map((w, index) => {
                    const positions = [
                        { top: '20%', left: '30%' },
                        { top: '25%', left: '55%' },
                        { top: '15%', left: '75%' },
                        { top: '50%', left: '60%' },
                        { top: '65%', left: '40%' },
                        { top: '55%', left: '25%' },
                    ];
                    const pos = positions[index] || { top: '50%', left: '50%' };

                    return (
                        <button
                            key={w.id}
                            onClick={() => setSelected(w)}
                            className={`absolute z-10 group transition-all duration-300 ${selected?.id === w.id ? 'scale-125' : 'hover:scale-110'
                                }`}
                            style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                        >
                            <div className={`relative flex items-center justify-center ${selected?.id === w.id ? 'text-primary' : 'text-red-500'
                                }`}>
                                <MapPin className="w-8 h-8 drop-shadow-lg" fill="currentColor" />
                                <div className="absolute -top-8 whitespace-nowrap bg-dark text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                    {w.name}
                                </div>
                            </div>
                            {/* Pulse ring */}
                            {selected?.id === w.id && (
                                <div className="absolute inset-0 -m-2">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 animate-ping" />
                                </div>
                            )}
                        </button>
                    );
                })}

                {/* Scale indicator */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-16 h-0.5 bg-gray-400" />
                    <span>10 km</span>
                </div>

                {/* Zoom controls */}
                <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1">
                    <button className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold">+</button>
                    <button className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold">−</button>
                </div>
            </div>

            {/* Information Panel */}
            {showSidebar && (
                <div className="w-full lg:w-80 space-y-4">
                    {selected ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-medium text-primary uppercase tracking-wider">Selected Wetland</span>
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-4">{selected.name}</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Type</span>
                                    <span className="text-sm font-semibold">{selected.type}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Area</span>
                                    <span className="text-sm font-semibold">{selected.area}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Health Score</span>
                                    <span className={`text-sm font-bold ${selected.healthScore >= 70 ? 'text-primary' : selected.healthScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                        {selected.healthScore}/100
                                    </span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-gray-500">Bird Sightings</span>
                                    <span className="text-sm font-semibold">{selected.birds}</span>
                                </div>
                            </div>
                            {/* Health Bar */}
                            <div className="mt-4">
                                <div className="text-xs text-gray-500 mb-2">Health Status</div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${selected.healthScore >= 70 ? 'bg-primary' : selected.healthScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                                            }`}
                                        style={{ width: `${selected.healthScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-center">
                            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">Click a marker on the map to view wetland details</p>
                        </div>
                    )}

                    {/* Quick List */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                        <h4 className="font-semibold text-dark text-sm mb-3">All Wetlands</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                            {wetlands.map((w) => (
                                <button
                                    key={w.id}
                                    onClick={() => setSelected(w)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${selected?.id === w.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${w.healthScore >= 70 ? 'bg-primary' : w.healthScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                                    <div>
                                        <div className="text-sm font-medium text-dark">{w.name}</div>
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
