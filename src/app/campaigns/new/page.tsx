"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Badge } from "../../../components/ui";
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  Link, User, Save, Send, Eye, FileText, Layout, ShoppingBag, 
  Megaphone, Image as ImageIcon, Type, Palette, List, ListOrdered, 
  Sparkles, Grid, Layers, Globe, X, Check, Monitor, Smartphone, HelpCircle
} from "lucide-react";

export default function NewCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("newsletter");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");
  
  const [form, setForm] = useState({
    name: "Spring Launch 2026",
    subject: "✨ Big news inside",
    preheader: "A short teaser shown in the inbox preview.",
    body: "<h1>Hello {{first_name}}</h1>\n<p style=\"color: #4A5568;\">Top stories this week from our product operations team...</p>\n<div style=\"text-align: center; margin: 24px 0;\">\n  <img src=\"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80\" alt=\"Workspace Banner\" style=\"width: 100%; max-width: 500px; border-radius: 12px;\" />\n</div>\n<p>We've engineered pristine scaling layers across all data engines.</p>\n<a href=\"#\" style=\"display: inline-block; padding: 12px 24px; background-color: #002D72; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;\">Read more →</a>"
  });

  // All premium templates available across the workspace modal gallery
  const templateLibrary = [
    { id: "newsletter", label: "Newsletter", desc: "Weekly content digests & company milestones", icon: FileText, category: "Content" },
    { id: "ecommerce", label: "E-commerce Showcase", desc: "Grid array listings for retail drops", icon: ShoppingBag, category: "Sales" },
    { id: "announcement", label: "Product Announcement", desc: "Bold alerts for major platform launches", icon: Megaphone, category: "Marketing" },
    { id: "plaintext", label: "Plain Text Narrative", desc: "Clean markdown optimized for direct sales", icon: FileText, category: "Personal" },
    { id: "transactional", label: "Order Receipt V4", desc: "High-contrast delivery & tracking slips", icon: Layers, category: "System" },
    { id: "event", label: "Webinar Invitation", desc: "Agenda timetables & clear CTA modules", icon: Grid, category: "Marketing" },
    { id: "welcome", label: "Onboarding Sequence", desc: "Step-by-step introduction sequences", icon: Sparkles, category: "Content" },
    { id: "survey", label: "Customer NPS Survey", desc: "Embedded scoring blocks & dynamic fields", icon: Globe, category: "Feedback" }
  ];

  const injectMergeTag = (tag: string) => {
    setForm(prev => ({ ...prev, body: prev.body + ` {{${tag}}}` }));
  };

  const injectHtmlSnippet = (snippetType: "image" | "color" | "fontSize" | "link" | "list") => {
    let snippet = "";
    if (snippetType === "image") {
      snippet = `\n<div style="margin: 16px 0;"><img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80" alt="Image Placeholder" style="width: 100%; border-radius: 8px;" /></div>\n`;
    } else if (snippetType === "color") {
      snippet = `<span style="color: #0B51C1; font-weight: bold;">[Colored Text]</span>`;
    } else if (snippetType === "fontSize") {
      snippet = `<span style="font-size: 24px; line-height: 1.2;">[Large Header Text]</span>`;
    } else if (snippetType === "link") {
      snippet = `<a href="https://example.com" style="color: #0B51C1; text-decoration: underline;">Click Here</a>`;
    } else if (snippetType === "list") {
      snippet = `\n<ul style="color: #4A5568; padding-left: 20px;">\n  <li>Bullet point item option one</li>\n  <li>Bullet point item option two</li>\n</ul>\n`;
    }
    setForm(prev => ({ ...prev, body: prev.body + snippet }));
  };

  const handleSave = async (status: "Draft" | "Scheduled") => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/campaigns");
    }, 800);
  };

  const activeTemplateObj = templateLibrary.find(t => t.id === selectedTemplate) || templateLibrary[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 animate-fade-in relative">
      
      {/* Header Info Node */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#004AAD]">New Campaign</h1>
          <p className="text-sm text-[#4A5568] mt-1">Compose HTML, select delivery profiles, and verify rendering paths.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setIsPreviewModalOpen(true)}
          >
            <Eye size={16} /> Interactively Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side Rich Content Workspace */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4 shadow-sm border border-[#E2E8F0] bg-white">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-[#004AAD]">Email Design Base</h2>
                <Badge tone="accent">Template: {activeTemplateObj.label}</Badge>
              </div>
              
              <div className="flex bg-[#EDF2F7] p-1 rounded-xl">
                <button 
                  type="button"
                  onClick={() => setViewMode("edit")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${viewMode === "edit" ? "bg-white text-[#0B51C1] shadow-sm" : "text-[#4A5568] hover:text-[#0B51C1]"}`}
                >
                  HTML Code Composer
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setViewMode("preview");
                    setIsPreviewModalOpen(true);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${viewMode === "preview" ? "bg-white text-[#0B51C1] shadow-sm" : "text-[#4A5568] hover:text-[#0B51C1]"}`}
                >
                  Live Frame View
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Campaign Name (Internal Operational Identifier)</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Subject Line</label>
                  <input 
                    type="text" 
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                    className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Preheader Snippet</label>
                  <input 
                    type="text" 
                    value={form.preheader}
                    onChange={e => setForm({...form, preheader: e.target.value})}
                    className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/30 transition-all"
                  />
                </div>
              </div>

              {viewMode === "edit" ? (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider">Email Content Composer Toolkit</label>
                  
                  {/* EXPANDED PROFESSIONAL FORMATTING TOOLBAR */}
                  <div className="flex flex-wrap items-center gap-1 bg-[#F7FAFC] border border-[#E2E8F0] p-2 rounded-t-[14px] border-b-0 shadow-sm">
                    <button type="button" title="Bold text" className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><Bold size={15} /></button>
                    <button type="button" title="Italic text" className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><Italic size={15} /></button>
                    <button type="button" title="Underline text" className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><Underline size={15} /></button>
                    
                    <div className="w-px h-5 bg-[#E2E8F0] mx-1" />
                    
                    <button type="button" title="Align Left" className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><AlignLeft size={15} /></button>
                    <button type="button" title="Align Center" className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><AlignCenter size={15} /></button>
                    <button type="button" title="Align Right" className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><AlignRight size={15} /></button>
                    
                    <div className="w-px h-5 bg-[#E2E8F0] mx-1" />

                    {/* NEW EXPANDED WORKSPACE HELPERS */}
                    <button type="button" title="Inject Corporate Blue Text Color" onClick={() => injectHtmlSnippet("color")} className="p-2 hover:bg-[#EBF8FF] rounded-lg text-[#0B51C1] flex items-center gap-1 text-[11px] font-bold transition">
                      <Palette size={15} /> Color
                    </button>

                    <button type="button" title="Inject Scale Font Size Modifier" onClick={() => injectHtmlSnippet("fontSize")} className="p-2 hover:bg-[#F7FAFC] rounded-lg text-[#4A5568] flex items-center gap-1 text-[11px] font-bold border border-[#E2E8F0] bg-white transition">
                      <Type size={15} /> Size+
                    </button>

                    <button type="button" title="Inject Image Placeholder Block" onClick={() => injectHtmlSnippet("image")} className="p-2 hover:bg-[#F0FFF4] rounded-lg text-[#2F855A] flex items-center gap-1 text-[11px] font-bold transition">
                      <ImageIcon size={15} /> Image Block
                    </button>

                    <button type="button" title="Inject Unordered HTML List" onClick={() => injectHtmlSnippet("list")} className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><List size={15} /></button>
                    <button type="button" title="Inject Hyperlink Struct" onClick={() => injectHtmlSnippet("link")} className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><Link size={15} /></button>
                    
                    <div className="w-px h-5 bg-[#E2E8F0] mx-1 lg:block hidden" />
                    
                    <button 
                      type="button" 
                      onClick={() => injectMergeTag("first_name")}
                      className="flex items-center gap-1 px-2 py-1 bg-white border border-[#D5DFED] hover:bg-[#EEF4FF] rounded-lg text-[11px] font-bold text-[#002D72] shadow-sm ml-auto transition"
                    >
                      <User size={13} /> Merge User Field
                    </button>
                  </div>

                  <textarea 
                    value={form.body}
                    onChange={e => setForm({...form, body: e.target.value})}
                    rows={14}
                    className="w-full border border-[#E2E8F0] rounded-b-[14px] p-4 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/30 resize-none bg-[#FAFAFA] text-[#1A202C]"
                  />
                </div>
              ) : (
                // In-line static check window
                <div className="border border-[#E2E8F0] rounded-[14px] p-6 bg-white min-h-[350px] shadow-inner relative overflow-hidden">
                  <div className="bg-[#F7FAFC] border-b border-[#E2E8F0] -mx-6 -mt-6 p-4 text-xs text-[#718096]">
                    <p><span className="font-bold text-[#1A202C]">Subject Line:</span> {form.subject}</p>
                    <p className="mt-1"><span className="font-bold text-[#1A202C]">Preheader text:</span> {form.preheader}</p>
                  </div>
                  <div className="mt-6 prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: form.body.replace("{{first_name}}", "Subscriber Lead") }} />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Action Templates Configurations Matrix Side panel */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 shadow-sm border border-[#E2E8F0] bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#004AAD] flex items-center gap-2 text-sm uppercase tracking-wider"><Layout size={16} /> Layout Base</h3>
              <button 
                type="button" 
                onClick={() => setIsTemplateModalOpen(true)}
                className="text-xs font-bold text-[#0B51C1] hover:underline"
              >
                Browse All Templates
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {templateLibrary.slice(0, 4).map(tpl => {
                const Icon = tpl.icon;
                const active = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`flex flex-col items-start p-3 rounded-[16px] border text-left transition-all ${active ? "border-[#0B51C1] bg-[#EBF8FF] ring-2 ring-[#0B51C1]/20" : "border-[#E2E8F0] bg-white hover:bg-[#F7FAFC]"}`}
                  >
                    <Icon size={18} className={active ? "text-[#0B51C1]" : "text-[#718096]"} />
                    <span className={`text-xs font-bold mt-2 truncate w-full ${active ? "text-[#0B51C1]" : "text-[#4A5568]"}`}>{tpl.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 space-y-4 shadow-sm border border-[#E2E8F0] bg-white">
            <h3 className="font-bold text-[#004AAD] text-sm uppercase tracking-wider">Pipeline Schedule</h3>
            <p className="text-xs text-[#718096] leading-relaxed">Save updates securely as local draft tokens, or map a pipeline timestamp trigger for systemic broadcast dispatching.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Broadcast Trigger Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm text-[#4A5568] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/30 bg-white"
                />
              </div>

              <div className="space-y-2 pt-2">
                <Button 
                  onClick={() => handleSave("Scheduled")}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 font-bold"
                >
                  <Send size={15} /> {isSubmitting ? "Processing Node..." : "Schedule Campaign"}
                </Button>
                
                <button 
                  type="button"
                  onClick={() => handleSave("Draft")}
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-[14px] bg-white border border-[#E2E8F0] text-sm font-bold text-[#4A5568] hover:bg-[#F7FAFC] transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save size={15} /> Save Configuration Draft
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 1. EXTANDED TEMPLATES LIBRARY MODAL DIALOG OVERLAY */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#002D72]/20 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#E2E8F0] w-full max-w-4xl h-[600px] rounded-[24px] shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-[#002D72] to-[#0B51C1] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Layout size={20} />
                <div>
                  <h3 className="font-bold text-base tracking-tight text-white">Expanded Workspace Blueprint Gallery</h3>
                  <p className="text-white/70 text-[11px]">Select professional layout layers configured for responsive distribution channels.</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsTemplateModalOpen(false)} 
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templateLibrary.map((tpl) => {
                  const Icon = tpl.icon;
                  const isSelected = selectedTemplate === tpl.id;
                  return (
                    <div 
                      key={tpl.id}
                      onClick={() => {
                        setSelectedTemplate(tpl.id);
                        setIsTemplateModalOpen(false);
                      }}
                      className={`p-4 bg-white border rounded-[20px] transition-all cursor-pointer flex gap-4 items-start relative group ${
                        isSelected ? "border-[#0B51C1] ring-2 ring-[#0B51C1]/20 bg-[#EBF8FF]/30" : "border-[#E2E8F0] hover:border-[#B7CAEA] hover:shadow-sm"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-[#0B51C1] text-white" : "bg-[#F4F7FC] text-[#718096] group-hover:bg-[#EEF4FF]"}`}>
                        <Icon size={20} />
                      </div>
                      <div className="space-y-1 pr-6">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#1A202C]">{tpl.label}</span>
                          <span className="text-[9px] bg-[#EDF2F7] px-2 py-0.5 rounded-md text-[#4A5568] font-bold uppercase">{tpl.category}</span>
                        </div>
                        <p className="text-[11px] text-[#718096] leading-normal">{tpl.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-5 h-5 bg-[#2F855A] rounded-full text-white grid place-items-center">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-[#E2E8F0] flex justify-end">
              <button 
                type="button" 
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-4 h-10 border border-[#E2E8F0] text-xs font-bold text-[#4A5568] rounded-xl hover:bg-[#F7FAFC] transition"
              >
                Close Gallery Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DYNAMIC LIVE PREVIEW DIALOG MODAL FRAME */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#002D72]/30 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#E2E8F0] w-full max-w-4xl h-[700px] rounded-[28px] shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Navigation Controls header */}
            <div className="bg-[#1A202C] p-4 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C53030]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#B7791F]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#2F855A]" />
                <span className="text-xs font-bold text-[#A0AEC0] ml-2 font-mono">Simulated Delivery Node Target</span>
              </div>
              
              {/* Responsive breakpoint selectors inside the modal view */}
              <div className="flex bg-white/10 p-0.5 rounded-lg border border-white/10">
                <button 
                  type="button"
                  onClick={() => setDevicePreview("desktop")}
                  className={`p-2 rounded-md transition ${devicePreview === "desktop" ? "bg-white text-[#1A202C]" : "text-white/70 hover:text-white"}`}
                  title="Desktop Canvas Matrix"
                >
                  <Monitor size={14} />
                </button>
                <button 
                  type="button"
                  onClick={() => setDevicePreview("mobile")}
                  className={`p-2 rounded-md transition ${devicePreview === "mobile" ? "bg-white text-[#1A202C]" : "text-white/70 hover:text-white"}`}
                  title="Mobile View Matrix"
                >
                  <Smartphone size={14} />
                </button>
              </div>

              <button 
                type="button" 
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-white/80 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Email client header metadata layout simulation */}
            <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] p-4 text-xs text-[#4A5568] flex-shrink-0 space-y-1.5">
              <p><span className="font-bold text-[#1A202C]">From:</span> Globo Persona System Node &lt;broadcast@globopersona.co&gt;</p>
              <p><span className="font-bold text-[#1A202C]">Subject:</span> {form.subject || "(Empty Subject Line)"}</p>
              <p><span className="font-bold text-[#1A202C]">Preheader Teaser:</span> <span className="italic text-[#718096]">{form.preheader || "None configured"}</span></p>
            </div>

            {/* Content view frame rendering area */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#EDF2F7] grid place-items-center">
              <div 
                className={`bg-white border border-[#E2E8F0] shadow-md p-6 rounded-xl transition-all duration-300 min-h-[400px] prose max-w-none ${
                  devicePreview === "mobile" ? "w-[360px]" : "w-full max-w-2xl"
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: form.body.replace("{{first_name}}", "Jane Doe") }} />
              </div>
            </div>

            {/* Modal Action footer */}
            <div className="p-4 bg-white border-t border-[#E2E8F0] flex justify-between items-center flex-shrink-0">
              <p className="text-[11px] text-[#718096] font-medium flex items-center gap-1">
                <HelpCircle size={12} /> Live variable evaluation context binds <code>{"{{first_name}}"}</code> to demo parameters.
              </p>
              <button 
                type="button" 
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 h-10 bg-[#002D72] text-xs font-bold text-white rounded-xl hover:bg-[#004AAD] transition shadow-sm"
              >
                Accept & Return to Editor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}