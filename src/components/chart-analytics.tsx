"use client";

import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const healthTrendData = [
    { month: "Jan", score: 65, birds: 30, pollution: 12 },
    { month: "Feb", score: 68, birds: 35, pollution: 10 },
    { month: "Mar", score: 72, birds: 45, pollution: 8 },
    { month: "Apr", score: 70, birds: 55, pollution: 9 },
    { month: "May", score: 75, birds: 60, pollution: 7 },
    { month: "Jun", score: 78, birds: 50, pollution: 11 },
    { month: "Jul", score: 74, birds: 42, pollution: 14 },
    { month: "Aug", score: 76, birds: 38, pollution: 13 },
    { month: "Sep", score: 80, birds: 48, pollution: 9 },
    { month: "Oct", score: 82, birds: 65, pollution: 6 },
    { month: "Nov", score: 79, birds: 58, pollution: 8 },
    { month: "Dec", score: 83, birds: 52, pollution: 7 },
];

const pollutionTypeData = [
    { name: "Plastic Waste", value: 35, color: "#EF4444" },
    { name: "Chemical", value: 25, color: "#F59E0B" },
    { name: "Sewage", value: 20, color: "#8B5CF6" },
    { name: "Agricultural", value: 15, color: "#3B82F6" },
    { name: "Other", value: 5, color: "#6B7280" },
];

const birdPopulationData = [
    { month: "Jan", sarus: 15, migratory: 40, local: 65 },
    { month: "Feb", sarus: 18, migratory: 35, local: 70 },
    { month: "Mar", sarus: 25, migratory: 30, local: 75 },
    { month: "Apr", sarus: 30, migratory: 20, local: 80 },
    { month: "May", sarus: 28, migratory: 15, local: 78 },
    { month: "Jun", sarus: 22, migratory: 10, local: 72 },
    { month: "Jul", sarus: 20, migratory: 8, local: 68 },
    { month: "Aug", sarus: 18, migratory: 12, local: 65 },
    { month: "Sep", sarus: 24, migratory: 18, local: 70 },
    { month: "Oct", sarus: 32, migratory: 35, local: 82 },
    { month: "Nov", sarus: 28, migratory: 45, local: 78 },
    { month: "Dec", sarus: 20, migratory: 50, local: 72 },
];

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    dark?: boolean;
}

function ChartCard({ title, subtitle, children, dark = false }: ChartCardProps) {
    return (
        <div className={`rounded-2xl p-6 ${dark ? 'bg-dark-card text-white' : 'bg-white border border-gray-200'}`}>
            <div className="mb-6">
                <h3 className={`font-bold text-lg ${dark ? 'text-white' : 'text-dark'}`}>{title}</h3>
                {subtitle && <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

export function HealthTrendChart({ dark = false }: { dark?: boolean }) {
    return (
        <ChartCard title="Wetland Health Score Trend" subtitle="Monthly average health score" dark={dark}>
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={healthTrendData}>
                    <defs>
                        <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8AE234" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8AE234" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1F2937" : "#F3F4F6"} />
                    <XAxis dataKey="month" stroke={dark ? "#6B7280" : "#9CA3AF"} fontSize={12} />
                    <YAxis stroke={dark ? "#6B7280" : "#9CA3AF"} fontSize={12} domain={[50, 100]} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: dark ? "#1E293B" : "#fff",
                            border: "1px solid #374151",
                            borderRadius: "12px",
                            color: dark ? "#fff" : "#111",
                        }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#8AE234" fill="url(#healthGrad)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function PollutionChart({ dark = false }: { dark?: boolean }) {
    return (
        <ChartCard title="Pollution by Type" subtitle="Distribution of reported pollution" dark={dark}>
            <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={200}>
                    <PieChart>
                        <Pie
                            data={pollutionTypeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {pollutionTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                    {pollutionTypeData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {item.name} ({item.value}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </ChartCard>
    );
}

export function BirdPopulationChart({ dark = false }: { dark?: boolean }) {
    return (
        <ChartCard title="Bird Population Trends" subtitle="Monthly sightings by species type" dark={dark}>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={birdPopulationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1F2937" : "#F3F4F6"} />
                    <XAxis dataKey="month" stroke={dark ? "#6B7280" : "#9CA3AF"} fontSize={12} />
                    <YAxis stroke={dark ? "#6B7280" : "#9CA3AF"} fontSize={12} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: dark ? "#1E293B" : "#fff",
                            border: "1px solid #374151",
                            borderRadius: "12px",
                            color: dark ? "#fff" : "#111",
                        }}
                    />
                    <Bar dataKey="sarus" fill="#8AE234" radius={[4, 4, 0, 0]} name="Sarus Crane" />
                    <Bar dataKey="migratory" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Migratory" />
                    <Bar dataKey="local" fill="#6B7280" radius={[4, 4, 0, 0]} name="Local Birds" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function PollutionFrequencyChart({ dark = false }: { dark?: boolean }) {
    return (
        <ChartCard title="Pollution Frequency" subtitle="Monthly pollution reports" dark={dark}>
            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={healthTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1F2937" : "#F3F4F6"} />
                    <XAxis dataKey="month" stroke={dark ? "#6B7280" : "#9CA3AF"} fontSize={12} />
                    <YAxis stroke={dark ? "#6B7280" : "#9CA3AF"} fontSize={12} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: dark ? "#1E293B" : "#fff",
                            border: "1px solid #374151",
                            borderRadius: "12px",
                            color: dark ? "#fff" : "#111",
                        }}
                    />
                    <Line type="monotone" dataKey="pollution" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444", r: 4 }} name="Reports" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}
