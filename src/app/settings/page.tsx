"use client";

import { useEffect, useState } from "react";
import { Button, Card, Badge } from "../../components/ui";
import { Save, Eye, Copy, RefreshCw, Shield, Code, Building } from "lucide-react";
import { getSettings, updateSettings } from "../../lib/api";
import type { WorkspaceProfile } from "../../lib/types";

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [workspace, setWorkspace] = useState<WorkspaceProfile>({
    name: "",
    brandColor: "#2f8f7b",
    supportSignature: "",
    sendingDomain: "",
    globalUnsubscribeLabel: "Unsubscribe",
    doubleOptInEnabled: false,
    doubleOptInSequence: "Welcome sequence",
    postalAddress: "",
    webhookUrl: "",
    apiToken: "",
    preferences: {}
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const response = await getSettings();
      if (mounted) {
        setWorkspace({
          ...response.workspace,
          doubleOptInEnabled: Boolean(response.workspace.doubleOptInEnabled),
          preferences: response.workspace.preferences ?? {}
        });
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateSettings(workspace);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyKey = async () => {
    if (!workspace.apiToken) return;
    await navigator.clipboard.writeText(workspace.apiToken);
  };

  const rotateKey = () => {
    setWorkspace((current) => ({ ...current, apiToken: `gp_live_${Math.random().toString(36).slice(2, 12)}` }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#004AAD]">Workspace</h1>
        <p className="text-sm text-[#4A5568] mt-1">Compliance, sender records, and developer tokens.</p>
      </div>

      <Card className="p-6 space-y-6">
        <h2 className="font-bold text-lg text-[#004AAD] flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
          <Shield size={20} /> Compliance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Workspace name</label>
            <input type="text" value={workspace.name} onChange={(event) => setWorkspace({ ...workspace, name: event.target.value })} className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B51C1]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Postal address</label>
            <input type="text" value={workspace.postalAddress ?? ""} onChange={(event) => setWorkspace({ ...workspace, postalAddress: event.target.value })} className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B51C1]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Unsubscribe link template</label>
            <input type="text" value={workspace.globalUnsubscribeLabel ?? "Unsubscribe"} onChange={(event) => setWorkspace({ ...workspace, globalUnsubscribeLabel: event.target.value })} className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm font-mono text-[#0B51C1] bg-[#F7FAFC] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]" />
          </div>
          <div className="md:col-span-2 flex items-center justify-between p-4 bg-[#F7FAFC] rounded-[14px] border border-[#E2E8F0]">
            <div>
              <p className="text-sm font-bold text-[#4A5568]">Double opt-in mechanics</p>
              <p className="text-xs text-[#718096] mt-0.5">Require confirmation before new contacts become active subscribers.</p>
            </div>
            <button type="button" onClick={() => setWorkspace((current) => ({ ...current, doubleOptInEnabled: !current.doubleOptInEnabled }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${workspace.doubleOptInEnabled ? "bg-[#0B51C1]" : "bg-[#CBD5E0]"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${workspace.doubleOptInEnabled ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="font-bold text-lg text-[#004AAD] flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
          <Building size={20} /> Sender records — DNS
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase font-bold text-[#718096] border-b border-[#E2E8F0]">
                <th className="pb-3">Record type</th>
                <th className="pb-3">Target host entry</th>
                <th className="pb-3 text-right">Verification status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#E2E8F0]">
              <tr className="hover:bg-[#F7FAFC]">
                <td className="py-4 font-bold text-[#4A5568]">SPF</td>
                <td className="py-4 font-mono text-xs text-[#0B51C1]">@ → {workspace.sendingDomain || "mail.globopersona.com"}</td>
                <td className="py-4 text-right"><Badge tone="green">Verified</Badge></td>
              </tr>
              <tr className="hover:bg-[#F7FAFC]">
                <td className="py-4 font-bold text-[#4A5568]">DKIM</td>
                <td className="py-4 font-mono text-xs text-[#0B51C1]">gp._domainkey.{workspace.sendingDomain || "mail.globopersona.com"}</td>
                <td className="py-4 text-right"><Badge tone="green">Verified</Badge></td>
              </tr>
              <tr className="hover:bg-[#F7FAFC]">
                <td className="py-4 font-bold text-[#4A5568]">DMARC</td>
                <td className="py-4 font-mono text-xs text-[#0B51C1]">_dmarc.{workspace.sendingDomain || "mail.globopersona.com"}</td>
                <td className="py-4 text-right"><Badge tone="amber">Pending verification</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="font-bold text-lg text-[#004AAD] flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
          <Code size={20} /> Developer tokens
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Workspace secret API key</label>
            <div className="flex gap-2">
              <input type={showKey ? "text" : "password"} readOnly value={workspace.apiToken ?? ""} onChange={(event) => setWorkspace({ ...workspace, apiToken: event.target.value })} className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm font-mono text-[#0B51C1] bg-[#F7FAFC] focus:outline-none" />
              <button type="button" onClick={() => setShowKey((current) => !current)} className="p-3 border border-[#E2E8F0] rounded-[12px] bg-white hover:bg-[#F7FAFC] text-[#4A5568]"><Eye size={16} /></button>
              <button type="button" onClick={copyKey} className="p-3 border border-[#E2E8F0] rounded-[12px] bg-white hover:bg-[#F7FAFC] text-[#4A5568]"><Copy size={16} /></button>
              <button type="button" onClick={rotateKey} className="p-3 border border-[#E2E8F0] rounded-[12px] bg-white hover:bg-[#F7FAFC] text-[#4A5568] flex items-center gap-1 text-xs font-bold"><RefreshCw size={14} /> Rotate</button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Webhook target endpoint URL</label>
            <input type="text" value={workspace.webhookUrl ?? ""} onChange={(event) => setWorkspace({ ...workspace, webhookUrl: event.target.value })} className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B51C1]" />
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4 border-t border-[#E2E8F0]">
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Saving configuration..." : "Save workspace changes"}
        </Button>
      </div>
    </div>
  );
}