"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, MousePointer, TrendingUp, Users, Zap, Award, MoreHorizontal } from "lucide-react";
import { Badge, Card, CardDescription, CardTitle, Progress, Toast } from "../components/ui";
import { getDashboardData } from "../lib/api";
import type { DashboardResponse } from "../lib/types";

function getStatIcon(label: string) {
  switch (label) {
    case "Campaigns":
      return MousePointer;
    case "Contacts":
      return Users;
    case "Segments":
      return TrendingUp;
    default:
      return Mail;
  }
}

function buildLineChart(pathPoints: { label: string; value: number }[], width = 280, height = 120) {
  if (!pathPoints.length) {
    return { points: [], path: "", areaPath: "" };
  }

  const maxValue = Math.max(...pathPoints.map((point) => point.value), 1);
  const points = pathPoints.map((point, index) => {
    const x = 18 + (index / Math.max(pathPoints.length - 1, 1)) * (width - 36);
    const y = height - 18 - (point.value / maxValue) * (height - 36);
    return { x, y, label: point.label, value: point.value };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  const areaPath = `${path} L ${points[points.length - 1].x.toFixed(2)} ${height - 12} L ${points[0].x.toFixed(2)} ${height - 12} Z`;

  return { points, path, areaPath };
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "green" | "coral" } | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const payload = await getDashboardData();
        if (mounted) {
          setData(payload);
          setToast({ message: "Workspace data synced from the backend.", tone: "green" });
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard data.");
        }
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="p-6 border-[#FF4D4D]/20 bg-[#FFF5F5]">
          <p className="text-sm font-bold text-[#C53030]">Error: {error}</p>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="h-40 bg-white rounded-[24px] border border-[#E2E8F0] p-8 flex flex-col justify-center space-y-3 animate-pulse">
          <div className="h-6 bg-[#EDF2F7] rounded w-1/4" />
          <div className="h-4 bg-[#F7FAFC] rounded w-2/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="h-24 bg-white rounded-[20px] border border-[#E2E8F0] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const performanceChart = buildLineChart(data.performance);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-12 animate-fade-in">
      <div className="bg-gradient-to-r from-[#002D72] via-[#0052D4] to-[#0B51C1] rounded-[24px] p-6 sm:p-8 text-white relative shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4 relative z-10">
          <span className="text-[10px] font-bold tracking-[0.2em] bg-white/10 px-3 py-1 rounded-full uppercase border border-white/20 inline-block">
            Live workspace overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-xl leading-tight">
            Welcome back to Globo Persona
          </h1>
          <p className="text-sm text-white/80 max-w-lg font-medium leading-relaxed">
            Your latest campaign, contact, and activity data is now pulled directly from the connected backend.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/campaigns/new" className="h-10 px-5 rounded-xl bg-white text-[#0B51C1] text-xs font-bold shadow-sm hover:bg-[#F4F7FC] transition-all flex items-center gap-1.5 active:scale-95">
              New Campaign <ArrowRight size={14} />
            </Link>
            <Link href="/contacts" className="h-10 px-5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all active:scale-95 inline-flex items-center gap-2">
              <Users size={14} /> Audience
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative z-10 w-full max-w-md mx-auto">
          <div className="bg-[#031533]/40 border border-white/15 rounded-[20px] p-5 backdrop-blur-md shadow-2xl relative text-white select-none">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center font-black text-xs text-white">G</div>
                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-white/90 leading-none">Globo Persona</h4>
                  <p className="text-[8px] text-white/50 font-semibold mt-0.5">Connected to your Supabase workspace.</p>
                </div>
              </div>
              <MoreHorizontal size={14} className="text-white/60" />
            </div>
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-7 space-y-2 border-r border-white/10 pr-2">
                <p className="text-[10px] font-bold text-white/70 tracking-wide">Performance</p>
                <div className="space-y-0.5">
                  <p className="text-3xl font-black text-white tracking-tight">{data.overview?.trackingScores?.trackingScore ?? 0}%</p>
                  <p className="text-[9px] font-bold text-blue-400">Live tracking score</p>
                </div>
              </div>
              <div className="col-span-5 flex flex-col items-center justify-center text-center pl-1">
                <div className="w-full rounded-[16px] border border-white/15 bg-white/10 p-2.5 backdrop-blur-sm soft-glow">
                  <svg viewBox="0 0 280 120" className="w-full h-24" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="glassLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8DD3FF" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>
                    </defs>
                    <path d={performanceChart.areaPath} fill="rgba(255,255,255,0.14)" />
                    <path d={performanceChart.path} stroke="url(#glassLine)" strokeWidth="3.3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="chart-line" />
                    {performanceChart.points.map((point) => (
                      <circle key={`${point.label}-${point.value}`} cx={point.x} cy={point.y} r="3.2" fill="#ffffff" stroke="#7DD3FC" strokeWidth="2" className="soft-float" />
                    ))}
                  </svg>
                </div>
                <p className="text-[8px] text-white/40 font-bold tracking-tight uppercase mt-3">Live performance trend</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => {
          const Icon = getStatIcon(stat.label);
          return (
            <Card key={stat.label} className="p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between min-h-[120px]">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#EBF8FF] text-[#0B51C1] grid place-items-center">
                  <Icon size={20} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.tone === "accent" ? "text-[#2F855A] bg-[#F0FFF4]" : "text-[#C53030] bg-[#FFF5F5]"}`}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-[#1A202C] tracking-tight">{stat.value}</h3>
                <p className="text-xs font-bold text-[#718096] mt-0.5 tracking-wide">{stat.label}</p>
              </div>
            </Card>
          );
        })}
      </section>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <CardTitle>Campaign performance</CardTitle>
              <CardDescription>Recent activity from the connected workspace</CardDescription>
            </div>
            <Link href="/campaigns" className="text-xs font-bold text-[#0B51C1] hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="h-56 relative w-full border border-[#E2E8F0] rounded-[16px] bg-gradient-to-b from-white to-[#F8FAFC] overflow-hidden p-2">
            <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B51C1" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0B51C1" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              <path d="M 20 50 L 160 120 L 300 160 L 470 160 L 470 200 L 20 200 Z" fill="url(#chartGradient)" />
              <path d="M 20 50 L 160 120 L 300 160 L 470 160" fill="none" stroke="#0B51C1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="50" r="4" fill="white" stroke="#0B51C1" strokeWidth="2.5" />
              <circle cx="160" cy="120" r="4" fill="white" stroke="#0B51C1" strokeWidth="2.5" />
              <circle cx="300" cy="160" r="4" fill="white" stroke="#0B51C1" strokeWidth="2.5" />
              <circle cx="470" cy="160" r="4" fill="white" stroke="#0B51C1" strokeWidth="2.5" />
            </svg>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <CardTitle>Send quality</CardTitle>
            <CardDescription>Live deliverability indicators</CardDescription>
          </div>
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#4A5568]">Engagement score</span>
                <span className="text-[#0B51C1]">{data.overview?.engagementScore ?? 0}/100</span>
              </div>
              <Progress value={data.overview?.engagementScore ?? 0} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#4A5568]">Deliverability</span>
                <span className="text-[#0B51C1]">{data.overview?.deliverability ?? 0}%</span>
              </div>
              <Progress value={data.overview?.deliverability ?? 0} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#4A5568]">Audience freshness</span>
                <span className="text-[#0B51C1]">{data.overview?.audienceFreshness ?? 0}%</span>
              </div>
              <Progress value={data.overview?.audienceFreshness ?? 0} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="border-b border-[#E2E8F0] pb-4 mb-4">
            <CardTitle>Recent campaigns</CardTitle>
            <CardDescription>Latest transmission monitoring status logs</CardDescription>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="uppercase tracking-wider font-bold text-[#718096] border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="p-3 pl-4">Campaign</th>
                  <th className="p-3 text-right">Sent</th>
                  <th className="p-3 text-right">Opens</th>
                  <th className="p-3 text-right">Clicks</th>
                  <th className="p-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] font-medium text-[#4A5568]">
                {data.recentCampaigns.map((row) => (
                  <tr key={row.id} onClick={() => router.push(`/campaigns/${row.id}`)} className="hover:bg-[#F8FAFC]/80 transition cursor-pointer group">
                    <td className="p-3 pl-4">
                      <p className="font-bold text-[#1A202C] group-hover:text-[#0B51C1] transition-colors">{row.name}</p>
                      <p className="text-[11px] text-[#718096] mt-0.5">{row.subject ?? row.audience}</p>
                    </td>
                    <td className="p-3 text-right font-semibold">{row.sent}</td>
                    <td className="p-3 text-right font-semibold">{row.opens}</td>
                    <td className="p-3 text-right font-semibold">{row.clicks ?? "—"}</td>
                    <td className="p-3 pr-4">
                      <Badge tone={row.status === "Sent" || row.status === "Live" ? "green" : "slate"}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="border-b border-[#E2E8F0] pb-4">
            <CardTitle className="flex items-center gap-2 text-[#004AAD]">
              <Award size={18} className="text-[#0B51C1]" /> Recent activity
            </CardTitle>
            <CardDescription>Latest events recorded by the backend</CardDescription>
          </div>
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2">
            {data.activities.map((activity) => (
              <div key={`${activity.entityType}-${activity.title}`} className="rounded-xl border border-[#F1F5F9] bg-[#F8FAFC]/50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#1A202C]">{activity.title}</p>
                    <p className="text-[10px] text-[#718096] font-medium mt-1">{activity.detail}</p>
                  </div>
                  <span className="text-[10px] text-[#718096]">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {toast ? <Toast message={toast.message} type={toast.tone === "coral" ? "error" : "success"} onClose={() => setToast(null)} /> : null}
    </div>
  );
}