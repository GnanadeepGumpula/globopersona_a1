"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Progress } from "../../components/ui";
import { 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight, 
  HelpCircle,
  Calendar
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("Last 30 Days");

  // Telemetry mappings corresponding to Screenshot 2026-06-01 233118_2.jpg and Screenshot 2026-06-01 233201_2.jpg metrics
  const macroIndicators = [
    { label: "Campaign Performance", value: "+125%", description: "Increase in Conversions", detail: "vs previous campaigns", trend: "up", color: "#0B51C1" },
    { label: "Email Marketing ROI", value: "$42", description: "For every $1 spent", detail: "Average ROI +4,200%", trend: "up", color: "#2F855A" },
    { label: "Revenue Impact", value: "$178,540", description: "+28.6% Growth Multiplier", detail: "Calculated across past 5 operational weeks", trend: "up", color: "#002D72" }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-12 animate-fade-in">
      
      {/* Dynamic Filter Section Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#004AAD]">Performance Analytics Surface</h1>
          <p className="text-xs text-[#718096] mt-0.5">High-fidelity volumetric tracking and return parameters modeling.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] p-1 rounded-xl shadow-sm self-start">
          {["Last 7 Days", "Last 30 Days", "This Quarter", "Full Year"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                timeframe === t ? "bg-[#EBF8FF] text-[#0B51C1]" : "text-[#4A5568] hover:bg-[#F7FAFC]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top Graphic Panel Rows — Implements high contrast card layout blueprints */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Card 1: Conversion Multiplier Node (Ref: Screenshot 2026-06-01 233201_2.jpg Blue Card Display) */}
        <div className="bg-gradient-to-br from-[#002D72] via-[#004AAD] to-[#0B51C1] rounded-[24px] p-6 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold bg-white/10 text-white px-2.5 py-0.5 rounded-md tracking-wider uppercase border border-white/10">
                Conversion Engine
              </span>
              <TrendingUp size={16} className="text-white/60" />
            </div>
            <h2 className="text-xs font-semibold text-white/70 pt-3">Campaign Performance</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight">+125%</span>
              <span className="text-[10px] font-bold text-[#63B3ED]">In Conversions</span>
            </div>
          </div>

          {/* Precision Sparkline Area SVG Map */}
          <div className="h-20 w-full mt-6 bg-white/5 rounded-xl p-1 border border-white/10 overflow-hidden">
            <svg viewBox="0 0 300 80" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="blueSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#63B3ED" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#63B3ED" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0 70 Q 50 30 100 55 T 200 20 T 300 10 L 300 80 L 0 80 Z" fill="url(#blueSpark)" />
              <path d="M 0 70 Q 50 30 100 55 T 200 20 T 300 10" fill="none" stroke="#63B3ED" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="300" cy="10" r="3" fill="#white" />
            </svg>
          </div>
        </div>

        {/* Card 2: 92% Ring Vector Metric Card Panel (Ref: Screenshot 2026-06-01 233201_2.jpg Concentric Layout) */}
        <Card className="p-6 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <CardTitle className="text-sm">Engagement Multiplier</CardTitle>
              <CardDescription>Aggregate engagement velocity</CardDescription>
            </div>
            <Badge tone="green">Target Exceeded</Badge>
          </div>

          <div className="flex items-center justify-center py-4 gap-6">
            {/* Concentric Circle Progress Graph Shape Ring */}
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path className="text-[#EDF2F7]" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#0B51C1]" strokeDasharray="92, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 grid place-content-center text-center">
                <span className="text-2xl font-black text-[#1A202C] tracking-tighter">92%</span>
                <span className="text-[8px] uppercase tracking-wider font-bold text-[#718096]">Engagement</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#1A202C]">vs previous campaigns</p>
              <p className="text-[11px] text-[#718096] leading-snug">Calculated dynamic response rate tracking index based on total unique tracking link triggers.</p>
            </div>
          </div>
        </Card>

        {/* Card 3: Return Parameters (Ref: Screenshot 2026-06-01 233118_2.jpg ROI Card Display) */}
        <Card className="p-6 flex flex-col justify-between shadow-sm bg-gradient-to-b from-white to-[#F8FAFC]">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#718096]">Email Marketing ROI</h3>
              <p className="text-3xl font-extrabold text-[#002D72] tracking-tight mt-1">$42.00</p>
              <p className="text-[10px] text-[#4A5568] font-medium">Earned for every $1 spent configuration</p>
            </div>
            <div className="px-2.5 py-1 bg-[#F0FFF4] text-[#2F855A] font-bold text-xs rounded-full flex items-center gap-1">
              <ArrowUpRight size={12} /> 4,200%
            </div>
          </div>
          
          <div className="pt-4 border-t border-[#E2E8F0] space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-[#718096]">
              <span>Average Channel Yield</span>
              <span className="font-bold text-[#1A202C]">+14.2% MoM</span>
            </div>
            <Progress value={84} />
          </div>
        </Card>
      </div>

      {/* Main 3D Styled Graphics Grid Workspaces (Ref: Revenue Impact and Growth Overview plots from image layouts) */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Left Column: Volumetric Revenue Bars Plot (Ref: Screenshot 2026-06-01 233118_2.jpg Bar Representation) */}
        <Card className="lg:col-span-2 p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
            <div>
              <CardTitle className="text-base text-[#004AAD]">Revenue Impact Matrix</CardTitle>
              <CardDescription>Weekly sequential tracking yields ($)</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[#1A202C] tracking-tight">$178,540</p>
              <p className="text-[10px] text-[#2F855A] font-bold flex items-center gap-0.5 justify-end"><ArrowUpRight size={10}/> 28.6%</p>
            </div>
          </div>

          {/* High-Fidelity Bar Graph Array Generation */}
          <div className="h-64 flex items-end gap-4 sm:gap-6 pt-8 px-2 relative border border-[#E2E8F0] rounded-xl bg-gradient-to-t from-[#F8FAFC] to-white p-4">
            
            {/* Absolute Helper Coordinates Y-Axis Labels */}
            <div className="absolute left-3 top-3 bottom-12 flex flex-col justify-between text-[9px] font-bold text-[#A0AEC0] pointer-events-none">
              <span>$180K</span>
              <span>$120K</span>
              <span>$60K</span>
              <span>0</span>
            </div>

            {/* Generated Structural Bar Entities */}
            {[
              { label: "Week 1", val: 35, display: "$62,490" },
              { label: "Week 2", val: 58, display: "$103,500" },
              { label: "Week 3", val: 48, display: "$85,740" },
              { label: "Week 4", val: 72, display: "$128,600" },
              { label: "Week 5", val: 94, display: "$178,540" }
            ].map((bar, idx) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group z-10 pl-8">
                <div className="w-full relative rounded-t-lg transition-all duration-300 bg-gradient-to-t from-[#002D72] via-[#004AAD] to-[#0B51C1] group-hover:opacity-90 shadow-md" style={{ height: `${bar.val}%` }}>
                  {/* Floating Context Marker Tooltip on Hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A202C] text-white text-[9px] font-black px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow whitespace-nowrap z-30">
                    {bar.display}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#718096] tracking-tight">{bar.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: Dynamic Growth Trends Spline (Ref: Screenshot 2026-06-01 233201_2.jpg Growth Plot Layout) */}
        <Card className="p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="border-b border-[#E2E8F0] pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base text-[#004AAD]">Growth Overview</CardTitle>
                <CardDescription>Quarterly compounding summary</CardDescription>
              </div>
              <Badge tone="accent">78% Revenue Growth</Badge>
            </div>
          </div>

          {/* Spline Map Graph SVG */}
          <div className="h-44 w-full bg-gradient-to-br from-white to-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2 relative overflow-hidden">
            <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="splineGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B51C1" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0B51C1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 10 85 Q 40 70 70 50 T 130 35 T 190 15 L 190 100 L 10 100 Z" fill="url(#splineGlow)" />
              <path d="M 10 85 Q 40 70 70 50 T 130 35 T 190 15" fill="none" stroke="#0B51C1" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="190" cy="15" r="3" fill="#0B51C1" />
            </svg>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[8px] font-bold text-[#A0AEC0] uppercase tracking-wider px-1">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>

          {/* Conversion Micro Metrics Row Indicators */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#E2E8F0]">
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
              <p className="text-xs font-black text-[#1A202C]">3.6x</p>
              <p className="text-[9px] font-bold text-[#718096] tracking-tight mt-0.5">Conversion</p>
            </div>
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
              <p className="text-xs font-black text-[#1A202C]">45%</p>
              <p className="text-[9px] font-bold text-[#718096] tracking-tight mt-0.5">More Rev/User</p>
            </div>
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
              <p className="text-xs font-black text-[#1A202C]">28%</p>
              <p className="text-[9px] font-bold text-[#718096] tracking-tight mt-0.5">Lower CAC</p>
            </div>
          </div>
        </Card>
      </div>
      
    </div>
  );
}