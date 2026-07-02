"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Link, User, Save, Send, Eye, FileText, Layout, ShoppingBag, Megaphone, Image as ImageIcon, Type, Palette, List, Sparkles, Grid, Layers, Globe, X, Check, Monitor, Smartphone } from "lucide-react";
import { Button, Card, Badge } from "../../../components/ui";
import { createCampaign, scheduleCampaign } from "../../../lib/api";

export default function NewCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("newsletter");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");
  const [scheduleAt, setScheduleAt] = useState("");
  const [composerMode, setComposerMode] = useState<"visual" | "html">("visual");
  const editorRef = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState({
    name: "Spring Launch 2026",
    subject: "✨ Big news inside",
    preheader: "A short teaser shown in the inbox preview.",
    body: "<h1>Hello {{first_name}}</h1>\n<p style=\"color: #4A5568;\">Top stories this week from our product operations team...</p>\n<div style=\"text-align: center; margin: 24px 0;\">\n  <img src=\"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80\" alt=\"Workspace Banner\" style=\"width: 100%; max-width: 500px; border-radius: 12px;\" />\n</div>\n<p>We've engineered pristine scaling layers across all data engines.</p>\n<a href=\"#\" style=\"display: inline-block; padding: 12px 24px; background-color: #002D72; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;\">Read more →</a>"
  });

  useEffect(() => {
    if (composerMode === "visual" && editorRef.current) {
      const nextHtml = form.body || "<p>Start typing your message here...</p>";
      if (editorRef.current.innerHTML !== nextHtml) {
        editorRef.current.innerHTML = nextHtml;
      }
    }
  }, [composerMode, form.body]);

  const handleEditorInput = () => {
    const html = editorRef.current?.innerHTML ?? "";
    setForm((previous) => ({ ...previous, body: html }));
  };

  const applyEditorCommand = (command: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
  };

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
    setForm((previous) => ({ ...previous, body: previous.body + ` {{${tag}}}` }));
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
    setForm((previous) => ({ ...previous, body: previous.body + snippet }));
  };

  const handleSave = async (status: "Draft" | "Scheduled") => {
    setIsSubmitting(true);
    try {
      const created = await createCampaign({
        name: form.name.trim() || "Untitled campaign",
        subject: form.subject.trim(),
        previewText: form.preheader.trim() || null,
        content: {
          template: selectedTemplate,
          body: form.body,
          preheader: form.preheader,
          subject: form.subject
        },
        status: status === "Scheduled" ? "scheduled" : "draft",
        scheduledAt: status === "Scheduled" && scheduleAt ? new Date(scheduleAt).toISOString() : undefined
      });

      if (status === "Scheduled" && scheduleAt) {
        await scheduleCampaign(created.id, { scheduledAt: new Date(scheduleAt).toISOString() });
      }

      router.push("/campaigns");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeTemplateObj = templateLibrary.find((template) => template.id === selectedTemplate) || templateLibrary[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#004AAD]">New Campaign</h1>
          <p className="text-sm text-[#4A5568] mt-1">Compose HTML, select delivery profiles, and verify rendering paths.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setIsPreviewModalOpen(true)}>
            <Eye size={16} /> Interactively Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4 shadow-sm border border-[#E2E8F0] bg-white">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-[#004AAD]">Email Design Base</h2>
                <Badge tone="accent">Template: {activeTemplateObj.label}</Badge>
              </div>
              <div className="flex bg-[#EDF2F7] p-1 rounded-xl">
                <button type="button" onClick={() => setViewMode("edit")} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${viewMode === "edit" ? "bg-white text-[#0B51C1] shadow-sm" : "text-[#4A5568] hover:text-[#0B51C1]"}`}>
                  Document Editor
                </button>
                <button type="button" onClick={() => { setViewMode("preview"); setIsPreviewModalOpen(true); }} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${viewMode === "preview" ? "bg-white text-[#0B51C1] shadow-sm" : "text-[#4A5568] hover:text-[#0B51C1]"}`}>
                  Live Frame View
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Campaign Name</label>
                <input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/30 transition-all" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Subject line</label>
                  <input type="text" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/30 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Preheader</label>
                  <input type="text" value={form.preheader} onChange={(event) => setForm({ ...form, preheader: event.target.value })} className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/30 transition-all" />
                </div>
              </div>

              {viewMode === "edit" ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider">Email content composer toolkit</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setComposerMode("visual")} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${composerMode === "visual" ? "bg-[#0B51C1] text-white" : "bg-[#F7FAFC] text-[#4A5568] border border-[#E2E8F0]"}`}>
                        Document editor
                      </button>
                      <button type="button" onClick={() => setComposerMode("html")} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${composerMode === "html" ? "bg-[#0B51C1] text-white" : "bg-[#F7FAFC] text-[#4A5568] border border-[#E2E8F0]"}`}>
                        HTML source
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 bg-[#F7FAFC] border border-[#E2E8F0] p-2 rounded-t-[14px] border-b-0 shadow-sm">
                    <button type="button" title="Bold text" onClick={() => applyEditorCommand("bold")} className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><Bold size={15} /></button>
                    <button type="button" title="Italic text" onClick={() => applyEditorCommand("italic")} className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><Italic size={15} /></button>
                    <button type="button" title="Underline text" onClick={() => applyEditorCommand("underline")} className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><Underline size={15} /></button>
                    <div className="w-px h-5 bg-[#E2E8F0] mx-1" />
                    <button type="button" title="Align left" onClick={() => applyEditorCommand("justifyLeft")} className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><AlignLeft size={15} /></button>
                    <button type="button" title="Align center" onClick={() => applyEditorCommand("justifyCenter")} className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><AlignCenter size={15} /></button>
                    <button type="button" title="Align right" onClick={() => applyEditorCommand("justifyRight")} className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><AlignRight size={15} /></button>
                    <div className="w-px h-5 bg-[#E2E8F0] mx-1" />
                    <button type="button" title="Inject colored text" onClick={() => injectHtmlSnippet("color")} className="p-2 hover:bg-[#EBF8FF] rounded-lg text-[#0B51C1] flex items-center gap-1 text-[11px] font-bold transition"><Palette size={15} /> Color</button>
                    <button type="button" title="Inject large font" onClick={() => injectHtmlSnippet("fontSize")} className="p-2 hover:bg-[#F7FAFC] rounded-lg text-[#4A5568] flex items-center gap-1 text-[11px] font-bold border border-[#E2E8F0] bg-white transition"><Type size={15} /> Size+</button>
                    <button type="button" title="Inject image block" onClick={() => injectHtmlSnippet("image")} className="p-2 hover:bg-[#F0FFF4] rounded-lg text-[#2F855A] flex items-center gap-1 text-[11px] font-bold transition"><ImageIcon size={15} /> Image</button>
                    <button type="button" title="Inject list" onClick={() => injectHtmlSnippet("list")} className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><List size={15} /></button>
                    <button type="button" title="Inject link" onClick={() => injectHtmlSnippet("link")} className="p-2 hover:bg-[#EDF2F7] rounded-lg text-[#4A5568] transition"><Link size={15} /></button>
                    <div className="w-px h-5 bg-[#E2E8F0] mx-1 lg:block hidden" />
                    <button type="button" onClick={() => injectMergeTag("first_name")} className="flex items-center gap-1 px-2 py-1 bg-white border border-[#D5DFED] hover:bg-[#EEF4FF] rounded-lg text-[11px] font-bold text-[#002D72] shadow-sm ml-auto transition"><User size={13} /> Merge field</button>
                  </div>
                  {composerMode === "visual" ? (
                    <div className="space-y-3">
                      <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={handleEditorInput} className="min-h-[320px] rounded-b-[14px] border border-[#E2E8F0] bg-white p-5 text-sm leading-7 text-[#1F2937] shadow-inner outline-none focus:ring-2 focus:ring-[#0B51C1]/30" />
                      <div className="rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#718096]">Live preview</p>
                        <div className="mt-3 rounded-[14px] border border-[#E2E8F0] bg-white p-4 shadow-sm prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: form.body.replace("{{first_name}}", "Subscriber Lead") }} />
                      </div>
                    </div>
                  ) : (
                    <textarea value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} rows={14} className="w-full border border-[#E2E8F0] rounded-b-[14px] p-4 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/30 resize-none bg-[#FAFAFA] text-[#1A202C]" />
                  )}
                </div>
              ) : (
                <div className="border border-[#E2E8F0] rounded-[14px] p-6 bg-white min-h-[350px] shadow-inner relative overflow-hidden">
                  <div className="bg-[#F7FAFC] border-b border-[#E2E8F0] -mx-6 -mt-6 p-4 text-xs text-[#718096]">
                    <p><span className="font-bold text-[#1A202C]">Subject line:</span> {form.subject}</p>
                    <p className="mt-1"><span className="font-bold text-[#1A202C]">Preheader:</span> {form.preheader}</p>
                  </div>
                  <div className="mt-6 prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: form.body.replace("{{first_name}}", "Subscriber Lead") }} />
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-4 shadow-sm border border-[#E2E8F0] bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#004AAD] flex items-center gap-2 text-sm uppercase tracking-wider"><Layout size={16} /> Layout base</h3>
              <button type="button" onClick={() => setIsTemplateModalOpen(true)} className="text-xs font-bold text-[#0B51C1] hover:underline">Browse templates</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {templateLibrary.slice(0, 4).map((template) => {
                const Icon = template.icon;
                const active = selectedTemplate === template.id;
                return (
                  <button key={template.id} type="button" onClick={() => setSelectedTemplate(template.id)} className={`flex flex-col items-start p-3 rounded-[16px] border text-left transition-all ${active ? "border-[#0B51C1] bg-[#EBF8FF] ring-2 ring-[#0B51C1]/20" : "border-[#E2E8F0] bg-white hover:bg-[#F7FAFC]"}`}>
                    <Icon size={18} className={active ? "text-[#0B51C1]" : "text-[#718096]"} />
                    <span className={`text-xs font-bold mt-2 truncate w-full ${active ? "text-[#0B51C1]" : "text-[#4A5568]"}`}>{template.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 space-y-4 shadow-sm border border-[#E2E8F0] bg-white">
            <h3 className="font-bold text-[#004AAD] text-sm uppercase tracking-wider">Pipeline schedule</h3>
            <p className="text-xs text-[#718096] leading-relaxed">Save updates as a draft or schedule the send for a later time.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider mb-1.5">Broadcast trigger time</label>
                <input type="datetime-local" value={scheduleAt} onChange={(event) => setScheduleAt(event.target.value)} className="w-full h-11 border border-[#E2E8F0] rounded-[12px] px-4 text-sm text-[#4A5568] focus:outline-none focus:ring-2 focus:ring-[#0B51C1]/30 bg-white" />
              </div>
              <div className="space-y-2 pt-2">
                <Button onClick={() => handleSave("Scheduled")} disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 font-bold">
                  <Send size={15} /> {isSubmitting ? "Processing..." : "Schedule campaign"}
                </Button>
                <button type="button" onClick={() => handleSave("Draft")} disabled={isSubmitting} className="w-full h-11 rounded-[14px] bg-white border border-[#E2E8F0] text-sm font-bold text-[#4A5568] hover:bg-[#F7FAFC] transition flex items-center justify-center gap-2 shadow-sm">
                  <Save size={15} /> Save draft
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#002D72]/20 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#E2E8F0] w-full max-w-4xl h-[600px] rounded-[24px] shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-[#002D72] to-[#0B51C1] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Layout size={20} />
                <div>
                  <h3 className="font-bold text-base tracking-tight text-white">Expanded workspace template gallery</h3>
                  <p className="text-white/70 text-[11px]">Choose a ready-built layout for your message.</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-white">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templateLibrary.map((template) => {
                  const Icon = template.icon;
                  const isSelected = selectedTemplate === template.id;
                  return (
                    <div key={template.id} onClick={() => { setSelectedTemplate(template.id); setIsTemplateModalOpen(false); }} className={`p-4 bg-white border rounded-[20px] transition-all cursor-pointer flex gap-4 items-start relative group ${isSelected ? "border-[#0B51C1] ring-2 ring-[#0B51C1]/20 bg-[#EBF8FF]/30" : "border-[#E2E8F0] hover:border-[#B7CAEA] hover:shadow-sm"}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-[#0B51C1] text-white" : "bg-[#F4F7FC] text-[#718096] group-hover:bg-[#EEF4FF]"}`}>
                        <Icon size={20} />
                      </div>
                      <div className="space-y-1 pr-6">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#1A202C]">{template.label}</span>
                          <span className="text-[9px] bg-[#EDF2F7] px-2 py-0.5 rounded-md text-[#4A5568] font-bold uppercase">{template.category}</span>
                        </div>
                        <p className="text-[11px] text-[#718096] leading-normal">{template.desc}</p>
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
              <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="px-4 h-10 border border-[#E2E8F0] text-xs font-bold text-[#4A5568] rounded-xl hover:bg-[#F7FAFC] transition">Close gallery</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}