import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Dashboard data (same as in the dashboard page & chart components)
const statCards = [
    { label: "Total Wetlands", value: "120", change: "+5" },
    { label: "Active Pollution Reports", value: "12", change: "+3" },
    { label: "Sarus Sightings", value: "350", change: "+28" },
    { label: "Avg Health Score", value: "78%", change: "+2.1%" },
];

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
    { name: "Plastic Waste", value: 35 },
    { name: "Chemical", value: 25 },
    { name: "Sewage", value: 20 },
    { name: "Agricultural", value: 15 },
    { name: "Other", value: 5 },
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

const recentActivities = [
    { text: "New pollution report at Pariej Lake", time: "2 min ago", type: "alert" },
    { text: "Sarus crane pair spotted at Kanewal", time: "15 min ago", type: "sighting" },
    { text: "Encroachment alert cleared - Borsad", time: "1 hour ago", type: "resolved" },
    { text: "Health score updated for Dakor Wetland", time: "2 hours ago", type: "update" },
    { text: "New volunteer registered", time: "3 hours ago", type: "info" },
    { text: "Weekly report generated", time: "5 hours ago", type: "report" },
];

export function exportDashboardReport() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    let y = 15;

    // ── Brand Header ──
    doc.setFillColor(15, 23, 42); // dark bg
    doc.rect(0, 0, pageWidth, 42, "F");
    doc.setFillColor(138, 226, 52); // primary green accent bar
    doc.rect(0, 42, pageWidth, 3, "F");

    doc.setTextColor(138, 226, 52);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SarusGuard", margin, 22);

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Wetland & Wildlife Monitoring Platform", margin, 30);

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    doc.setTextColor(160, 160, 160);
    doc.setFontSize(9);
    doc.text(`Report Generated: ${dateStr}`, pageWidth - margin, 30, { align: "right" });

    y = 55;

    // ── Section helper ──
    const sectionTitle = (title: string) => {
        doc.setFillColor(138, 226, 52);
        doc.rect(margin, y - 4, 3, 14, "F");
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin + 7, y + 5);
        y += 16;
    };

    // ── 1. Dashboard Summary ──
    sectionTitle("Dashboard Summary");

    autoTable(doc, {
        startY: y,
        head: [["Metric", "Value", "Change"]],
        body: statCards.map((s) => [s.label, s.value, s.change]),
        theme: "grid",
        headStyles: {
            fillColor: [138, 226, 52],
            textColor: [15, 23, 42],
            fontStyle: "bold",
            fontSize: 10,
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [50, 50, 50],
        },
        alternateRowStyles: {
            fillColor: [245, 250, 240],
        },
        margin: { left: margin, right: margin },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

    // ── 2. Wetland Health Score Trend ──
    sectionTitle("Wetland Health Score Trend");

    autoTable(doc, {
        startY: y,
        head: [["Month", "Health Score", "Bird Count", "Pollution Index"]],
        body: healthTrendData.map((d) => [d.month, d.score.toString(), d.birds.toString(), d.pollution.toString()]),
        theme: "grid",
        headStyles: {
            fillColor: [138, 226, 52],
            textColor: [15, 23, 42],
            fontStyle: "bold",
            fontSize: 9,
        },
        bodyStyles: { fontSize: 8, textColor: [50, 50, 50] },
        alternateRowStyles: { fillColor: [245, 250, 240] },
        margin: { left: margin, right: margin },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

    // ── 3. Pollution Distribution ──
    sectionTitle("Pollution Distribution");

    autoTable(doc, {
        startY: y,
        head: [["Pollution Type", "Percentage (%)"]],
        body: pollutionTypeData.map((p) => [p.name, `${p.value}%`]),
        theme: "grid",
        headStyles: {
            fillColor: [138, 226, 52],
            textColor: [15, 23, 42],
            fontStyle: "bold",
            fontSize: 10,
        },
        bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
        alternateRowStyles: { fillColor: [245, 250, 240] },
        margin: { left: margin, right: margin },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

    // ── NEW PAGE for more data ──
    doc.addPage();
    y = 15;

    // ── 4. Bird Population Data ──
    sectionTitle("Bird Population Trends");

    autoTable(doc, {
        startY: y,
        head: [["Month", "Sarus Crane", "Migratory Birds", "Local Birds"]],
        body: birdPopulationData.map((b) => [b.month, b.sarus.toString(), b.migratory.toString(), b.local.toString()]),
        theme: "grid",
        headStyles: {
            fillColor: [138, 226, 52],
            textColor: [15, 23, 42],
            fontStyle: "bold",
            fontSize: 9,
        },
        bodyStyles: { fontSize: 8, textColor: [50, 50, 50] },
        alternateRowStyles: { fillColor: [245, 250, 240] },
        margin: { left: margin, right: margin },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

    // ── 5. Recent Activity ──
    sectionTitle("Recent Activity");

    autoTable(doc, {
        startY: y,
        head: [["Activity", "Time", "Type"]],
        body: recentActivities.map((a) => [a.text, a.time, a.type.charAt(0).toUpperCase() + a.type.slice(1)]),
        theme: "grid",
        headStyles: {
            fillColor: [138, 226, 52],
            textColor: [15, 23, 42],
            fontStyle: "bold",
            fontSize: 10,
        },
        bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
        alternateRowStyles: { fillColor: [245, 250, 240] },
        margin: { left: margin, right: margin },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;

    // ── Footer on last page ──
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This report was auto-generated by SarusGuard — Wetland & Wildlife Monitoring Platform.", margin, y);
    y += 5;
    doc.text(`© ${today.getFullYear()} SarusGuard. All rights reserved.`, margin, y);

    // ── Save ──
    doc.save(`SarusGuard_Report_${today.toISOString().split("T")[0]}.pdf`);
}
