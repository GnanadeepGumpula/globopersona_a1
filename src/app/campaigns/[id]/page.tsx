"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Edit, Pause, Play, Trash2, Share2, Download, 
  Mail, Calendar, BarChart3, Clock, CheckCircle, Users, 
  Eye, Monitor, Smartphone, Sparkles, HelpCircle 
} from "lucide-react";
// FIXED: Changed alias path from '@/components/ui' to a pristine relative path matching your routing depth
import { Badge, Button, Card, CardContent } from "../../../components/ui";

// Hardcoded safe telemetry dataset to protect platform run stability
const mockCampaignRegistry = [
  { id: "camp_1", name: "Spring Launch 2026", subject: "✨ Big news inside", preheader: "A short teaser shown in inbox rows.", status: "sent", recipientCount: 14200, openRate: 64.2, clickRate: 22.8, conversionRate: 5.4, createdAt: "2026-05-12", updatedAt: "2026-06-01", htmlBody: "<h1>Hello {{first_name}}</h1><p style='color: #4A5568;'>Our major product drops are rolling live. Scale out node telemetry instantly.</p>" },
  { id: "camp_2", name: "Midsummer Retargeting", subject: "Flash Sale: 40% Off", preheader: "Act quick - code ends tonight.", status: "scheduled", recipientCount: 8500, openRate: 0, clickRate: 0, conversionRate: 0, createdAt: "2026-06-02", updatedAt: "2026-06-08", htmlBody: "<h1>Hey {{first_name}}</h1><p>Don't let your configuration credits expire. Claim your premium stack access wrapper bundle inside.</p>" }
];

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [campaign, setCampaign] = useState<typeof mockCampaignRegistry[0] | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"metrics" | "content">("metrics");
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const found = mockCampaignRegistry.find((c) => c.id === id);
    if (found) {
      setCampaign(found);
    } else if (id) {
      setCampaign({
          id: id,
          name: id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
          subject: "System Generated Channel Message",
          preheader: "Automated telemetry distribution pipe.",
          status: "draft",
          recipientCount: 1250,
          openRate: 45.2,
          clickRate: 12.4,
          conversionRate: 2.1,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          htmlBody: "<h1>Workspace Node Broadcast</h1><p>This tracking container encapsulates raw transactional distribution triggers.</p>"
      });
    }
  }, [id]);

  if (!campaign) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border border-[#E2E8F0] max-w-xl mx-auto my-12 p-8 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#EDF2F7] grid place-items-center mx-auto text-[#718096] animate-pulse">
          <Clock size={20} />
        </div>
        <h3 className="text-sm font-bold text-[#1A202C] mt-4">Assembling telemetry layer...</h3>
        <Link href="/campaigns" className="text-xs font-bold text-[#0B51C1] hover:underline mt-4 inline-block">
          ← Return to Campaigns Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 animate-fade-in font-sans">
      
      {/* Action Top Ribbon Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div className="flex items-center gap-4">
          <Link
            href="/campaigns"
            className="w-10 h-10 border border-[#DDE8FF] bg-white rounded-xl flex items-center justify-center text-[#718096] hover:text-[#0B51C1] hover:bg-[#EEF4FF] transition shadow-sm"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#004AAD]">{campaign.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                campaign.status === "sent" ? "bg-[#F0FFF4] text-[#2F855A] border-[#C6F6D5]" :
                campaign.status === "scheduled" ? "bg-[#EBF8FF] text-[#0B51C1] border-[#BEE3F8]" :
                "bg-[#F7FAFC] text-[#4A5568] border-[#E2E8F0]"
              }`}>
                {campaign.status}
              </span>
            </div>
            <p className="text-xs text-[#718096] mt-0.5 font-medium">ID Reference Token: <span className="font-mono bg-[#EDF2F7] px-1 py-0.5 rounded text-[#1A202C]">{campaign.id}</span></p>
          </div>
        </div>

        {/* Top Control Utility Triggers */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button title="Export Summary Manifest" className="w-10 h-10 border border-[#E2E8F0] bg-white text-[#718096] hover:text-[#1A202C] rounded-xl flex items-center justify-center transition shadow-sm">
            <Share2 size={14} />
          </button>
          <button title="Download HTML Source" className="w-10 h-10 border border-[#E2E8F0] bg-white text-[#718096] hover:text-[#1A202C] rounded-xl flex items-center justify-center transition shadow-sm">
            <Download size={14} />
          </button>
          <Link href="/campaigns/new" className="h-10 bg-[#002D72] hover:bg-[#0B51C1] text-white px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm shadow-[#002D72]/10">
            <Edit size={13} /> Edit Blueprint
          </Link>
        </div>
      </div>

      {/* Grid Architecture Execution Viewport Splitter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Main Telemetry View & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Component View Controllers Tabs Row */}
          <div className="flex bg-[#EDF2F7] p-1 rounded-xl w-64">
            <button
              onClick={() => setActiveTab("metrics")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "metrics" ? "bg-white text-[#0B51C1] shadow-sm" : "text-[#4A5568] hover:text-[#0B51C1]"}`}
            >
              Performance Logs
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "content" ? "bg-white text-[#0B51C1] shadow-sm" : "text-[#4A5568] hover:text-[#0B51C1]"}`}
            >
              Email Content Frame
            </button>
          </div>

          {activeTab === "metrics" ? (
            <div className="space-y-6">
              
              {/* Core Execution Control Status Panel */}
              <Card className="p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3">
                  <h3 className="font-bold text-sm text-[#004AAD] uppercase tracking-wider">Pipeline Operation Status</h3>
                  <Badge tone={isRunning ? "green" : "slate"}>{isRunning ? "Active Node" : "Paused Flow"}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl">
                    <p className="text-[#718096]">Ingested Timestamp</p>
                    <p className="text-sm font-bold text-[#1A202C] mt-1 flex items-center gap-1.5"><Calendar size={14} className="text-[#A0AEC0]"/> {new Date(campaign.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl">
                    <p className="text-[#718096]">Last Modification Yield</p>
                    <p className="text-sm font-bold text-[#1A202C] mt-1 flex items-center gap-1.5"><Clock size={14} className="text-[#A0AEC0]"/> {new Date(campaign.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant={isRunning ? "danger" : "primary"} 
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2 font-bold"
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? <Pause size={14}/> : <Play size={14}/>}
                    {isRunning ? "Pause Automation Link" : "Resume Dispatch Sync"}
                  </Button>
                  <button className="px-4 h-10 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl transition flex items-center justify-center">
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>

              {/* Dynamic Volumetric Matrix Displays */}
              {campaign.status === "sent" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[#002D72] to-[#004AAD] rounded-xl p-4 text-white shadow-sm">
                      <p className="text-[11px] opacity-80 uppercase font-bold tracking-wider">Total Evaluated Recipients</p>
                      <p className="text-2xl font-black tracking-tight mt-1">{campaign.recipientCount.toLocaleString()}</p>
                      <span className="text-[10px] opacity-70 block mt-2 flex items-center gap-0.5"><Users size={12}/> Target group population active</span>
                    </div>
                    <div className="bg-gradient-to-br from-[#004AAD] to-[#0B51C1] rounded-xl p-4 text-white shadow-sm">
                      <p className="text-[11px] opacity-80 uppercase font-bold tracking-wider">Unique Open Multiplier</p>
                      <p className="text-2xl font-black tracking-tight mt-1">{campaign.openRate}%</p>
                      <span className="text-[10px] opacity-70 block mt-2">Above standard baseline average yield</span>
                    </div>
                  </div>

                  {/* Progress Bars Telemetry Logs Grid */}
                  <Card className="p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-[#004AAD] uppercase tracking-wider">Conversion Yield Ratios</h3>
                    
                    {[
                      { label: "Inbox Open Rate Trigger", val: campaign.openRate, color: "bg-[#0B51C1]" },
                      { label: "Link Interaction Click Rate", val: campaign.clickRate, color: "bg-[#004AAD]" },
                      { label: "Functional Conversion Target Goal", val: campaign.conversionRate, color: "bg-[#2F855A]" }
                    ].map((bar) => (
                      <div key={bar.label} className="space-y-1.5 text-xs font-semibold text-[#1A202C]">
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A5568]">{bar.label}</span>
                          <span className="font-bold">{bar.val}%</span>
                        </div>
                        <div className="w-full bg-[#EDF2F7] h-2.5 rounded-full overflow-hidden">
                          <div className={`h-full ${bar.color} rounded-full transition-all duration-500`} style={{ width: `${bar.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>
              ) : (
                <Card className="p-8 text-center border border-dashed border-[#CBD5E1] bg-white rounded-2xl">
                  <div className="w-12 h-12 bg-[#EBF8FF] rounded-xl flex items-center justify-center text-[#0B51C1] mx-auto mb-3">
                    <BarChart3 size={20} />
                  </div>
                  <h4 className="text-xs font-bold text-[#1A202C]">Telemetry matrix pending</h4>
                  <p className="text-[11px] text-[#718096] max-w-xs mx-auto leading-normal mt-1">Analytical logs populate dynamically upon executing outbound campaign broadcast triggers.</p>
                </Card>
              )}
            </div>
          ) : (
            /* HTML CONTENT WORKSPACE PREVIEW */
            <Card className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl overflow-hidden flex flex-col h-[500px]">
              <div className="bg-[#1A202C] p-3 text-white flex items-center justify-between flex-shrink-0">
                <span className="text-[10px] font-mono font-bold text-[#A0AEC0]">Sandbox Viewport Simulation</span>
                <div className="flex bg-white/10 p-0.5 rounded-lg border border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setDevicePreview("desktop")}
                    className={`p-1.5 rounded transition ${devicePreview === "desktop" ? "bg-white text-[#1A202C]" : "text-white/60"}`}
                  >
                    <Monitor size={12} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setDevicePreview("mobile")}
                    className={`p-1.5 rounded transition ${devicePreview === "mobile" ? "bg-white text-[#1A202C]" : "text-white/60"}`}
                  >
                    <Smartphone size={12} />
                  </button>
                </div>
              </div>
              <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 py-2 text-[11px] text-[#4A5568] space-y-0.5 flex-shrink-0">
                <p><span className="font-bold text-[#1A202C]">Subject line:</span> {campaign.subject}</p>
                <p><span className="font-bold text-[#1A202C]">Preheader teaser:</span> {campaign.preheader}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-[#EDF2F7] grid place-items-center">
                <div 
                  className={`bg-white border border-[#E2E8F0] shadow p-6 rounded-xl prose max-w-none transition-all duration-300 min-h-[300px] text-sm ${
                    devicePreview === "mobile" ? "w-[340px]" : "w-full max-w-xl"
                  }`}
                  dangerouslySetInnerHTML={{ __html: campaign.htmlBody.replace("{{first_name}}", "Subscriber Partner") }}
                />
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN: Information Cards Panels */}
        <div className="space-y-6">
          
          {/* Summary Matrix Panel */}
          <div className="bg-gradient-to-br from-[#002D72] via-[#004AAD] to-[#0B51C1] rounded-[24px] p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl -mr-8 -mt-8" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-white/90 border-b border-white/10 pb-3 flex items-center gap-2">
              <Sparkles size={14}/> Campaign Parameters
            </h3>
            <div className="mt-4 space-y-4 text-xs font-medium">
              <div>
                <span className="opacity-75 block text-[10px] uppercase tracking-wide">Channel Context</span>
                <span className="font-bold text-sm block mt-0.5">Outbound Marketing Email</span>
              </div>
              <div>
                <span className="opacity-75 block text-[10px] uppercase tracking-wide">Target Audience List Size</span>
                <span className="font-bold text-sm block mt-0.5">{campaign.recipientCount.toLocaleString()} Entries</span>
              </div>
              <div>
                <span className="opacity-75 block text-[10px] uppercase tracking-wide">Execution Class Node</span>
                <span className="font-bold text-sm block mt-0.5">Rich HTML Editor Template</span>
              </div>
            </div>
          </div>

          {/* Quick Context Block */}
          <Card className="p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#1A202C] tracking-tight border-b border-[#F1F5F9] pb-2">System Log Details</h3>
            <div className="space-y-3 text-xs font-medium text-[#4A5568]">
              <div className="flex justify-between items-center border-b border-[#F8FAFC] pb-2">
                <span className="text-[#718096]">Created By</span>
                <span className="text-[#1A202C] font-bold">Admin Operator</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#F8FAFC] pb-2">
                <span className="text-[#718096]">Security Level</span>
                <span className="text-[#2F855A] font-bold flex items-center gap-1"><CheckCircle size={12}/> Production Verified</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#718096]">Dynamic Variables</span>
                <span className="text-[#0B51C1] font-bold bg-[#EBF8FF] px-1.5 py-0.5 rounded text-[10px]">{"{{first_name}}"}</span>
              </div>
            </div>
          </Card>

          {/* Help Center CTA Panel */}
          <div className="bg-[#FAFAFA] border border-[#E2E8F0] p-4 rounded-2xl flex items-start gap-3">
            <HelpCircle size={16} className="text-[#718096] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#1A202C]">Need tracking adjustment?</h4>
              <p className="text-[11px] text-[#718096] leading-normal">Review variables configuration layers or consult the <Link href="/help" className="text-[#0B51C1] font-bold hover:underline">Help Center</Link> guides.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}