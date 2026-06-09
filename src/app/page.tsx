"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, TrendingUp, Users, Mail, MousePointer, Zap, Award, MoreHorizontal } from "lucide-react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress, Toast } from "../components/ui";

interface PerformancePoint {
  label: string;
  value: number;
}

interface CampaignStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

interface RecentCampaignRow {
  id: string;
  name: string;
  subject: string;
  audience: string;
  sent: number;
  opens: string;
  clicks: string;
  status: "Sent" | "Scheduled" | "Draft";
}

interface TopPerformingCampaignRow {
  rank: number;
  name: string;
  openRate: string;
  clicks: string;
}

interface DashboardData {
  stats: CampaignStat[];
  performance: PerformancePoint[];
  recentCampaigns: RecentCampaignRow[];
  topPerformingCampaigns: TopPerformingCampaignRow[];
  overview: {
    deliverability: number;
    engagementScore: number;
    audienceFreshness: number;
  };
}

export default function DashboardPage() {
  const router = useRouter(); // FIXED: Initialized next/navigation router to process table row clicks
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "green" | "coral" } | null>(null);

  useEffect(() => {
    const mockHydratedPayload: DashboardData = {
      stats: [
        { label: "Total Subscribers", value: "10", change: "+4.2%", trend: "up", icon: Users },
        { label: "Open Rate", value: "59.8%", change: "+8.4%", trend: "up", icon: Mail },
        { label: "Click Rate", value: "11.5%", change: "-1.2%", trend: "down", icon: Zap },
        { label: "Total Campaigns", value: "3", change: "+2.0%", trend: "up", icon: MousePointer }
      ],
      performance: [
        { label: "Week 1", value: 78 },
        { label: "Week 2", value: 42 },
        { label: "Week 3", value: 15 },
        { label: "Week 4", value: 15 }
      ],
      recentCampaigns: [
        { id: "camp_1", name: "Customer Re-engagement", subject: "We've missed you", audience: "All Subscribers", sent: 0, opens: "0", clicks: "0", status: "Draft" },
        { id: "camp_2", name: "Black Friday Showcase", subject: "Up to 40% — only this week", audience: "Active Leads", sent: 0, opens: "0", clicks: "0", status: "Draft" },
        { id: "camp_3", name: "Weekly Digest #14", subject: "Inside this week: deliverability wins", audience: "Newsletter List", sent: 6800, opens: "3,120", clicks: "580", status: "Sent" },
        { id: "camp_4", name: "Spring Product Launch", subject: "Meet Persona v4 — your audience, elevated", audience: "VIP Customers", sent: 12500, opens: "8,420", clicks: "1,632", status: "Sent" }
      ],
      topPerformingCampaigns: [
        { rank: 1, name: "Spring Product Launch", openRate: "67.36%", clicks: "1,632" },
        { rank: 2, name: "Weekly Digest #14", openRate: "45.88%", clicks: "580" },
        { rank: 3, name: "Holiday Segment Blast", openRate: "39.12%", clicks: "412" },
        { rank: 4, name: "Onboarding Sequence #1", openRate: "34.50%", clicks: "190" }
      ],
      overview: {
        deliverability: 98.4,
        engagementScore: 100,
        audienceFreshness: 90
      }
    };

    setTimeout(() => {
      setData(mockHydratedPayload);
      setToast({ message: "Workspace telemetry successfully synced.", tone: "green" });
    }, 4000);
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
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white rounded-[20px] border border-[#E2E8F0] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-12 animate-fade-in">
      
      {/* UPDATED: Two-column grid integrating the glassmorphic card component modeled from Screenshot 2026-06-09 152630.png */}
      <div className="bg-gradient-to-r from-[#002D72] via-[#0052D4] to-[#0B51C1] rounded-[24px] p-6 sm:p-8 text-white relative shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side Content Segment */}
        <div className="lg:col-span-7 space-y-4 relative z-10">
          <span className="text-[10px] font-bold tracking-[0.2em] bg-white/10 px-3 py-1 rounded-full uppercase border border-white/20 inline-block">
            Elevate Your Email Marketing Strategy
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-xl leading-tight">
            Welcome back to Globo Persona
          </h1>
          <p className="text-sm text-white/80 max-w-lg font-medium leading-relaxed">
            Here's an overview of your email marketing.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/campaigns/new">
              <button className="h-10 px-5 rounded-xl bg-white text-[#0B51C1] text-xs font-bold shadow-sm hover:bg-[#F4F7FC] transition-all flex items-center gap-1.5 active:scale-95">
                New Campaign <ArrowRight size={14} />
              </button>
            </Link>
            <Link href="/contacts">
              <button className="h-10 px-5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all active:scale-95">
                Audience
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side Glassmorphic Card Segment (Modeled after Screenshot 2026-06-09 152630.png) */}
        <div className="lg:col-span-5 relative z-10 w-full max-w-md mx-auto">
          <div className="bg-[#031533]/40 border border-white/15 rounded-[20px] p-5 backdrop-blur-md shadow-2xl relative text-white select-none">
            
            {/* Top Identity Header Row */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center font-black text-xs text-white">G</div>
                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-white/90 leading-none">Globo Persona</h4>
                  <p className="text-[8px] text-white/50 font-semibold mt-0.5">Path To Perfect Client Connections.</p>
                </div>
              </div>
              <MoreHorizontal size={14} className="text-white/60" />
            </div>

            {/* Split Metrics Sections */}
            <div className="grid grid-cols-12 gap-4 items-center">
              
              {/* Left Column: Conversions Metric & Line Wave */}
              <div className="col-span-7 space-y-2 border-r border-white/10 pr-2">
                <p className="text-[10px] font-bold text-white/70 tracking-wide">Campaign Performance</p>
                <div className="space-y-0.5">
                  <p className="text-3xl font-black text-white tracking-tight">+125%</p>
                  <p className="text-[9px] font-bold text-blue-400">Increase in Conversions</p>
                </div>
                
                {/* Glowing Wave SVG line */}
                <div className="h-14 w-full relative pt-2">
                  <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <path d="M0 35 Q15 25 30 30 T60 15 T90 5" fill="none" stroke="#2b6cb0" strokeWidth="1" opacity="0.3"/>
                    <path d="M0 35 Q15 25 30 30 T60 15 T90 5" fill="none" stroke="#3182ce" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="90" cy="5" r="2.5" fill="white" className="animate-ping"/>
                    <circle cx="90" cy="5" r="1.5" fill="white"/>
                  </svg>
                </div>
              </div>

              {/* Right Column: Circular Progress Ring Indicator */}
              <div className="col-span-5 flex flex-col items-center justify-center text-center pl-1">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-blue-500" strokeWidth="3" strokeDasharray="92, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                    <span className="text-sm font-black text-white">92%</span>
                    <span className="text-[7px] text-white/60 font-medium scale-90 mt-0.5">Engagement</span>
                  </div>
                </div>
                <p className="text-[8px] text-white/40 font-bold tracking-tight uppercase mt-3">vs previous campaigns</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modern High-Contrast Stat Cards Row */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between min-h-[120px]">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#EBF8FF] text-[#0B51C1] grid place-items-center">
                  <Icon size={20} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.trend === "up" ? "text-[#2F855A] bg-[#F0FFF4]" : "text-[#C53030] bg-[#FFF5F5]"}`}>
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

      {/* Layout Data Visualization Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Performance Chart Panel */}
        <Card className="lg:col-span-2 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Opens across recent sends</CardDescription>
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
            <span className="absolute left-4 bottom-2 text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider">peak 8,420 opens</span>
          </div>
        </Card>

        {/* Right Telemetry Panel */}
        <Card className="p-6 space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <CardTitle>Send Quality Telemetry</CardTitle>
            <CardDescription>Live deliverability indicators</CardDescription>
          </div>

          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#4A5568]">Engagement Score</span>
                <span className="text-[#0B51C1]">{data.overview.engagementScore}/100</span>
              </div>
              <Progress value={data.overview.engagementScore} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#4A5568]">Deliverability Rate</span>
                <span className="text-[#0B51C1]">{data.overview.deliverability}%</span>
              </div>
              <Progress value={data.overview.deliverability} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#4A5568]">Audience Freshness</span>
                <span className="text-[#0B51C1]">{data.overview.audienceFreshness}%</span>
              </div>
              <Progress value={data.overview.audienceFreshness} />
            </div>
          </div>
        </Card>
      </div>

      {/* Lower Recent Workspace Logs Tables */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent Send Actions */}
        <Card className="lg:col-span-2 p-6">
          <div className="border-b border-[#E2E8F0] pb-4 mb-4">
            <CardTitle>Recent Campaigns</CardTitle>
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
                  <tr 
                    key={row.id} 
                    onClick={() => router.push(`/campaigns/${row.id}`)} // FIXED: router.push resolves page redirection flawlessly now
                    className="hover:bg-[#F8FAFC]/80 transition cursor-pointer group"
                  >
                    <td className="p-3 pl-4">
                      <p className="font-bold text-[#1A202C] group-hover:text-[#0B51C1] transition-colors">{row.name}</p>
                      <p className="text-[11px] text-[#718096] mt-0.5">{row.subject}</p>
                    </td>
                    <td className="p-3 text-right font-semibold">{row.sent.toLocaleString()}</td>
                    <td className="p-3 text-right font-semibold">{row.opens}</td>
                    <td className="p-3 text-right font-semibold">{row.clicks}</td>
                    <td className="p-3 pr-4">
                      <Badge tone={row.status === "Sent" ? "green" : "slate"}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Performing Campaigns Panel Leaderboard */}
        <Card className="p-6 space-y-4">
          <div className="border-b border-[#E2E8F0] pb-4">
            <CardTitle className="flex items-center gap-2 text-[#004AAD]">
              <Award size={18} className="text-[#0B51C1]" /> Top Performing Campaigns
            </CardTitle>
            <CardDescription>Highest ranking subscriber open rates</CardDescription>
          </div>
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2">
            {data.topPerformingCampaigns.map((camp) => (
              <div key={camp.rank} className="flex items-center justify-between p-2.5 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC]/50 hover:bg-[#EEF4FF]/40 transition group">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md font-mono text-[11px] font-black grid place-items-center ${
                    camp.rank === 1 ? "bg-amber-100 text-amber-800" :
                    camp.rank === 2 ? "bg-slate-200 text-slate-800" :
                    "bg-[#EDF2F7] text-[#4A5568]"
                  }`}>
                    #{camp.rank}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1A202C] truncate max-w-[140px]">{camp.name}</p>
                    <p className="text-[10px] text-[#718096] font-medium">{camp.clicks} interactive clicks</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#2F855A] bg-[#F0FFF4] border border-[#C6F6D5] px-2 py-0.5 rounded-md">
                    {camp.openRate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {toast ? (
        <Toast 
          message={toast.message} 
          type={toast.tone === "coral" ? "error" : "success"} 
          onClose={() => setToast(null)} 
        />
      ) : null}
    </div>
  );
}