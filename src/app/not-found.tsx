"use client";

import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                </div>
                
                <div>
                    <h1 className="text-4xl font-bold mb-2">404</h1>
                    <p className="text-xl font-semibold text-gray-200">Page Not Found</p>
                    <p className="text-gray-400 mt-2">The route does not exist or has been removed.</p>
                </div>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-dark rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
