"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronRight, LayoutDashboard, MailPlus, Menu, Search, Settings, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { activities, contacts, recentCampaigns, settingsPanels } from "../data/mock-data";
import { Badge } from "./ui";

const navigation = [
	{ href: "/", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/campaigns", label: "Campaigns", icon: MailPlus },
	{ href: "/contacts", label: "Contacts", icon: Users },
	{ href: "/settings", label: "Settings", icon: Settings }
];

type SearchResult = {
	href: string;
	title: string;
	description: string;
	group: string;
	keywords: string;
};

const notificationsSeed = [
	{ title: "Campaign approved", detail: "Spring product update is ready to send.", time: "8 min ago" },
	{ title: "Automation triggered", detail: "Abandoned cart workflow reached 212 contacts.", time: "36 min ago" },
	{ title: "Segment refreshed", detail: "High-intent audience synced successfully.", time: "2 hours ago" }
];

export function AppShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const [notifications, setNotifications] = useState(notificationsSeed);

	const activeSection = useMemo(() => {
		const current = navigation.find((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)));
		return current?.label ?? "Dashboard";
	}, [pathname]);

	const searchResults = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		const items: SearchResult[] = [
			{ href: "/", title: "Dashboard", description: "Overview, performance, and live activity.", group: "Navigation", keywords: "dashboard home overview stats" },
			{ href: "/campaigns", title: "Campaigns", description: "Manage campaigns, filters, and status rows.", group: "Navigation", keywords: "campaign campaigns emails sends" },
			{ href: "/campaigns/new", title: "Create campaign", description: "Open the campaign builder.", group: "Actions", keywords: "new create campaign builder compose" },
			{ href: "/contacts", title: "Contacts", description: "Search contacts and audience segments.", group: "Navigation", keywords: "contacts audience segments subscribers" },
			{ href: "/settings", title: "Settings", description: "Brand profile, sending domain, and team access.", group: "Navigation", keywords: "settings configuration brand access" },
			...recentCampaigns.map((campaign) => ({
				href: "/campaigns",
				title: campaign.name,
				description: `${campaign.audience} · ${campaign.status}`,
				group: "Campaigns",
				keywords: `${campaign.name} ${campaign.audience} ${campaign.status}`
			})),
			...contacts.map((contact) => ({
				href: "/contacts",
				title: contact.name,
				description: `${contact.email} · ${contact.segment}`,
				group: "Contacts",
				keywords: `${contact.name} ${contact.email} ${contact.segment} ${contact.status}`
			})),
			...activities.map((item) => ({
				href: "/campaigns",
				title: item.title,
				description: item.detail,
				group: "Automations",
				keywords: `${item.title} ${item.detail} ${item.time} automation automations`
			})),
			...settingsPanels.map((panel) => ({
				href: "/settings",
				title: panel.title,
				description: panel.description,
				group: "Settings",
				keywords: `${panel.title} ${panel.description}`
			}))
		];

		return query
			? items.filter((item) => `${item.title} ${item.description} ${item.group} ${item.keywords}`.toLowerCase().includes(query))
			: items.slice(0, 10);
	}, [searchQuery]);

	useEffect(() => {
		setMobileOpen(false);
		setSearchOpen(false);
		setNotificationsOpen(false);
	}, [pathname]);

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

	const openResult = (href: string) => {
		setSearchOpen(false);
		setSearchQuery("");
		router.push(href);
	};

	return (
		<div className="min-h-screen text-ink-900">
			<div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
				<aside className="hidden border-r border-white/60 bg-white/75 px-5 py-6 backdrop-blur xl:block">
					<div className="sticky top-6 flex h-[calc(100vh-3rem)] flex-col rounded-[32px] border border-sand-100 bg-white/90 p-5 shadow-soft">
						<div className="mb-8 flex items-center gap-3 px-2">
							<div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent-500 to-emerald-400 text-sm font-bold text-white shadow-soft">GP</div>
							<div>
								<p className="text-sm font-bold tracking-tight text-ink-900">Globopersona</p>
								<p className="text-xs text-ink-500">Marketing workspace</p>
							</div>
						</div>

						<nav className="space-y-1">
							{navigation.map((item) => {
								const Icon = item.icon;
								const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
								return (
									<Link key={item.href} href={item.href} className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? "bg-accent-50 text-accent-600 shadow-sm" : "text-ink-700 hover:bg-sand-50"}`}>
										<span className="flex items-center gap-3">
											<span className={`grid h-9 w-9 place-items-center rounded-2xl ${active ? "bg-white text-accent-600 shadow-sm" : "bg-sand-50 text-ink-500"}`}>
												<Icon size={17} />
											</span>
											{item.label}
										</span>
										{active ? <ChevronRight size={16} /> : null}
									</Link>
								);
							})}
						</nav>

						<div className="mt-auto rounded-[28px] border border-sand-100 bg-gradient-to-br from-sand-50 to-white p-4">
							<p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">Workspace health</p>
							<p className="mt-2 text-lg font-bold text-ink-900">89% synced</p>
							<p className="mt-1 text-sm leading-6 text-ink-500">All audiences, automations, and assets are up to date.</p>
							<div className="mt-4"><Badge tone="green">Stable delivery</Badge></div>
						</div>
					</div>
				</aside>

				{mobileOpen ? (
					<div className="fixed inset-0 z-40 bg-ink-900/30 p-4 backdrop-blur-sm xl:hidden" onClick={() => setMobileOpen(false)}>
						<div className="ml-auto w-full max-w-sm rounded-[32px] bg-white p-5 shadow-lift" onClick={(event) => event.stopPropagation()}>
							<div className="mb-6 flex items-center justify-between">
								<div>
									<p className="text-sm font-bold text-ink-900">Globopersona</p>
									<p className="text-xs text-ink-500">{activeSection}</p>
								</div>
								<button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-2xl bg-sand-50 text-ink-700"><X size={18} /></button>
							</div>
							<nav className="space-y-2">
								{navigation.map((item) => {
									const Icon = item.icon;
									const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
									return (
										<Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${active ? "bg-accent-50 text-accent-600" : "text-ink-700 hover:bg-sand-50"}`}>
											<Icon size={17} />
											{item.label}
										</Link>
									);
								})}
							</nav>
						</div>
					</div>
				) : null}

				<div className="flex min-w-0 flex-col">
					<header className="sticky top-0 z-30 border-b border-white/70 bg-[rgba(251,248,242,0.8)] px-4 py-4 backdrop-blur xl:px-8">
						<div className="flex items-center gap-3 rounded-[28px] border border-white/70 bg-white/80 px-4 py-3 shadow-soft">
							<button aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-2xl bg-sand-50 text-ink-700 xl:hidden" onClick={() => setMobileOpen(true)}>
								<Menu size={18} />
							</button>
							<div className="min-w-0 flex-1">
								<p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-600">{activeSection}</p>
								<p className="truncate text-sm text-ink-500">Modern email marketing dashboard for campaign operations.</p>
							</div>
							<div className="hidden items-center gap-3 md:flex">
								<button type="button" aria-label="Open search" onClick={() => setSearchOpen(true)} className="flex h-11 w-[300px] items-center gap-3 rounded-2xl border border-sand-100 bg-sand-50 px-4 text-left text-sm text-ink-500 transition hover:border-sand-200 hover:bg-white">
									<Search size={16} className="shrink-0 text-ink-400" />
									<span className="truncate">Search campaigns, contacts, and automations</span>
								</button>
								<div className="relative">
									<button type="button" aria-label="Open notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((current) => !current)} className="relative grid h-11 w-11 place-items-center rounded-2xl border border-sand-100 bg-white text-ink-700 transition hover:border-sand-200 hover:bg-sand-50">
										<Bell size={17} />
										{notifications.length ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-500" /> : null}
									</button>
									{notificationsOpen ? (
										<div className="absolute right-0 top-14 w-[320px] rounded-[28px] border border-sand-100 bg-white p-4 shadow-lift">
											<div className="flex items-center justify-between gap-3">
												<p className="text-sm font-semibold text-ink-900">Notifications</p>
												<button type="button" className="text-xs font-semibold text-accent-600" onClick={() => setNotifications([])}>Mark all read</button>
											</div>
											<div className="mt-3 space-y-3">
												{notifications.length ? notifications.map((item) => (
													<div key={item.title} className="rounded-2xl border border-sand-100 bg-sand-50/80 p-3">
														<p className="text-sm font-semibold text-ink-900">{item.title}</p>
														<p className="mt-1 text-sm leading-6 text-ink-500">{item.detail}</p>
														<p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-400">{item.time}</p>
													</div>
												)) : <p className="rounded-2xl border border-dashed border-sand-100 p-4 text-sm text-ink-500">No unread notifications.</p>}
											</div>
										</div>
									) : null}
								</div>
								<Link href="/campaigns/new" className="inline-flex h-11 items-center justify-center rounded-2xl bg-ink-900 px-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink-700">Create campaign</Link>
							</div>
						</div>
					</header>

					<main className="flex-1 px-4 py-6 xl:px-8">
						<div className="mx-auto w-full max-w-[1480px]">{children}</div>
					</main>
				</div>
			</div>

			{searchOpen ? (
				<div className="fixed inset-0 z-50 bg-ink-900/40 p-4 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
					<div className="mx-auto mt-16 w-full max-w-3xl rounded-[32px] border border-sand-100 bg-white p-5 shadow-lift" onClick={(event) => event.stopPropagation()}>
						<div className="flex items-center gap-3 rounded-2xl border border-sand-100 bg-sand-50 px-4 py-3">
							<Search size={16} className="text-ink-400" />
							<input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onKeyDown={(event) => {
								if (event.key === "Enter" && searchResults[0]) {
									event.preventDefault();
									openResult(searchResults[0].href);
								}
							}} placeholder="Search campaigns, contacts, automations, and settings" className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-500" />
						</div>

						<div className="mt-4 flex items-center justify-between gap-3">
							<p className="text-sm text-ink-500">Showing {searchResults.length} result{searchResults.length === 1 ? "" : "s"}</p>
							<button type="button" className="text-sm font-semibold text-ink-500" onClick={() => setSearchOpen(false)}>Close</button>
						</div>

						<div className="mt-4 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
							{searchResults.length ? searchResults.map((item) => (
								<button key={`${item.group}-${item.title}`} type="button" onClick={() => openResult(item.href)} className="flex w-full items-start justify-between gap-4 rounded-2xl border border-sand-100 bg-white px-4 py-4 text-left transition hover:border-accent-100 hover:bg-accent-50/40">
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">{item.group}</p>
										<p className="mt-1 font-semibold text-ink-900">{item.title}</p>
										<p className="mt-1 text-sm leading-6 text-ink-500">{item.description}</p>
									</div>
									<ChevronRight size={16} className="mt-1 shrink-0 text-ink-400" />
								</button>
							)) : <p className="rounded-2xl border border-dashed border-sand-100 p-5 text-sm text-ink-500">No matching results. Try a campaign name, contact, or automation keyword.</p>}
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
