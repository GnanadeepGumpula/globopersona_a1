"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Zap } from "lucide-react";
import { Badge, Card, CardDescription, CardTitle } from "../../components/ui";
import { getDashboardData } from "../../lib/api";
import type { DashboardResponse } from "../../lib/types";

function buildLineChart(pathPoints: { label: string; value: number }[], width = 420, height = 180) {
  if (!pathPoints.length) {
    return { points: [], path: "", areaPath: "" };
  }

  const maxValue = Math.max(...pathPoints.map((point) => point.value), 1);
  const points = pathPoints.map((point, index) => {
    const x = 18 + (index / Math.max(pathPoints.length - 1, 1)) * (width - 36);
    const y = height - 24 - (point.value / maxValue) * (height - 48);
    return { x, y, label: point.label, value: point.value };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  const areaPath = `${path} L ${points[points.length - 1].x.toFixed(2)} ${height - 12} L ${points[0].x.toFixed(2)} ${height - 12} Z`;

  return { points, path, areaPath };
}

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("Last 7 Days");
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const payload = await getDashboardData();
      if (mounted) {
        setData(payload);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const rangeOptions = ["Last 7 Days", "Last 30 Days"];
  const performanceChart = buildLineChart(data?.performance ?? []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#004AAD]">Performance analytics</h1>
          <p className="text-xs text-[#718096] mt-0.5">Live performance metrics pulled from the backend workspace.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] p-1 rounded-xl shadow-sm self-start">
          {rangeOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTimeframe(option)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${timeframe === option ? "bg-[#EBF8FF] text-[#0B51C1]" : "text-[#4A5568] hover:bg-[#F7FAFC]"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="bg-gradient-to-br from-[#002D72] via-[#004AAD] to-[#0B51C1] rounded-[24px] p-6 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold bg-white/10 text-white px-2.5 py-0.5 rounded-md tracking-wider uppercase border border-white/10">
                Campaign performance
              </span>
              <TrendingUp size={16} className="text-white/60" />
            </div>
            <h2 className="text-xs font-semibold text-white/70 pt-3">Live backend score</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight">{data?.overview?.trackingScores?.trackingScore ?? 0}%</span>
              <span className="text-[10px] font-bold text-[#63B3ED]">tracking score</span>
            </div>
          </div>
          <div className="mt-4 rounded-[16px] border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
            <svg viewBox="0 0 420 180" className="w-full h-36" preserveAspectRatio="none">
              <path d={performanceChart.areaPath} fill="rgba(255,255,255,0.16)" />
              <path d={performanceChart.path} stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="chart-line" />
              {performanceChart.points.map((point) => (
                <circle key={`${point.label}-${point.value}`} cx={point.x} cy={point.y} r="3.4" fill="#ffffff" stroke="#7DD3FC" strokeWidth="2" className="soft-float" />
              ))}
            </svg>
          </div>
        </div>

        <Card className="p-6 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <CardTitle className="text-sm">Engagement multiplier</CardTitle>
              <CardDescription>Audience engagement from the live dashboard summary</CardDescription>
            </div>
            <Badge tone="green">Synced</Badge>
          </div>
          <div className="flex items-center justify-center py-4 gap-6">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path className="text-[#EDF2F7]" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#0B51C1]" strokeDasharray={`${data?.overview?.engagementScore ?? 0}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 grid place-content-center text-center">
                <span className="text-2xl font-black text-[#1A202C] tracking-tighter">{data?.overview?.engagementScore ?? 0}%</span>
                <span className="text-[8px] uppercase tracking-wider font-bold text-[#718096]">Engagement</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#1A202C]">Live workspace activity</p>
              <p className="text-[11px] text-[#718096] leading-snug">The backend returns the current engagement rate, delivery rates, and campaign counts for this workspace.</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-between shadow-sm bg-gradient-to-b from-white to-[#F8FAFC]">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#718096]">Latest reach</h3>
              <p className="text-3xl font-extrabold text-[#002D72] tracking-tight mt-1">{data?.stats.find((item) => item.label === "Contacts")?.value ?? 0}</p>
              <p className="text-[10px] text-[#4A5568] font-medium">Contacts connected to the workspace</p>
            </div>
            <div className="px-2.5 py-1 bg-[#F0FFF4] text-[#2F855A] font-bold text-xs rounded-full flex items-center gap-1">
              <Zap size={12} /> Live
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
            <div>
              <CardTitle className="text-base text-[#004AAD]">Workspace metrics</CardTitle>
              <CardDescription>{timeframe} snapshot from the backend</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[#1A202C] tracking-tight">{data?.stats.find((item) => item.label === "Campaigns")?.value ?? 0}</p>
              <p className="text-[10px] text-[#2F855A] font-bold flex items-center gap-0.5 justify-end">{data?.stats.find((item) => item.label === "Campaigns")?.change ?? "0 sent"}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[16px] border border-[#E2E8F0] p-4">
              <div className="flex items-center gap-2 text-[#0B51C1]">
                <BarChart3 size={16} />
                <p className="text-xs font-bold uppercase tracking-wider">Campaign reach</p>
              </div>
              <p className="mt-3 text-2xl font-black text-[#1A202C]">{data?.stats.find((item) => item.label === "Campaigns")?.value ?? 0}</p>
              <p className="text-[11px] text-[#718096]">Current campaign count in the workspace</p>
            </div>
            <div className="rounded-[16px] border border-[#E2E8F0] p-4">
              <div className="flex items-center gap-2 text-[#0B51C1]">
                <TrendingUp size={16} />
                <p className="text-xs font-bold uppercase tracking-wider">Contact health</p>
              </div>
              <p className="mt-3 text-2xl font-black text-[#1A202C]">{data?.stats.find((item) => item.label === "Contacts")?.value ?? 0}</p>
              <p className="text-[11px] text-[#718096]">Total contacts currently stored</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="border-b border-[#E2E8F0] pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base text-[#004AAD]">Latest delivery</CardTitle>
                <CardDescription>Current backend metrics</CardDescription>
              </div>
              <Badge tone="accent">{data?.overview?.deliverability ?? 0}%</Badge>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Delivery rate</p>
              <p className="mt-1 text-xl font-black text-[#1A202C]">{data?.overview?.deliverability ?? 0}%</p>
            </div>
            <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Audience freshness</p>
              <p className="mt-1 text-xl font-black text-[#1A202C]">{data?.overview?.audienceFreshness ?? 0}%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}