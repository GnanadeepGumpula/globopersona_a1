"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, LayoutDashboard, MailPlus, Menu, Settings, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button } from "./ui";

const navigation = [
	{ href: "/", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/campaigns", label: "Campaigns", icon: MailPlus },
	{ href: "/contacts", label: "Contacts", icon: Users },
	{ href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	const activeSection = useMemo(() => {
		const current = navigation.find((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)));
		return current?.label ?? "Dashboard";
	}, [pathname]);

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
								<div className="w-[300px] rounded-2xl border border-sand-100 bg-sand-50 px-4 py-2 text-sm text-ink-500">Search campaigns, contacts, and automations</div>
								<button className="grid h-11 w-11 place-items-center rounded-2xl border border-sand-100 bg-white text-ink-700"><Bell size={17} /></button>
								<Button variant="primary" size="md">Create campaign</Button>
							</div>
						</div>
					</header>

					<main className="flex-1 px-4 py-6 xl:px-8">
						<div className="mx-auto w-full max-w-[1480px]">{children}</div>
					</main>
				</div>
			</div>
		</div>
	);
}
