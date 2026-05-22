"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronRight, LayoutDashboard, MailPlus, Menu, Search, Settings, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getNotifications, getSearchResults, markAllNotificationsRead } from "../lib/api";
import type { NotificationItem, SearchResult } from "../lib/types";
import { Badge } from "./ui";

const navigation = [
	{ href: "/", label: "Dashboard", icon: LayoutDashboard },
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

		let isMounted = true;
		const timeout = window.setTimeout(async () => {
			try {
				setSearchLoading(true);
				setSearchError(null);
				const data = await getSearchResults(searchQuery.trim());

				if (isMounted) {
					setSearchResults(data.items);
				}
			} catch {
				if (isMounted) {
					setSearchError("Search is unavailable until the backend is connected.");
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

	return (
		<div className="min-h-screen overflow-x-hidden text-ink-900">
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
							<p className="mt-2 text-lg font-bold text-ink-900">Backend ready</p>
							<p className="mt-1 text-sm leading-6 text-ink-500">Campaigns, contacts, settings, and notifications now load from API endpoints.</p>
							<div className="mt-4"><Badge tone="green">Live data</Badge></div>
						</div>
					</div>
				</aside>

				{mobileOpen ? (
					<div className="fixed inset-0 z-40 bg-ink-900/30 p-3 backdrop-blur-sm sm:p-4 xl:hidden" onClick={() => setMobileOpen(false)} role="presentation">
						<div role="dialog" aria-modal="true" aria-label="Mobile navigation" tabIndex={-1} className="ml-auto w-full max-w-[92vw] rounded-[28px] bg-white p-4 shadow-lift sm:max-w-sm sm:p-5" onClick={(event) => event.stopPropagation()}>
							<div className="mb-6 flex items-center justify-between">
								<div>
									<p className="text-sm font-bold text-ink-900">Globopersona</p>
									<p className="text-xs text-ink-500">{activeSection}</p>
								</div>
								<button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-2xl bg-sand-50 text-ink-700"><X size={18} /></button>
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
					<header className="sticky top-0 z-30 border-b border-white/70 bg-[rgba(251,248,242,0.8)] px-3 py-3 backdrop-blur sm:px-4 sm:py-4 xl:px-8">
						<div className="flex items-center gap-3 rounded-[24px] border border-white/70 bg-white/80 px-3 py-3 shadow-soft sm:rounded-[28px] sm:px-4">
							<button type="button" aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-2xl bg-sand-50 text-ink-700 xl:hidden" onClick={() => setMobileOpen(true)}>
								<Menu size={18} />
							</button>
							<div className="min-w-0 flex-1">
								<p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-600">{activeSection}</p>
								<p className="hidden truncate text-sm text-ink-500 sm:block">Modern email marketing dashboard for campaign operations.</p>
							</div>
							<div className="hidden items-center gap-3 md:flex">
								<button type="button" aria-label="Open search" onClick={() => setSearchOpen(true)} className="flex h-11 w-[220px] items-center gap-3 rounded-2xl border border-sand-100 bg-sand-50 px-4 text-left text-sm text-ink-500 transition hover:border-sand-200 hover:bg-white lg:w-[300px]">
									<Search size={16} className="shrink-0 text-ink-400" />
									<span className="truncate">Search campaigns, contacts, and settings</span>
								</button>
								<div className="relative">
									<button type="button" aria-label="Open notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((current) => !current)} className="relative grid h-11 w-11 place-items-center rounded-2xl border border-sand-100 bg-white text-ink-700 transition hover:border-sand-200 hover:bg-sand-50">
										<Bell size={17} />
										{notifications.length ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-500" /> : null}
									</button>
									{notificationsOpen ? (
										<div role="region" aria-label="Notifications" className="absolute right-0 top-14 w-[min(320px,calc(100vw-2rem))] rounded-[24px] border border-sand-100 bg-white p-4 shadow-lift sm:rounded-[28px]">
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
											{notificationsLoading ? <p className="mt-3 rounded-2xl border border-dashed border-sand-100 p-4 text-sm text-ink-500">Loading notifications...</p> : null}
											{notificationsError ? <p className="mt-3 rounded-2xl border border-dashed border-orange-100 bg-orange-50 p-4 text-sm text-orange-700">{notificationsError}</p> : null}
											<div className="mt-3 space-y-3">
												{!notificationsLoading && notifications.length ? notifications.map((item) => (
													<div key={item.title} className="rounded-2xl border border-sand-100 bg-sand-50/80 p-3">
														<p className="text-sm font-semibold text-ink-900">{item.title}</p>
														<p className="mt-1 text-sm leading-6 text-ink-500">{item.detail}</p>
														<p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-400">{item.time}</p>
													</div>
												)) : null}
												{!notificationsLoading && !notifications.length ? <p className="rounded-2xl border border-dashed border-sand-100 p-4 text-sm text-ink-500">No unread notifications.</p> : null}
											</div>
										</div>
									) : null}
								</div>
								<Link href="/campaigns/new" className="inline-flex h-11 items-center justify-center rounded-2xl bg-ink-900 px-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink-700">Create campaign</Link>
							</div>
						</div>
					</header>

					<main className="flex-1 px-3 py-4 sm:px-4 sm:py-6 xl:px-8">
						<div className="mx-auto w-full max-w-[1480px]">{children}</div>
					</main>
				</div>
			</div>

			{searchOpen ? (
				<div role="dialog" aria-modal="true" aria-label="Search" className="fixed inset-0 z-50 bg-ink-900/40 p-3 backdrop-blur-sm sm:p-4" onClick={() => setSearchOpen(false)}>
					<div className="mx-auto mt-8 w-full max-w-[calc(100vw-1.5rem)] rounded-[24px] border border-sand-100 bg-white p-4 shadow-lift sm:mt-16 sm:max-w-3xl sm:rounded-[32px] sm:p-5" onClick={(event) => event.stopPropagation()}>
						<div className="flex items-center gap-3 rounded-2xl border border-sand-100 bg-sand-50 px-4 py-3">
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
							<p className="text-sm text-ink-500">Showing {searchResults.length} result{searchResults.length === 1 ? "" : "s"}</p>
							<button type="button" className="text-sm font-semibold text-ink-500" onClick={() => setSearchOpen(false)}>Close</button>
						</div>

						<div className="mt-4 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
							{searchLoading ? <p className="rounded-2xl border border-dashed border-sand-100 p-5 text-sm text-ink-500">Loading search results...</p> : null}
							{searchError ? <p className="rounded-2xl border border-dashed border-orange-100 bg-orange-50 p-5 text-sm text-orange-700">{searchError}</p> : null}
							{!searchLoading && !searchError && searchResults.length ? searchResults.map((item) => (
								<button key={`${item.group}-${item.title}`} type="button" onClick={() => openResult(item.href)} className="flex w-full items-start justify-between gap-4 rounded-2xl border border-sand-100 bg-white px-4 py-4 text-left transition hover:border-accent-100 hover:bg-accent-50/40">
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">{item.group}</p>
										<p className="mt-1 font-semibold text-ink-900">{item.title}</p>
										<p className="mt-1 text-sm leading-6 text-ink-500">{item.description}</p>
									</div>
									<ChevronRight size={16} className="mt-1 shrink-0 text-ink-400" />
								</button>
							)) : null}
							{!searchLoading && !searchError && !searchResults.length ? <p className="rounded-2xl border border-dashed border-sand-100 p-5 text-sm text-ink-500">No matching results. Try a campaign name, contact, activity, or setting.</p> : null}
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
