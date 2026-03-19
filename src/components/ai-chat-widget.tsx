"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Sparkles,
    Loader2,
    ChevronDown,
    Leaf,
} from "lucide-react";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const suggestedQuestions = [
    "Show wetland health status",
    "Recent pollution reports",
    "Sarus crane sightings",
    "Which wetlands are at risk?",
];

// Simple markdown to HTML (handles bold, headers, bullets, blockquotes)
function renderMarkdown(text: string): string {
    return text
        // Headers
        .replace(/^### (.+)$/gm, '<h4 class="font-semibold text-white mt-3 mb-1 text-sm">$1</h4>')
        .replace(/^## (.+)$/gm, '<h3 class="font-bold text-white mt-3 mb-2 text-sm">$1</h3>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        // Blockquotes
        .replace(/^> (.+)$/gm, '<div class="border-l-2 border-primary/50 pl-3 py-1 my-2 text-xs text-gray-300 bg-primary/5 rounded-r-lg">$1</div>')
        // Bullet points
        .replace(/^- (.+)$/gm, '<div class="flex gap-2 py-0.5"><span class="text-primary mt-0.5 shrink-0">•</span><span>$1</span></div>')
        // Newlines to br
        .replace(/\n/g, "<br/>");
}

export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPulse, setShowPulse] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Show welcome message on first open
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: "welcome",
                    role: "assistant",
                    content:
                        "👋 Hello! I'm the **SarusGuard AI Assistant**.\n\nI can help you with:\n- 🌊 **Wetland health status** across Anand district\n- 🐦 **Bird sighting data** including Sarus crane tracking\n- ⚠️ **Pollution reports** and threat assessments\n- 📊 **Dashboard analytics** and trends\n\nWhat would you like to know?",
                    timestamp: new Date(),
                },
            ]);
        }
    }, [isOpen, messages.length]);

    const sendMessage = async (text?: string) => {
        const msgText = text || input.trim();
        if (!msgText || isLoading) return;

        setShowPulse(false);
        setInput("");

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: msgText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: msgText,
                    user_id: "dashboard_user",
                }),
            });

            const data = await response.json();

            const botMessage: ChatMessage = {
                id: `bot-${Date.now()}`,
                role: "assistant",
                content: data.reply || data.error || "Unable to fetch data. Please try again.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `error-${Date.now()}`,
                    role: "assistant",
                    content: "⚠️ Unable to connect. Please check your connection and try again.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* ── Floating Chat Button ── */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#8AE234] to-[#6BC51D] shadow-lg shadow-[#8AE234]/30 flex items-center justify-center text-[#0B0F19] hover:shadow-[#8AE234]/50 transition-shadow cursor-pointer"
                    >
                        <MessageCircle className="w-6 h-6" />
                        {/* Pulse ring */}
                        {showPulse && (
                            <span className="absolute inset-0 rounded-full bg-[#8AE234]/30 animate-ping" />
                        )}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ── Chat Panel ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 z-50 w-[380px] h-[560px] flex flex-col rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl shadow-black/40"
                        style={{
                            background: "linear-gradient(180deg, #111827 0%, #0B0F19 100%)",
                        }}
                    >
                        {/* ── Header ── */}
                        <div className="relative px-5 py-4 border-b border-gray-700/50 shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#8AE234]/5 to-transparent" />
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8AE234] to-[#6BC51D] flex items-center justify-center shadow-lg shadow-[#8AE234]/20">
                                        <Leaf className="w-5 h-5 text-[#0B0F19]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                                            SarusGuard AI
                                            <Sparkles className="w-3.5 h-3.5 text-[#8AE234]" />
                                        </h3>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#8AE234] animate-pulse" />
                                            <span className="text-[11px] text-gray-400">Online • Context-Aware</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* ── Messages ── */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {/* Bot avatar */}
                                    {msg.role === "assistant" && (
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8AE234]/20 to-[#8AE234]/5 flex items-center justify-center shrink-0 mt-0.5 border border-[#8AE234]/20">
                                            <Bot className="w-3.5 h-3.5 text-[#8AE234]" />
                                        </div>
                                    )}

                                    {/* Message bubble */}
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                                            msg.role === "user"
                                                ? "bg-gradient-to-br from-[#8AE234] to-[#6BC51D] text-[#0B0F19] rounded-br-md font-medium"
                                                : "bg-[#1E293B] text-gray-300 rounded-bl-md border border-gray-700/50"
                                        }`}
                                    >
                                        {msg.role === "assistant" ? (
                                            <div
                                                className="ai-response"
                                                dangerouslySetInnerHTML={{
                                                    __html: renderMarkdown(msg.content),
                                                }}
                                            />
                                        ) : (
                                            msg.content
                                        )}
                                    </div>

                                    {/* User avatar */}
                                    {msg.role === "user" && (
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
                                            <User className="w-3.5 h-3.5 text-blue-400" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-2.5"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8AE234]/20 to-[#8AE234]/5 flex items-center justify-center shrink-0 border border-[#8AE234]/20">
                                        <Bot className="w-3.5 h-3.5 text-[#8AE234]" />
                                    </div>
                                    <div className="bg-[#1E293B] rounded-2xl rounded-bl-md px-4 py-3 border border-gray-700/50">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-3.5 h-3.5 text-[#8AE234] animate-spin" />
                                            <span className="text-xs text-gray-400">Analyzing data...</span>
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#8AE234]/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#8AE234]/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#8AE234]/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* ── Suggested Questions ── */}
                        {messages.length <= 1 && !isLoading && (
                            <div className="px-4 pb-2 shrink-0">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <ChevronDown className="w-3 h-3 text-gray-500" />
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Quick Questions</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {suggestedQuestions.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => sendMessage(q)}
                                            className="text-[11px] px-3 py-1.5 rounded-lg bg-[#1E293B] border border-gray-700/50 text-gray-300 hover:border-[#8AE234]/30 hover:text-[#8AE234] transition-all cursor-pointer hover:bg-[#8AE234]/5"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Input Bar ── */}
                        <div className="px-4 py-3 border-t border-gray-700/50 shrink-0">
                            <div className="flex items-center gap-2 bg-[#1E293B] rounded-xl border border-gray-700/50 focus-within:border-[#8AE234]/30 transition-colors px-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about wetlands, birds, pollution..."
                                    className="flex-1 bg-transparent py-3 text-sm text-white placeholder-gray-500 focus:outline-none"
                                    disabled={isLoading}
                                    maxLength={1000}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || isLoading}
                                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8AE234] to-[#6BC51D] flex items-center justify-center text-[#0B0F19] disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#8AE234]/20 transition-all cursor-pointer shrink-0"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-600 text-center mt-2">
                                Powered by SarusGuard AI • Context-aware responses
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
