"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Leaf,
    LayoutDashboard,
    Waves,
    Bird,
    AlertTriangle,
    Shield,
    Activity,
    Users,
    Settings,
    Menu,
    X,
    Bell,
    Search,
    LogOut,
} from "lucide-react";

const sidebarItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Wetland Monitoring", href: "/dashboard/wetlands", icon: Waves },
    { label: "Bird Sightings", href: "/dashboard/birds", icon: Bird },
    { label: "Pollution Reports", href: "/dashboard/pollution", icon: AlertTriangle },
    { label: "Encroachment Alerts", href: "/dashboard/encroachment", icon: Shield },
    { label: "Health Score Analytics", href: "/dashboard/health", icon: Activity },
    { label: "Community Reports", href: "/dashboard/community", icon: Users },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111827] border-r border-gray-800 flex flex-col transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-dark" />
                        </div>
                        <span className="text-lg font-bold">
                            Sarus<span className="text-primary">Guard</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-4 border-t border-gray-800">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Back to Website
                    </Link>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-16 bg-[#111827]/80 backdrop-blur-lg border-b border-gray-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search wetlands, reports..."
                                className="w-64 lg:w-80 bg-white/5 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
                            <Bell className="w-5 h-5 text-gray-400" />
                            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-dark font-bold text-sm">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
