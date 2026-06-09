"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronRight, LayoutDashboard, MailPlus, Menu, Search, Settings, Users, X, BarChart3, Zap, HelpCircle, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { getNotifications, getSearchResults, markAllNotificationsRead } from "../lib/api";
import type { NotificationItem, SearchResult } from "../lib/types";
import { Badge } from "./ui";

interface Message {
    id: string;
    sender: "user" | "bot";
    text: string;
    timestamp: string;
}

const navigation = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/automation", label: "Automation", icon: Zap },
    { href: "/campaigns", label: "Campaigns", icon: MailPlus },
    { href: "/contacts", label: "Contacts", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [notificationsError, setNotificationsError] = useState<string | null>(null);
    const navItems = navigation;

    // FLOATING AI BOT STATES
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            sender: "bot",
            text: "Beep boop! 🤖 I am your Globo Persona Robot Assistant. How can I help you manage your analytics data or workspace nodes today?",
            timestamp: "Just now"
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const activeSection = useMemo(() => {
        const current = navigation.find((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)));
        return current?.label ?? "Dashboard";
    }, [pathname]);

    useEffect(() => {
        setMobileOpen(false);
        setSearchOpen(false);
        setNotificationsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isChatOpen]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSearchOpen(false);
                setNotificationsOpen(false);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadNotifications = async () => {
            try {
                setNotificationsLoading(true);
                setNotificationsError(null);
                const data = await getNotifications();

                if (isMounted) {
                    setNotifications(data.items);
                }
            } catch {
                if (isMounted) {
                    setNotificationsError("Notifications could not be loaded.");
                    setNotifications([]);
                }
            } finally {
                if (isMounted) {
                    setNotificationsLoading(false);
                }
            }
        };

        void loadNotifications();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!searchOpen) {
            return;
        }

        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) {
            setSearchLoading(false);
            setSearchError(null);
            setSearchResults([]);
            return;
        }

        let isMounted = true;
        const timeout = window.setTimeout(async () => {
            try {
                setSearchLoading(true);
                setSearchError(null);
                const data = await getSearchResults(trimmedQuery);

                if (isMounted) {
                    setSearchResults(data.items);
                }
            } catch {
                if (isMounted) {
                    setSearchError("Search is temporarily unavailable right now.");
                    setSearchResults([]);
                }
            } finally {
                if (isMounted) {
                    setSearchLoading(false);
                }
            }
        }, 180);

        return () => {
            isMounted = false;
            window.clearTimeout(timeout);
        };
    }, [searchOpen, searchQuery]);

    const openResult = (href: string) => {
        setSearchOpen(false);
        setSearchQuery("");
        router.push(href);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Math.random().toString(),
            sender: "user",
            text: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        const query = inputValue.toLowerCase();
        setInputValue("");
        setIsTyping(true);

        setTimeout(() => {
            let responseText = "Transmission processed. Let me know if you need help with your automation trees or tracking panels.";
            
            if (query.includes("automation") || query.includes("workflow") || query.includes("flow")) {
                responseText = "To build a marketing funnel pipeline, click 'Automation' in the sidebar. You can structure logical steps matching your workspace workflow maps.";
            } else if (query.includes("analytics") || query.includes("graph") || query.includes("chart")) {
                responseText = "The Analytics panel provides vector metric graphics mapping out conversion boosts, overall channel ROI tracking, and systemic cash yields.";
            } else if (query.includes("contact") || query.includes("csv")) {
                responseText = "Manage user listings inside the Contacts dashboard view. You can parse live text blocks or ingest raw data files easily.";
            }

            const botMsg: Message = {
                id: Math.random().toString(),
                sender: "bot",
                text: responseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="h-screen w-screen overflow-hidden text-ink-900 bg-[#F8FAFC] relative">
            <div className="grid h-full lg:grid-cols-[280px_1fr] overflow-hidden">
                
                {/* DESKTOP SIDEBAR */}
                <aside className="hidden border-r border-[#DDE8FF] bg-white/90 px-5 py-6 backdrop-blur xl:block h-full overflow-hidden">
                    <div className="flex h-full flex-col rounded-[28px] border border-[#DDE8FF] bg-white/95 p-5 shadow-soft overflow-hidden">
                        
                        {/* BRAND LOGO AREA */}
                        <div className="mb-8 flex items-center gap-3 px-2 flex-shrink-0">
                            <Link href="/" className="relative h-9 w-40 flex items-center">
                                <img 
                                    src="/logo.png" 
                                    alt="Globo Persona Logo" 
                                    className="h-full w-full object-contain object-left"
                                />
                            </Link>
                        </div>

                        {/* NAVIGATION ITEMS */}
                        <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                                return (
                                    <Link key={item.href} href={item.href} title={item.label} className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? "bg-[#EEF4FF] text-accent-600 shadow-sm" : "text-ink-700 hover:bg-[#F4F7FC]"}`}>
                                        <span className="flex items-center gap-3">
                                            <span className={`grid h-9 w-9 place-items-center rounded-2xl ${active ? "bg-white text-accent-600 shadow-sm" : "bg-[#F4F7FC] text-ink-500"}`}>
                                                <Icon size={17} />
                                            </span>
                                            {item.label}
                                        </span>
                                        {active ? <ChevronRight size={16} /> : null}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* NEED HELP NAVIGATION BUTTON */}
                        <div className="mt-auto pt-4 border-t border-[#DDE8FF] flex-shrink-0">
                            <Link 
                                href="/help"
                                className={`flex items-center justify-between w-full rounded-2xl px-4 py-3.5 text-sm font-semibold transition tracking-tight group ${
                                    pathname === "/help" 
                                        ? "bg-[#EEF4FF] text-accent-600 shadow-sm" 
                                        : "bg-[#F4F7FC] text-ink-700 hover:bg-[#EEF4FF] hover:text-accent-600 border border-[#DDE8FF]/60"
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className={`grid h-8 w-8 place-items-center rounded-xl transition ${
                                        pathname === "/help" ? "bg-white text-accent-600 shadow-sm" : "bg-white text-ink-500 group-hover:text-accent-600"
                                    }`}>
                                        <HelpCircle size={16} />
                                    </span>
                                    Need help?
                                </span>
                                <ChevronRight size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* MOBILE SIDEBAR */}
                {mobileOpen ? (
                    <div className="fixed inset-0 z-40 bg-[#002D72]/25 p-3 backdrop-blur-sm sm:p-4 xl:hidden" onClick={() => setMobileOpen(false)} role="presentation">
                        <div role="dialog" aria-modal="true" aria-label="Mobile navigation" tabIndex={-1} className="ml-auto w-full max-w-[92vw] rounded-[24px] border border-[#DDE8FF] bg-white p-4 shadow-lift sm:max-w-sm sm:p-5" onClick={(event) => event.stopPropagation()}>
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-ink-900">Globopersona</p>
                                    <p className="text-xs text-ink-500">{activeSection}</p>
                                </div>
                                <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F4F7FC] text-ink-700"><X size={18} /></button>
                            </div>
                            <nav className="space-y-2 max-h-[50vh] overflow-y-auto mb-4">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                                    return (
                                        <Link key={item.href} href={item.href} title={item.label} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${active ? "bg-[#EEF4FF] text-accent-600" : "text-ink-700 hover:bg-[#F4F7FC]"}`}>
                                            <Icon size={17} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="pt-3 border-t border-[#DDE8FF]">
                                <Link key="/help" href="/help" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${pathname === "/help" ? "bg-[#EEF4FF] text-accent-600" : "text-ink-700 hover:bg-[#F4F7FC]"}`}>
                                    <HelpCircle size={17} />
                                    Need help?
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* MAIN INNER VIEWPORT */}
                <div className="flex flex-col min-w-0 h-full overflow-hidden">
                    <header className="sticky top-0 z-30 border-b border-[#DDE8FF] bg-[rgba(255,255,255,0.88)] px-3 py-3 backdrop-blur sm:px-4 sm:py-4 xl:px-8 flex-shrink-0">
                        <div className="flex items-center gap-3 rounded-[24px] border border-[#DDE8FF] bg-white/90 px-3 py-3 shadow-soft sm:rounded-[24px] sm:px-4">
                            <button type="button" aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F4F7FC] text-ink-700 xl:hidden" onClick={() => setMobileOpen(true)}>
                                <Menu size={18} />
                            </button>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-600">{activeSection}</p>
                                <p className="hidden truncate text-sm text-ink-500 sm:block">Modern email marketing dashboard for campaign operations.</p>
                            </div>
                            <div className="hidden items-center gap-3 md:flex">
                                <button type="button" aria-label="Open search" onClick={() => setSearchOpen(true)} className="flex h-11 w-[220px] items-center gap-3 rounded-2xl border border-[#D5DFED] bg-[#F4F7FC] px-4 text-left text-sm text-ink-500 transition hover:border-[#B7CAEA] hover:bg-white lg:w-[300px]">
                                    <Search size={16} className="shrink-0 text-ink-400" />
                                    <span className="truncate">Search campaigns, contacts, and settings</span>
                                </button>
                                <div className="relative">
                                    <button type="button" aria-label="Open notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((current) => !current)} className="relative grid h-11 w-11 place-items-center rounded-2xl border border-[#D5DFED] bg-white text-ink-700 transition hover:border-[#B7CAEA] hover:bg-[#F4F7FC]">
                                        <Bell size={17} />
                                        {notifications.length ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-500" /> : null}
                                    </button>
                                    {notificationsOpen ? (
                                        <div role="region" aria-label="Notifications" className="absolute right-0 top-14 w-[min(320px,calc(100vw-2rem))] rounded-[24px] border border-[#DDE8FF] bg-white p-4 shadow-lift sm:rounded-[24px]">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-semibold text-ink-900">Notifications</p>
                                                <button
                                                    type="button"
                                                    className="text-xs font-semibold text-accent-600"
                                                    onClick={async () => {
                                                        try {
                                                            await markAllNotificationsRead();
                                                            setNotifications([]);
                                                        } catch {
                                                            setNotificationsError("Could not update notifications yet.");
                                                        }
                                                    }}
                                                >
                                                    Mark all read
                                                </button>
                                            </div>
                                            {notificationsLoading ? <p className="mt-3 rounded-2xl border border-dashed border-[#E7EEF8] p-4 text-sm text-ink-500">Loading notifications...</p> : null}
                                            {notificationsError ? <p className="mt-3 rounded-2xl border border-dashed border-[#FF4D4D]/20 bg-[#FF4D4D]/10 p-4 text-sm text-[#FF4D4D]">{notificationsError}</p> : null}
                                            <div className="mt-3 space-y-3 max-h-[40vh] overflow-y-auto">
                                                {!notificationsLoading && notifications.length ? notifications.map((item) => (
                                                    <div key={item.title} className="rounded-2xl border border-[#E7EEF8] bg-[#F4F7FC] p-3">
                                                        <p className="text-sm font-semibold text-ink-900">{item.title}</p>
                                                        <p className="mt-1 text-sm leading-6 text-ink-500">{item.detail}</p>
                                                        <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-400">{item.time}</p>
                                                    </div>
                                                )) : null}
                                                {!notificationsLoading && !notifications.length ? <p className="rounded-2xl border border-dashed border-[#E7EEF8] p-4 text-sm text-ink-500">No unread notifications.</p> : null}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                <Link href="/campaigns/new" className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#002D72] px-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#004AAD]">Create campaign</Link>
                            </div>
                        </div>
                    </header>

                    {/* SCROLLABLE INNER PAGE AREA */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-4 sm:py-6 xl:px-8 focus:outline-none">
                        <div className="mx-auto w-full max-w-[1480px] pb-12">{children}</div>
                    </main>
                </div>
            </div>

            {/* FLOATING AI ROBOT WIDGET */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                {isChatOpen && (
                    <div className="w-80 sm:w-96 h-[450px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-2xl overflow-hidden flex flex-col mb-4">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#002D72] to-[#0B51C1] p-4 text-white flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-white/10 grid place-items-center border border-white/20">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white animate-pulse">
                                        <path d="M12 2a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v2a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3V7a2 2 0 0 1 2-2h3V4a2 2 0 0 1 2-2zm-3 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-6 6h6v1H9v-1z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xs font-black tracking-tight flex items-center gap-1.5 text-white">
                                        Persona Robot Assistant <Sparkles size={11} className="text-[#63B3ED] fill-current" />
                                    </h3>
                                    <p className="text-[10px] text-white/70 font-medium">Core Intelligence Node Online</p>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 transition">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Conversational Screen */}
                        <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] space-y-3 text-xs">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}>
                                    <div className={`p-3 rounded-[16px] leading-relaxed shadow-sm font-medium ${
                                        msg.sender === "user" ? "bg-[#0B51C1] text-white rounded-br-none" : "bg-white text-[#1A202C] border border-[#E2E8F0] rounded-bl-none"
                                    }`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[9px] font-semibold text-[#A0AEC0] mt-1 px-1">{msg.timestamp}</span>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] p-2.5 rounded-xl max-w-[60px] justify-center shadow-sm">
                                    <span className="w-1.5 h-1.5 bg-[#0B51C1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-[#0B51C1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-[#0B51C1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Message Dispatch Input Bar */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E2E8F0] bg-white flex gap-2 flex-shrink-0">
                            <input
                                type="text"
                                placeholder="Type your system query..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1 h-10 border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/20 transition-all font-medium text-[#1A202C]"
                            />
                            <button type="submit" disabled={!inputValue.trim()} className="w-10 h-10 rounded-xl bg-[#002D72] hover:bg-[#0B51C1] text-white grid place-items-center transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none">
                                <Send size={14} />
                            </button>
                        </form>
                    </div>
                )}

                {/* MECHANICAL ROBOT HEAD TOGGLE TRIGGER */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#002D72] via-[#004AAD] to-[#0B51C1] text-white flex flex-col items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 group focus:outline-none border-2 border-white/20 relative flex-shrink-0"
                    title="Ask AI Robot Assistant"
                >
                    {isChatOpen ? (
                        <X size={24} />
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-1">
                            <div className="w-1 h-1 bg-white rounded-full animate-ping mb-[-2px]" />
                            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white transition-transform duration-300 group-hover:rotate-12">
                                <path d="M12 2a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v2a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3V7a2 2 0 0 0-2-2h-3V4a2 2 0 0 0-2-2zm-3 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-5 6h4a1 1 0 0 1 0 2h-4a1 1 0 0 1 0-2z" />
                            </svg>
                        </div>
                    )}
                    {!isChatOpen && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#2F855A] border border-white rounded-full animate-pulse" />
                    )}
                </button>
            </div>

            {/* SEARCH MODAL DIALOG */}
            {searchOpen ? (
                <div role="dialog" aria-modal="true" aria-label="Search" className="fixed inset-0 z-50 bg-ink-900/40 p-3 backdrop-blur-sm sm:p-4" onClick={() => setSearchOpen(false)}>
                    <div className="mx-auto mt-8 w-full max-w-[calc(100vw-1.5rem)] rounded-[24px] border border-[#DDE8FF] bg-white p-4 shadow-lift sm:mt-16 sm:max-w-3xl sm:rounded-[32px] sm:p-5" onClick={(event) => event.stopPropagation()}>
                        <div className="flex items-center gap-3 rounded-2xl border border-[#DDE8FF] bg-[#F4F7FC] px-4 py-3">
                            <Search size={16} className="text-ink-400" />
                            <input
                                autoFocus
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" && searchResults[0]) {
                                        event.preventDefault();
                                        openResult(searchResults[0].href);
                                    }
                                }}
                                placeholder="Search campaigns, contacts, activities, and settings"
                                className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-500"
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                            <p className="text-sm text-ink-500">{searchQuery.trim() ? `Showing ${searchResults.length} result${searchResults.length === 1 ? "" : "s"}` : "Start typing to search campaigns, contacts, activities, and settings."}</p>
                            <button type="button" className="text-sm font-semibold text-ink-500" onClick={() => setSearchOpen(false)}>Close</button>
                        </div>

                        <div className="mt-4 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
                            {searchLoading ? <p className="rounded-2xl border border-dashed border-[#E7EEF8] p-5 text-sm text-ink-500">Loading search results...</p> : null}
                            {searchError ? <p className="rounded-2xl border border-dashed border-[#FF4D4D]/20 bg-[#FF4D4D]/10 p-5 text-sm text-[#FF4D4D]">{searchError}</p> : null}
                            {!searchLoading && !searchError && !searchQuery.trim() ? <p className="rounded-2xl border border-dashed border-[#E7EEF8] p-5 text-sm text-ink-500">Type a campaign, contact, activity, or setting name to see results.</p> : null}
                            {!searchLoading && !searchError && searchResults.length ? searchResults.map((item) => (
                                <button key={`${item.group}-${item.title}`} type="button" onClick={() => openResult(item.href)} className="flex w-full items-start justify-between gap-4 rounded-2xl border border-[#DDE8FF] bg-white px-4 py-4 text-left transition hover:border-[#B7CAEA] hover:bg-[#F4F7FC]">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">{item.group}</p>
                                        <p className="mt-1 font-semibold text-ink-900">{item.title}</p>
                                        <p className="mt-1 text-sm leading-6 text-ink-500">{item.description}</p>
                                    </div>
                                    <ChevronRight size={16} className="mt-1 shrink-0 text-ink-400" />
                                </button>
                            )) : null}
                            {!searchLoading && !searchError && !searchResults.length ? <p className="rounded-2xl border border-dashed border-[#E7EEF8] p-5 text-sm text-ink-500">No matching results. Try a campaign name, contact, activity, or setting.</p> : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}