import Link from "next/link";
import { ArrowRight, BarChart3, Mail, PhoneCall, PieChart, Sparkles, Zap } from "lucide-react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui";

const trend = [24, 32, 28, 41, 53, 47, 59, 64, 70, 82, 76, 88];
const bars = [72, 64, 88, 54, 78, 91];

function ChartLine() {
	const width = 720;
	const height = 220;
	const padding = 24;
	const step = (width - padding * 2) / (trend.length - 1);
	const max = Math.max(...trend);
	const path = trend.map((value, index) => {
		const x = padding + index * step;
		const y = height - padding - (value / max) * (height - padding * 2);
		return `${index === 0 ? "M" : "L"} ${x} ${y}`;
	}).join(" ");

	return (
		<svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" aria-label="Trend chart" role="img">
			<defs>
				<linearGradient id="helpTrendFill" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="rgba(11,81,193,0.28)" />
					<stop offset="100%" stopColor="rgba(11,81,193,0)" />
				</linearGradient>
			</defs>
			<path d={`${path} L ${padding + (trend.length - 1) * step} ${height - padding} L ${padding} ${height - padding} Z`} fill="url(#helpTrendFill)" />
			<path d={path} fill="none" stroke="#0B51C1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
			{trend.map((value, index) => {
				const x = padding + index * step;
				const y = height - padding - (value / max) * (height - padding * 2);
				return <circle key={index} cx={x} cy={y} r="5" fill="#0B51C1" />;
			})}
		</svg>
	);
}

export default function HelpPage() {
	return (
		<div className="space-y-6">
			<div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
				<Card className="overflow-hidden">
					<CardContent className="relative overflow-hidden p-8 text-white">
						<div className="absolute inset-0 bg-gradient-to-r from-[#0052D4] to-[#0B51C1]" />
						<div className="relative space-y-4">
							<Badge tone="accent">Help Center</Badge>
							<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Everything you need to learn, diagnose, and contact support.</h1>
							<p className="max-w-2xl text-base leading-7 text-white/85">Documentation, workflow guidance, reporting explanations, and support routes all live in one place with charts that summarize the current workspace health.</p>
							<div className="flex flex-wrap gap-3">
								<Link href="mailto:support@globopersona.com" className="inline-flex h-11 items-center justify-center rounded-[18px] bg-white px-5 text-sm font-semibold text-[#0B51C1]">Contact Support</Link>
								<Link href="/automation" className="inline-flex h-11 items-center justify-center rounded-[18px] border border-white/35 bg-white/10 px-5 text-sm font-semibold text-white">View Automation</Link>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div>
							<CardTitle>Support summary</CardTitle>
							<CardDescription>Key workspace signals and practical help shortcuts.</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						{[
							{ label: "Live docs", value: "128", icon: BarChart3 },
							{ label: "Open tickets", value: "4", icon: Mail },
							{ label: "Resolved this week", value: "31", icon: Sparkles }
						].map((item) => (
							<div key={item.label} className="flex items-center justify-between rounded-[22px] border border-[#E2E8F0] bg-white p-4">
								<div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#EBF8FF] text-[#0B51C1]"><item.icon size={16} /></div><div><p className="font-semibold text-[#1A202C]">{item.label}</p><p className="text-sm text-[#718096]">Workspace support signal</p></div></div>
								<p className="text-2xl font-bold text-[#1A202C]">{item.value}</p>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
				<Card>
					<CardHeader>
						<div>
							<CardTitle>Graph analysis</CardTitle>
							<CardDescription>Campaign and audience movement at a glance.</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-5">
						<div className="rounded-[22px] border border-[#E2E8F0] bg-white p-4"><div className="h-56 rounded-[18px] bg-[#F9FBFF] p-2"><ChartLine /></div></div>
						<div className="grid gap-3 sm:grid-cols-3">
							{[
								{ label: "Retention", value: "84%" },
								{ label: "CTR", value: "5.4%" },
								{ label: "Inbox score", value: "93%" }
							].map((item) => <div key={item.label} className="rounded-[22px] border border-[#E2E8F0] bg-[#F9FBFF] p-4"><p className="text-sm text-[#718096]">{item.label}</p><p className="mt-2 text-2xl font-bold text-[#1A202C]">{item.value}</p></div>)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div>
							<CardTitle>Contact us</CardTitle>
							<CardDescription>Fast routes for support, onboarding, and product feedback.</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="rounded-[22px] border border-[#E2E8F0] bg-white p-4"><div className="flex items-center gap-3"><Mail size={18} className="text-[#0B51C1]" /><div><p className="font-semibold text-[#1A202C]">support@globopersona.com</p><p className="text-sm text-[#718096]">Technical and account support</p></div></div></div>
						<div className="rounded-[22px] border border-[#E2E8F0] bg-white p-4"><div className="flex items-center gap-3"><PhoneCall size={18} className="text-[#0B51C1]" /><div><p className="font-semibold text-[#1A202C]">+1 (555) 014-2901</p><p className="text-sm text-[#718096]">Mon-Fri, 9am-5pm local time</p></div></div></div>
						<div className="rounded-[22px] border border-[#E2E8F0] bg-white p-4"><div className="flex items-center gap-3"><PieChart size={18} className="text-[#0B51C1]" /><div><p className="font-semibold text-[#1A202C]">Reporting help</p><p className="text-sm text-[#718096]">Understand opens, clicks, and delivery health metrics.</p></div></div></div>
						<Link href="mailto:support@globopersona.com" className="inline-flex h-11 items-center justify-center rounded-[18px] bg-[#0B51C1] px-5 text-sm font-semibold text-white">Send a support email <ArrowRight size={16} /></Link>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<div><CardTitle>Usage analytics</CardTitle><CardDescription>Bar charts for activity and trend overview.</CardDescription></div>
				</CardHeader>
				<CardContent>
					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
						{bars.map((value, index) => (
							<div key={index} className="rounded-[22px] border border-[#E2E8F0] bg-white p-4">
								<div className="flex items-end gap-2">
									<div className="h-32 flex-1 rounded-[14px] bg-[#F4F7FC]">
										<div className="h-full rounded-[14px] bg-gradient-to-t from-[#0B51C1] to-[#0052D4]" style={{ height: `${value}%` }} />
									</div>
								</div>
								<p className="mt-3 text-sm text-[#718096]">Segment {index + 1}</p>
								<p className="text-2xl font-bold text-[#1A202C]">{value}%</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
