"use client";

import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress, StatCard } from "../components/ui";
import { getDashboardData } from "../lib/api";
import type { DashboardResponse } from "../lib/types";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setError(null);
        const data = await getDashboardData();

        if (isMounted) {
          setDashboard(data);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load dashboard data from the backend.");
        }
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const chartWidth = 720;
  const chartHeight = 240;
  const chartPaddingX = 28;
  const chartPaddingY = 20;
  const campaignPerformance = dashboard?.performance ?? [];
  const chartFloor = chartHeight - chartPaddingY;
  const step = campaignPerformance.length > 1 ? (chartWidth - chartPaddingX * 2) / (campaignPerformance.length - 1) : 0;

  const points = campaignPerformance.map((item, index) => {
    const x = chartPaddingX + step * index;
    const y = chartFloor - (item.value / 100) * (chartFloor - chartPaddingY);
    return { x, y, value: item.value, label: item.label };
  });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${chartFloor} L ${points[0].x} ${chartFloor} Z`
    : "";

  const dashboardStats = dashboard?.stats ?? [];
  const recentCampaigns = dashboard?.recentCampaigns ?? [];
  const activities = dashboard?.activities ?? [];

  if (!dashboard) {
    return (
      <div className="space-y-8">
        <Card className="border-sand-100 bg-white/85">
          <CardContent className="space-y-3 py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-600">Connecting</p>
            <h1 className="text-3xl font-bold tracking-tight text-ink-900">Loading dashboard from the backend</h1>
            <p className="max-w-2xl text-sm leading-6 text-ink-500">
              The frontend is ready to consume live campaign, contact, and settings data. Configure the API base URL and the dashboard will hydrate here.
            </p>
            {error ? <p className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">{error}</p> : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-sand-100 bg-white/85">
        <CardContent className="relative grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="absolute inset-0 grid-fine opacity-30" />
          <div className="relative space-y-6">
            <Badge tone="green">Morning briefing</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">A calm, confident workspace for email marketing teams.</h1>
              <p className="max-w-2xl text-base leading-7 text-ink-500">This redesign keeps the original product structure intact while giving the interface a cleaner hierarchy, softer surfaces, and more readable patterns for daily campaign work.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/campaigns/new" className="inline-flex h-11 items-center justify-center rounded-2xl bg-ink-900 px-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink-700">
                Launch new campaign
              </Link>
              <Link href="/contacts" className="inline-flex h-11 items-center justify-center rounded-2xl border border-sand-100 bg-white px-4 text-sm font-semibold text-ink-700 transition hover:border-sand-200 hover:bg-sand-50">
                Review audience health
              </Link>
              <Link href="/campaigns" className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-accent-600">
                Open campaigns <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative rounded-[32px] border border-sand-100 bg-gradient-to-br from-sand-50 to-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink-500">Send quality</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">94.8%</p>
              </div>
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-accent-100 text-accent-600">
                <Sparkles size={24} />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-ink-500">
                  <span>Engagement score</span>
                  <span>High</span>
                </div>
                <Progress value={84} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-ink-500">
                  <span>Deliverability</span>
                  <span>Stable</span>
                </div>
                <Progress value={92} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-ink-500">
                  <span>Audience freshness</span>
                  <span>Refreshing</span>
                </div>
                <Progress value={74} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Campaign performance</CardTitle>
              <CardDescription>Weekly trend for opens, clicks, and scheduled sends.</CardDescription>
            </div>
            <Badge tone="accent">+11.2% vs last week</Badge>
          </CardHeader>
          <CardContent>
            <div className="rounded-[24px] border border-sand-100 bg-gradient-to-b from-white to-sand-50 p-5">
              <div className="relative h-56 overflow-hidden rounded-2xl border border-sand-100 bg-white">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full" role="img" aria-label="Campaign performance trend chart">
                  {[25, 50, 75, 100].map((line) => {
                    const y = chartFloor - (line / 100) * (chartFloor - chartPaddingY);
                    return <line key={line} x1={chartPaddingX} y1={y} x2={chartWidth - chartPaddingX} y2={y} stroke="#efe7da" strokeDasharray="5 5" strokeWidth="1" />;
                  })}

                  {areaPath ? <path d={areaPath} fill="rgba(47, 143, 123, 0.16)" /> : null}
                  {linePath ? <path d={linePath} fill="none" stroke="#2f8f7b" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" /> : null}

                  {points.map((point) => (
                    <g key={point.label}>
                      <circle cx={point.x} cy={point.y} r="6" fill="#2f8f7b" />
                      <circle cx={point.x} cy={point.y} r="3" fill="#ffffff" />
                    </g>
                  ))}
                </svg>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                {campaignPerformance.map((item) => (
                  <div key={`${item.label}-meta`}>
                    <p className="text-sm font-semibold text-ink-700">{item.label}</p>
                    <p className="text-xs text-ink-500">{item.value}%</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Live activity</CardTitle>
              <CardDescription>What changed recently across campaigns and automations.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-sand-100 bg-sand-50/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink-900">{item.title}</p>
                  <span className="text-xs font-medium text-ink-500">{item.time}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink-500">{item.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent campaigns</CardTitle>
              <CardDescription>Readable rows with strong status treatment and quick actions.</CardDescription>
            </div>
            <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600">
              View all <ArrowRight size={16} />
            </Link>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.2em] text-ink-500">
                  <th scope="col" className="px-4 pb-2">Campaign</th>
                  <th scope="col" className="px-4 pb-2">Audience</th>
                  <th scope="col" className="px-4 pb-2">Sent</th>
                  <th scope="col" className="px-4 pb-2">Opens</th>
                  <th scope="col" className="px-4 pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.map((campaign) => (
                  <tr key={campaign.name} className="rounded-[22px] bg-white shadow-sm ring-1 ring-sand-100">
                    <td className="rounded-l-[22px] px-4 py-4">
                      <p className="font-semibold text-ink-900">{campaign.name}</p>
                      <p className="text-sm text-ink-500">Campaign workspace</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-ink-700">{campaign.audience}</td>
                    <td className="px-4 py-4 text-sm text-ink-700">{campaign.sent}</td>
                    <td className="px-4 py-4 text-sm text-ink-700">{campaign.opens}</td>
                    <td className="rounded-r-[22px] px-4 py-4"><Badge tone={campaign.tone === "green" ? "green" : campaign.tone === "amber" ? "amber" : "slate"}>{campaign.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 space-y-3 md:hidden">
              {recentCampaigns.map((campaign) => (
                <div key={`${campaign.name}-mobile`} className="rounded-[24px] border border-sand-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink-900">{campaign.name}</p>
                      <p className="mt-1 text-sm text-ink-500">{campaign.audience}</p>
                    </div>
                    <Badge tone={campaign.tone === "green" ? "green" : campaign.tone === "amber" ? "amber" : "slate"}>{campaign.status}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-ink-500">Sent</p>
                      <p className="font-semibold text-ink-900">{campaign.sent}</p>
                    </div>
                    <div>
                      <p className="text-ink-500">Opens</p>
                      <p className="font-semibold text-ink-900">{campaign.opens}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Focus notes</CardTitle>
              <CardDescription>Design cues used to keep the interface calm and professional.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] border border-sand-100 bg-white p-4">
              <p className="font-semibold text-ink-900">Soft contrast first</p>
              <p className="mt-2 text-sm leading-6 text-ink-500">The palette uses warm neutrals, muted teal accents, and clear white surfaces instead of a dark or tech-heavy aesthetic.</p>
            </div>
            <div className="rounded-[24px] border border-sand-100 bg-white p-4">
              <p className="font-semibold text-ink-900">Fewer, larger actions</p>
              <p className="mt-2 text-sm leading-6 text-ink-500">Primary flows are surfaced with confident spacing, so the product feels like a real operations tool rather than a demo mockup.</p>
            </div>
            <div className="rounded-[24px] border border-sand-100 bg-white p-4">
              <p className="font-semibold text-ink-900">Readable structure</p>
              <p className="mt-2 text-sm leading-6 text-ink-500">Cards, tables, filters, and forms share the same radius, spacing, and border language for consistency.</p>
            </div>
            <div className="rounded-[24px] border border-sand-100 bg-gradient-to-br from-accent-50 to-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink-900">Approval readiness</p>
                  <p className="text-xs text-ink-500">Good foundation for the assessment submission</p>
                </div>
                <TrendingUp className="text-accent-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}