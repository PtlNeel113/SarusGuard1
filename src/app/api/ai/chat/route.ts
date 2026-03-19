import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Platform Data (In production, these would come from DB) ──
const platformData = {
    wetlands: [
        { id: "1", name: "Pariej Lake", type: "Lake", healthScore: 82, area: "3.2 km²", birds: 120, lat: 22.567, lng: 72.683, status: "Healthy", waterLevel: "Normal", threats: ["Minor agricultural runoff"] },
        { id: "2", name: "Kanewal Lake", type: "Lake", healthScore: 75, area: "2.8 km²", birds: 95, lat: 22.617, lng: 72.750, status: "Moderate", waterLevel: "Slightly Low", threats: ["Chemical pollution from nearby industry"] },
        { id: "3", name: "Dakor Wetland", type: "Wetland", healthScore: 68, area: "1.5 km²", birds: 45, lat: 22.750, lng: 73.150, status: "At Risk", waterLevel: "Low", threats: ["Encroachment", "Sewage discharge"] },
        { id: "4", name: "Anand Village Pond", type: "Pond", healthScore: 55, area: "0.3 km²", birds: 18, lat: 22.570, lng: 72.960, status: "Critical", waterLevel: "Very Low", threats: ["Plastic waste dumping", "Encroachment", "No water inflow"] },
        { id: "5", name: "Borsad Wetland", type: "Wetland", healthScore: 72, area: "1.1 km²", birds: 35, lat: 22.410, lng: 72.890, status: "Moderate", waterLevel: "Normal", threats: ["Agricultural runoff"] },
        { id: "6", name: "Petlad Lake", type: "Lake", healthScore: 61, area: "0.8 km²", birds: 28, lat: 22.470, lng: 72.800, status: "At Risk", waterLevel: "Low", threats: ["Sewage", "Plastic waste"] },
        { id: "7", name: "Khambhat Wetland", type: "Wetland", healthScore: 58, area: "1.8 km²", birds: 42, lat: 22.317, lng: 72.617, status: "At Risk", waterLevel: "Low", threats: ["Industrial pollution", "Salt pan encroachment"] },
        { id: "8", name: "Sarsa Lake", type: "Lake", healthScore: 77, area: "0.6 km²", birds: 55, lat: 22.650, lng: 73.050, status: "Healthy", waterLevel: "Normal", threats: ["Minor plastic waste"] },
    ],
    pollutionReports: [
        { id: "PR001", wetland: "Pariej Lake", type: "Agricultural Runoff", severity: "Low", date: "2026-03-15", status: "Under Review", description: "Pesticide traces detected in water samples" },
        { id: "PR002", wetland: "Kanewal Lake", type: "Chemical Pollution", severity: "High", date: "2026-03-12", status: "Active", description: "Industrial discharge detected, pH levels abnormal" },
        { id: "PR003", wetland: "Dakor Wetland", type: "Sewage Discharge", severity: "Medium", date: "2026-03-10", status: "Active", description: "Untreated sewage flowing from nearby settlement" },
        { id: "PR004", wetland: "Anand Village Pond", type: "Plastic Waste", severity: "High", date: "2026-03-08", status: "Critical", description: "Massive plastic waste accumulation, blocking water flow" },
        { id: "PR005", wetland: "Petlad Lake", type: "Sewage", severity: "Medium", date: "2026-03-05", status: "Under Review", description: "Seasonal sewage overflow during monsoon drainage" },
        { id: "PR006", wetland: "Khambhat Wetland", type: "Industrial Pollution", severity: "High", date: "2026-03-01", status: "Escalated", description: "Heavy metal contamination from salt processing units" },
    ],
    birdSightings: [
        { species: "Sarus Crane", count: 24, location: "Pariej Lake", date: "2026-03-18", status: "Breeding pair observed", conservation: "Vulnerable" },
        { species: "Sarus Crane", count: 12, location: "Kanewal Lake", date: "2026-03-17", status: "Feeding near paddy fields", conservation: "Vulnerable" },
        { species: "Painted Stork", count: 45, location: "Pariej Lake", date: "2026-03-16", status: "Nesting colony", conservation: "Near Threatened" },
        { species: "Indian Skimmer", count: 8, location: "Borsad Wetland", date: "2026-03-15", status: "Migrant visitors", conservation: "Endangered" },
        { species: "Greater Flamingo", count: 120, location: "Khambhat Wetland", date: "2026-03-14", status: "Winter migration flock", conservation: "Least Concern" },
        { species: "Sarus Crane", count: 6, location: "Sarsa Lake", date: "2026-03-14", status: "Pair with juvenile", conservation: "Vulnerable" },
        { species: "Black-necked Stork", count: 3, location: "Dakor Wetland", date: "2026-03-13", status: "Resident pair", conservation: "Near Threatened" },
        { species: "Bar-headed Goose", count: 85, location: "Pariej Lake", date: "2026-03-12", status: "Migrant flock", conservation: "Least Concern" },
    ],
    healthTrends: [
        { month: "Jan", avgScore: 65, totalBirds: 280, pollutionIndex: 12 },
        { month: "Feb", avgScore: 68, totalBirds: 310, pollutionIndex: 10 },
        { month: "Mar", avgScore: 72, totalBirds: 390, pollutionIndex: 8 },
        { month: "Apr", avgScore: 70, totalBirds: 420, pollutionIndex: 9 },
        { month: "May", avgScore: 75, totalBirds: 385, pollutionIndex: 7 },
        { month: "Jun", avgScore: 78, totalBirds: 350, pollutionIndex: 11 },
    ],
    stats: {
        totalWetlands: 120,
        activePollutionReports: 12,
        sarusSightings: 350,
        avgHealthScore: 78,
        totalBirdSpecies: 187,
        volunteersActive: 45,
        criticalWetlands: 2,
        atRiskWetlands: 3,
    },
};

// ── Tool definitions for function calling ──
const tools: any[] = [
    {
        type: "function",
        function: {
            name: "getWetlands",
            description: "Get the list of all monitored wetlands in Anand district with their health scores, areas, bird counts, and current status",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "getHealthScore",
            description: "Get the detailed health score and status for a specific wetland by its name",
            parameters: {
                type: "object",
                properties: {
                    wetland_name: { type: "string", description: "Name of the wetland (e.g., 'Pariej Lake', 'Kanewal Lake')" },
                },
                required: ["wetland_name"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "getPollutionReports",
            description: "Get all active pollution reports across wetlands, including severity, type, and status",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "getBirdSightings",
            description: "Get recent bird sighting records including species, counts, locations, and conservation status",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "getAtRiskWetlands",
            description: "Get wetlands that are currently at risk or in critical condition, with their threats",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "getDashboardStats",
            description: "Get overall dashboard statistics like total wetlands, pollution reports, sarus sightings, average health score",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "getHealthTrends",
            description: "Get monthly health score trends, bird population trends, and pollution index over time",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
];

// ── Tool execution ──
function executeTool(name: string, args: Record<string, string>): string {
    switch (name) {
        case "getWetlands":
            return JSON.stringify(platformData.wetlands);
        case "getHealthScore": {
            const wetland = platformData.wetlands.find(
                (w) => w.name.toLowerCase() === args.wetland_name?.toLowerCase()
            );
            return wetland
                ? JSON.stringify(wetland)
                : JSON.stringify({ error: `Wetland "${args.wetland_name}" not found. Available: ${platformData.wetlands.map((w) => w.name).join(", ")}` });
        }
        case "getPollutionReports":
            return JSON.stringify(platformData.pollutionReports);
        case "getBirdSightings":
            return JSON.stringify(platformData.birdSightings);
        case "getAtRiskWetlands":
            return JSON.stringify(
                platformData.wetlands.filter((w) => w.healthScore < 70)
            );
        case "getDashboardStats":
            return JSON.stringify(platformData.stats);
        case "getHealthTrends":
            return JSON.stringify(platformData.healthTrends);
        default:
            return JSON.stringify({ error: "Unknown tool" });
    }
}

// ── In-memory chat history (per user) ──
const chatHistory = new Map<string, any[]>();
const MAX_HISTORY = 20; // Keep last 20 messages per user

const SYSTEM_PROMPT = `You are SarusGuard AI Assistant, an expert in wetlands, biodiversity, and environmental monitoring for the Anand District in Gujarat, India.

You help users understand:
- Wetland health scores and status across the Anand district
- Sarus crane conservation efforts and population tracking
- Pollution reports, their severity, and remediation status
- Satellite monitoring data and environmental trends
- Dashboard analytics and insights

IMPORTANT RULES:
1. Always use the available tools to fetch real data before answering questions about wetlands, birds, pollution, or stats. Do NOT guess or make up numbers.
2. Give accurate, concise, and helpful answers based on actual platform data.
3. Format responses with bullet points, short paragraphs, and structured information.
4. If asked about something outside your domain, politely redirect to wetland/environment topics.
5. When presenting data, highlight critical issues and actionable insights.
6. Use emojis sparingly to make responses friendly but professional.
7. If a wetland is at risk (health score < 70), flag it clearly.
8. Keep responses concise — avoid long text blocks.
9. When the user greets you, respond warmly and suggest what they can ask about.
10. Always mention specific data points and numbers when available.

You are embedded in the SarusGuard dashboard — users are typically environmental officers, researchers, or volunteers.`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, user_id = "default_user" } = body;

        // ── Input validation ──
        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required and must be a string" },
                { status: 400 }
            );
        }

        if (message.length > 1000) {
            return NextResponse.json(
                { error: "Message too long. Please keep it under 1000 characters." },
                { status: 400 }
            );
        }

        // ── Get or initialize chat history ──
        if (!chatHistory.has(user_id)) {
            chatHistory.set(user_id, []);
        }
        const history = chatHistory.get(user_id)!;

        // Add user message to history
        history.push({ role: "user", content: message });

        // Trim history if too long
        if (history.length > MAX_HISTORY) {
            history.splice(0, history.length - MAX_HISTORY);
        }

        // ── Build messages array ──
        const messages: any[] = [
            { role: "system", content: SYSTEM_PROMPT },
            ...history,
        ];

        // ── Check for OpenAI API key ──
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            // Fallback: intelligent mock responses based on tool calls
            const reply = generateFallbackResponse(message);
            history.push({ role: "assistant", content: reply });
            return NextResponse.json({ reply });
        }

        // ── Call OpenAI ──
        const openai = new OpenAI({ apiKey });

        let response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            tools,
            tool_choice: "auto",
            max_tokens: 800,
            temperature: 0.7,
        });

        let assistantMessage: any = response.choices[0].message;

        // ── Handle tool calls (loop until no more tool calls) ──
        let iterations = 0;
        while (assistantMessage.tool_calls && iterations < 5) {
            iterations++;

            // Add assistant message with tool calls
            messages.push(assistantMessage);

            // Execute each tool call
            for (const toolCall of assistantMessage.tool_calls) {
                const args = JSON.parse(toolCall.function.arguments || "{}");
                const result = executeTool(toolCall.function.name, args);

                messages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: result,
                });
            }

            // Get next response
            response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages,
                tools,
                tool_choice: "auto",
                max_tokens: 800,
                temperature: 0.7,
            });

            assistantMessage = response.choices[0].message;
        }

        const reply = assistantMessage.content || "I apologize, I couldn't generate a response. Please try again.";

        // Save to history
        history.push({ role: "assistant", content: reply });

        return NextResponse.json({ reply });
    } catch (error: unknown) {
        console.error("AI Chat Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (errorMessage.includes("API key")) {
            return NextResponse.json(
                { reply: generateFallbackResponse("") },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: "Unable to process your request. Please try again." },
            { status: 500 }
        );
    }
}

// ── Intelligent fallback when no API key ──
function generateFallbackResponse(message: string): string {
    const msg = message.toLowerCase();

    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg === "") {
        return `👋 Hello! I'm the **SarusGuard AI Assistant**.\n\nI can help you with:\n- 🌊 **Wetland health status** across Anand district\n- 🐦 **Bird sighting data** including Sarus crane tracking\n- ⚠️ **Pollution reports** and threat assessments\n- 📊 **Dashboard analytics** and trends\n\nWhat would you like to know?`;
    }

    if (msg.includes("wetland") && (msg.includes("health") || msg.includes("status") || msg.includes("score"))) {
        const wetlands = platformData.wetlands;
        const critical = wetlands.filter((w) => w.healthScore < 60);
        const atRisk = wetlands.filter((w) => w.healthScore >= 60 && w.healthScore < 70);
        const healthy = wetlands.filter((w) => w.healthScore >= 70);

        return `## 🌊 Wetland Health Status\n\n**Overall Avg Score: 68.5/100**\n\n✅ **Healthy (${healthy.length}):**\n${healthy.map((w) => `- ${w.name}: **${w.healthScore}/100** (${w.status})`).join("\n")}\n\n⚠️ **At Risk (${atRisk.length}):**\n${atRisk.map((w) => `- ${w.name}: **${w.healthScore}/100** — ${w.threats.join(", ")}`).join("\n")}\n\n🔴 **Critical (${critical.length}):**\n${critical.map((w) => `- ${w.name}: **${w.healthScore}/100** — ${w.threats.join(", ")}`).join("\n")}\n\n> Immediate attention needed for **${critical.map((w) => w.name).join(", ")}**.`;
    }

    if (msg.includes("pollution") || msg.includes("report")) {
        const reports = platformData.pollutionReports;
        const high = reports.filter((r) => r.severity === "High");
        return `## ⚠️ Active Pollution Reports\n\nTotal reports: **${reports.length}**\nHigh severity: **${high.length}**\n\n${reports.map((r) => `- **${r.wetland}** — ${r.type} (${r.severity})\n  Status: ${r.status} | ${r.description}`).join("\n\n")}\n\n> 🔴 Priority: ${high.map((r) => r.wetland).join(", ")} need immediate attention.`;
    }

    if (msg.includes("bird") || msg.includes("sarus") || msg.includes("sighting")) {
        const sightings = platformData.birdSightings;
        const sarusCount = sightings.filter((s) => s.species === "Sarus Crane").reduce((sum, s) => sum + s.count, 0);
        return `## 🐦 Recent Bird Sightings\n\n**Sarus Crane Total: ${sarusCount} individuals** spotted recently\n\n${sightings.map((s) => `- **${s.species}** (${s.count}) at ${s.location}\n  ${s.status} | Conservation: ${s.conservation}`).join("\n\n")}\n\n> The Sarus Crane is classified as **Vulnerable**. Active monitoring continues at Pariej Lake and Kanewal Lake.`;
    }

    if (msg.includes("risk") || msg.includes("danger") || msg.includes("critical") || msg.includes("threat")) {
        const atRisk = platformData.wetlands.filter((w) => w.healthScore < 70);
        return `## 🚨 Wetlands at Risk\n\n${atRisk.map((w) => `### ${w.name} — Score: ${w.healthScore}/100\n- Status: **${w.status}**\n- Water Level: ${w.waterLevel}\n- Threats: ${w.threats.join(", ")}\n- Bird count: ${w.birds} species`).join("\n\n")}\n\n> **${atRisk.length} out of ${platformData.wetlands.length}** monitored wetlands need attention.`;
    }

    if (msg.includes("stats") || msg.includes("dashboard") || msg.includes("overview") || msg.includes("summary")) {
        const stats = platformData.stats;
        return `## 📊 Dashboard Summary\n\n- 🌊 Total Wetlands Monitored: **${stats.totalWetlands}**\n- ⚠️ Active Pollution Reports: **${stats.activePollutionReports}**\n- 🐦 Sarus Crane Sightings: **${stats.sarusSightings}**\n- 💚 Avg Health Score: **${stats.avgHealthScore}%**\n- 🦅 Bird Species Tracked: **${stats.totalBirdSpecies}**\n- 👥 Active Volunteers: **${stats.volunteersActive}**\n- 🔴 Critical Wetlands: **${stats.criticalWetlands}**\n- ⚠️ At-Risk Wetlands: **${stats.atRiskWetlands}**`;
    }

    if (msg.includes("trend") || msg.includes("analytics") || msg.includes("chart")) {
        return `## 📈 Health Trends (Last 6 Months)\n\n${platformData.healthTrends.map((t) => `- **${t.month}**: Health ${t.avgScore}/100 | Birds: ${t.totalBirds} | Pollution Index: ${t.pollutionIndex}`).join("\n")}\n\n> 📈 Health scores have improved **+13 points** from Jan to Jun.\n> 🐦 Bird populations peaked in **April** (420 sightings).\n> ⚠️ Pollution index spiked in **June** (monsoon effect).`;
    }

    return `I can help you with information about:\n\n- 🌊 **Wetland health** — "Show wetland health status"\n- 🐦 **Bird sightings** — "Recent Sarus crane sightings"\n- ⚠️ **Pollution reports** — "Show pollution reports"\n- 🚨 **Risk assessment** — "Which wetlands are at risk?"\n- 📊 **Dashboard stats** — "Show dashboard overview"\n- 📈 **Trends** — "Show health trends"\n\nPlease ask me about any of these topics!`;
}
