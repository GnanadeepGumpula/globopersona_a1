import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { activities, campaignPerformance, dashboardStats, recentCampaigns } from "../data/mock-data";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress, StatCard } from "../components/ui";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-sand-100 bg-white/85">
        <CardContent className="relative grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="absolute inset-0 grid-fine opacity-30" />
          <div className="relative space-y-6">
            <Badge tone="green">Morning briefing</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">A calm, confident workspace for email marketing teams.</h1>
              <p className="max-w-2xl text-base leading-7 text-ink-500">This redesign keeps the original product structure intact while giving the interface a cleaner hierarchy, softer surfaces, and more readable patterns for daily campaign work.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>Launch new campaign</Button>
              <Button variant="neutral">Review audience health</Button>
              <Link href="/campaigns" className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-accent-600">
                Open campaigns <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative rounded-[32px] border border-sand-100 bg-gradient-to-br from-sand-50 to-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink-500">Send quality</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-ink-900">94.8%</p>
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
            <div className="flex h-72 items-end gap-3 rounded-[24px] border border-sand-100 bg-gradient-to-b from-white to-sand-50 p-5">
              {campaignPerformance.map((item) => (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex w-full flex-1 items-end">
                    <div className="w-full rounded-t-3xl bg-gradient-to-t from-accent-600 to-accent-400 shadow-sm" style={{ height: `${item.value}%` }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-ink-700">{item.label}</p>
                    <p className="text-xs text-ink-500">{item.value}%</p>
                  </div>
                </div>
              ))}
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
                  <th className="px-4 pb-2">Campaign</th>
                  <th className="px-4 pb-2">Audience</th>
                  <th className="px-4 pb-2">Sent</th>
                  <th className="px-4 pb-2">Opens</th>
                  <th className="px-4 pb-2">Status</th>
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