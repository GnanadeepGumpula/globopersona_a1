"use client";

import { CalendarDays, CheckCircle2, Mail, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea } from "../../../components/ui";

const checklist = [
  "Copy reviewed by marketing lead",
  "Audience segment is synced",
  "Preview tested on mobile inbox",
  "Send window matches target timezone"
];

export default function NewCampaignPage() {
  const [statusMessage, setStatusMessage] = useState("");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <Badge tone="accent">Campaign builder</Badge>
        <h1 className="text-4xl font-bold tracking-tight text-ink-900">Create campaign</h1>
        <p className="max-w-3xl text-sm leading-6 text-ink-500">A direct, office-friendly campaign form that keeps the product structure familiar while improving spacing, labels, and section grouping.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Message setup</CardTitle>
              <CardDescription>Core campaign details with straightforward, high-contrast form controls.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label>Campaign name</Label>
                <Input defaultValue="Spring product update" />
              </div>
              <div>
                <Label>From name</Label>
                <Input defaultValue="Globopersona Team" />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label>Audience segment</Label>
                <Input defaultValue="Active customers" />
              </div>
              <div>
                <Label>Send schedule</Label>
                <Input defaultValue="Tomorrow at 9:00 AM" />
              </div>
            </div>
            <div>
              <Label>Subject line</Label>
              <Input defaultValue="New updates built for your team" />
            </div>
            <div>
              <Label>Preheader</Label>
              <Input defaultValue="A concise summary designed for higher opens." />
            </div>
            <div>
              <Label>Campaign copy</Label>
              <Textarea defaultValue="Write the campaign body here. The layout keeps typography readable, section spacing calm, and editor controls out of the way." />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-[24px] border border-sand-100 bg-sand-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink-900"><Mail size={16} /> Email</div>
                <p className="mt-2 text-sm text-ink-500">Primary channel</p>
              </div>
              <div className="rounded-[24px] border border-sand-100 bg-sand-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink-900"><CalendarDays size={16} /> Schedule</div>
                <p className="mt-2 text-sm text-ink-500">Time-based delivery</p>
              </div>
              <div className="rounded-[24px] border border-sand-100 bg-sand-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink-900"><Target size={16} /> Audience</div>
                <p className="mt-2 text-sm text-ink-500">Segment targeting</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Pre-flight checks</CardTitle>
                <CardDescription>Simple confidence panel before sending.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {checklist.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[20px] border border-sand-100 bg-white p-4">
                  <CheckCircle2 className="mt-0.5 text-accent-600" size={18} />
                  <p className="text-sm leading-6 text-ink-700">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Preview note</CardTitle>
                <CardDescription>Designed to feel like a real internal tool, not a generated demo.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] border border-sand-100 bg-gradient-to-br from-accent-50 to-white p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-accent-600 shadow-sm">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">Human-first layout</p>
                    <p className="text-sm text-ink-500">Typography, padding, and card rhythm are intentionally restrained.</p>
                  </div>
                </div>
              </div>
              <Button type="button" className="w-full" onClick={() => setStatusMessage("Draft saved locally.")}>Save draft</Button>
              <Button type="button" variant="neutral" className="w-full" onClick={() => setStatusMessage("Send scheduled locally.")}>Schedule send</Button>
              {statusMessage ? <p className="rounded-2xl border border-accent-100 bg-accent-50 px-4 py-3 text-sm font-medium text-accent-700">{statusMessage}</p> : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}