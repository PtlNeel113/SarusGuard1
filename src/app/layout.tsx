import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SarusGuard – Smart Wetland Protection System",
  description:
    "AI-powered monitoring system for protecting wetlands and Sarus crane habitats in Anand district. Real-time satellite monitoring, pollution reporting, and biodiversity tracking.",
  keywords: [
    "wetland monitoring",
    "Sarus crane",
    "biodiversity",
    "environmental protection",
    "AI monitoring",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-[family-name:var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  );
}
