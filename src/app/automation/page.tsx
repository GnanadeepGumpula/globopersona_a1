"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, GitBranch, Mail, Plus, Sparkles, Zap } from "lucide-react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui";
import { getCampaigns } from "../../lib/api";
import type { AudienceSegment, CampaignRow } from "../../lib/types";

const automationTemplates = [
  { id: "welcome", name: "Welcome Series", description: "Automatically send a sequence of emails to new subscribers", icon: Mail, complexity: "Simple" },
  { id: "abandoned", name: "Abandoned Cart", description: "Send reminders to customers who abandon their shopping carts", icon: Clock, complexity: "Medium" },
  { id: "reengagement", name: "Re-engagement Campaign", description: "Win back inactive subscribers with special offers", icon: Zap, complexity: "Medium" },
  { id: "birthday", name: "Birthday Email", description: "Send personalized offers on customer birthdays", icon: Mail, complexity: "Simple" },
  { id: "purchase_followup", name: "Purchase Follow-up", description: "Send thank you and upsell emails after purchases", icon: GitBranch, complexity: "Medium" },
  { id: "seasonal", name: "Seasonal Campaign", description: "Trigger campaigns based on seasons and holidays", icon: Clock, complexity: "Complex" }
];

const steps = [
  "Define the trigger that starts the workflow",
  "Create actions, delays, and email sends",
  "Monitor performance with tracking metrics"
];

export default function AutomationPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [segments, setSegments] = useState<AudienceSegment[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [campaignResponse, segmentsResponse] = await Promise.all([getCampaigns({ limit: 10 }), fetch("/api/segments").then((response) => response.json())]);
      if (mounted) {
        setCampaigns(campaignResponse.items ?? []);
        setSegments((segmentsResponse?.data ?? []) as AudienceSegment[]);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const activeAutomations = campaigns.filter((campaign) => campaign.status === "Live" || campaign.status === "Scheduled");

  return (
    <div className="space-y-6">
      {activeAutomations.length > 0 ? (
        <Card>
          <CardHeader>
            <div><CardTitle>Active automations</CardTitle><CardDescription>Live campaigns currently available in the workspace.</CardDescription></div>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAutomations.map((automation) => (
              <div key={automation.id} className="flex items-center justify-between gap-4 rounded-[22px] border border-[#E2E8F0] bg-white p-4">
                <div>
                  <p className="text-lg font-semibold text-[#1A202C]">{automation.name}</p>
                  <p className="mt-1 text-sm text-[#718096]">{automation.audience}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone="green">{automation.status}</Badge>
                  <Button className="w-auto" variant="outline" size="sm" onClick={() => router.push(`/campaigns/${automation.id}`)}>
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#1A202C]">Automation templates</h2>
          <p className="mt-1 text-sm text-[#718096]">Start with pre-built templates and customize them for your needs.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {automationTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <div key={template.id} className="rounded-[25px] border border-[#E2E8F0] bg-white p-6 transition hover:border-[#BEE3F8] hover:shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#EBF8FF] text-[#0B51C1]"><Icon size={22} /></div>
                <h3 className="text-lg font-semibold text-[#1A202C]">{template.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#718096]">{template.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <Badge tone={template.complexity === "Simple" ? "green" : template.complexity === "Medium" ? "accent" : "amber"}>{template.complexity}</Badge>
                  <button type="button" onClick={() => router.push("/campaigns/new")} className="grid h-10 w-10 place-items-center rounded-[14px] border border-[#CBD5E0] bg-white text-[#0B51C1]"><Plus size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6">
        <h3 className="text-lg font-semibold text-[#1A202C]">Connected audience segments</h3>
        <p className="mt-2 text-sm text-[#718096]">These segments come from the backend and can be used when building workflows.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {segments.slice(0, 6).map((segment) => (
            <div key={segment.name} className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-sm font-semibold text-[#1A202C]">{segment.name}</p>
              <p className="text-xs text-[#718096] mt-1">{segment.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <div><CardTitle>Build from scratch</CardTitle><CardDescription>Design custom automation workflows with advanced conditions and actions.</CardDescription></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[22px] border-2 border-dashed border-[#BEE3F8] bg-[#F9FBFF] p-8 text-center">
              <Sparkles className="mx-auto mb-4 text-[#0B51C1]" size={24} />
              <p className="text-lg font-semibold text-[#1A202C]">Create a custom automation workflow</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#718096]">Combine triggers, delays, conditions, and send actions into a flow that matches your audience behavior.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div><CardTitle>How automation works</CardTitle><CardDescription>Three practical steps to launch a workflow.</CardDescription></div>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-[22px] border border-[#E2E8F0] bg-white p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EBF8FF] font-bold text-[#0B51C1]">{index + 1}</div>
                <div>
                  <p className="font-semibold text-[#1A202C]">{step}</p>
                  <p className="mt-1 text-sm text-[#718096]">Each stage can be paused, reviewed, and tracked from the automation console.</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
