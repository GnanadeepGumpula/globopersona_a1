"use client";

import React, { useState } from "react";
import { Button, Card, Badge } from "../../components/ui";
import { Save, Eye, Copy, RefreshCw, Shield, Code, Building } from "lucide-react";

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doubleOptIn, setDoubleOptIn] = useState(true);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 600);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#004AAD]">Workspace</h1>
        <p className="text-sm text-[#4A5568] mt-1">Compliance, sender records, and developer tokens.</p>
      </div>

      {/* Compliance Container */}
      <Card className="p-6 space-y-6">
        <h2 className="font-bold text-lg text-[#004AAD] flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
          <Shield size={20} /> Compliance
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Workspace Name</label>
            <input type="text" defaultValue="Globo Persona Demo" className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B51C1]" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Postal Address (Footer)</label>
            <input type="text" defaultValue="1 Globo Plaza, Suite 400, San Francisco, CA 94105" className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B51C1]" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Unsubscribe Link Template</label>
            <input type="text" defaultValue="https://mail.globopersona.com/u/{token}" className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm font-mono text-[#0B51C1] bg-[#F7FAFC] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]" />
          </div>

          <div className="md:col-span-2 flex items-center justify-between p-4 bg-[#F7FAFC] rounded-[14px] border border-[#E2E8F0]">
            <div>
              <p className="text-sm font-bold text-[#4A5568]">Double Opt-In Mechanics</p>
              <p className="text-xs text-[#718096] mt-0.5">Force confirmation emails before registering records into subscribers listings.</p>
            </div>
            <button 
              type="button"
              onClick={() => setDoubleOptIn(!doubleOptIn)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${doubleOptIn ? "bg-[#0B51C1]" : "bg-[#CBD5E0]"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${doubleOptIn ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </Card>

      {/* Sender Records Verification Grid */}
      <Card className="p-6 space-y-6">
        <h2 className="font-bold text-lg text-[#004AAD] flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
          <Building size={20} /> Sender Records — DNS
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase font-bold text-[#718096] border-b border-[#E2E8F0]">
                <th className="pb-3">Record Type</th>
                <th className="pb-3">Target Host Entry</th>
                <th className="pb-3 text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#E2E8F0]">
              <tr className="hover:bg-[#F7FAFC]">
                <td className="py-4 font-bold text-[#4A5568]">SPF</td>
                <td className="py-4 font-mono text-xs text-[#0B51C1]">@ → mail.globopersona.com</td>
                <td className="py-4 text-right"><Badge tone="green">Verified</Badge></td>
              </tr>
              <tr className="hover:bg-[#F7FAFC]">
                <td className="py-4 font-bold text-[#4A5568]">DKIM</td>
                <td className="py-4 font-mono text-xs text-[#0B51C1]">gp._domainkey.mail.globopersona.com</td>
                <td className="py-4 text-right"><Badge tone="green">Verified</Badge></td>
              </tr>
              <tr className="hover:bg-[#F7FAFC]">
                <td className="py-4 font-bold text-[#4A5568]">DMARC</td>
                <td className="py-4 font-mono text-xs text-[#0B51C1]">_dmarc.mail.globopersona.com</td>
                <td className="py-4 text-right"><Badge tone="amber">Pending Verification</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Developer Provisioning Module */}
      <Card className="p-6 space-y-6">
        <h2 className="font-bold text-lg text-[#004AAD] flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
          <Code size={20} /> Developer Tokens
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Workspace Secret API Key</label>
            <div className="flex gap-2">
              <input 
                type={showKey ? "text" : "password"} 
                readOnly 
                value="gp_live_8420c1632f584e0ba55d1c" 
                className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm font-mono text-[#0B51C1] bg-[#F7FAFC] focus:outline-none"
              />
              <button onClick={() => setShowKey(!showKey)} className="p-3 border border-[#E2E8F0] rounded-[12px] bg-white hover:bg-[#F7FAFC] text-[#4A5568]"><Eye size={16} /></button>
              <button className="p-3 border border-[#E2E8F0] rounded-[12px] bg-white hover:bg-[#F7FAFC] text-[#4A5568]"><Copy size={16} /></button>
              <button className="p-3 border border-[#E2E8F0] rounded-[12px] bg-white hover:bg-[#F7FAFC] text-[#4A5568] flex items-center gap-1 text-xs font-bold"><RefreshCw size={14} /> Rotate</button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Webhook Target Endpoint URL</label>
            <input type="text" defaultValue="https://example.com/webhooks/globo" className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B51C1]" />
          </div>
        </div>
      </Card>

      {/* Primary Action Row */}
      <div className="flex justify-end pt-4 border-t border-[#E2E8F0]">
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Saving Configuration..." : "Save workspace changes"}
        </Button>
      </div>
    </div>
  );
}