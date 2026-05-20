"use client";

import { ShieldCheck, Users, Webhook } from "lucide-react";
import { useState } from "react";
import { settingsPanels } from "../../data/mock-data";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea } from "../../components/ui";

export default function SettingsPage() {
  const [statusMessage, setStatusMessage] = useState("");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-600">Workspace settings</p>
        <h1 className="text-4xl font-bold tracking-tight text-ink-900">Settings</h1>
        <p className="max-w-3xl text-sm leading-6 text-ink-500">A restrained configuration screen for brand, sending, and team controls.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Configuration panels</CardTitle>
              <CardDescription>Core admin areas grouped for quick scanning.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {settingsPanels.map((panel) => (
              <div key={panel.title} className="rounded-[24px] border border-sand-100 bg-sand-50/70 p-4">
                <p className="font-semibold text-ink-900">{panel.title}</p>
                <p className="mt-1 text-sm leading-6 text-ink-500">{panel.description}</p>
              </div>
            ))}

            <div className="rounded-[24px] border border-sand-100 bg-white p-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-ink-900"><ShieldCheck size={16} className="text-accent-600" /> Security review complete</div>
              <p className="mt-2 text-sm leading-6 text-ink-500">This mock workspace assumes all sensitive actions use role-based access and confirmation states.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Brand profile</CardTitle>
              <CardDescription>Lightweight forms to communicate the product tone.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setStatusMessage("Settings saved locally.");
              }}
              onReset={() => setStatusMessage("Changes reverted.")}
            >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label>Workspace name</Label>
                <Input defaultValue="Globopersona Marketing" />
              </div>
              <div>
                <Label>Primary brand color</Label>
                <Input defaultValue="Forest teal" />
              </div>
            </div>
            <div>
              <Label>Support email signature</Label>
              <Textarea defaultValue="Warm, concise support copy that feels like it belongs to a real team." />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-[24px] border border-sand-100 bg-sand-50 p-4">
                <Users size={18} className="text-accent-600" />
                <p className="mt-3 font-semibold text-ink-900">Roles</p>
                <p className="mt-1 text-sm text-ink-500">4 active members</p>
              </div>
              <div className="rounded-[24px] border border-sand-100 bg-sand-50 p-4">
                <Webhook size={18} className="text-accent-600" />
                <p className="mt-3 font-semibold text-ink-900">Integrations</p>
                <p className="mt-1 text-sm text-ink-500">5 connected tools</p>
              </div>
              <div className="rounded-[24px] border border-sand-100 bg-sand-50 p-4">
                <ShieldCheck size={18} className="text-accent-600" />
                <p className="mt-3 font-semibold text-ink-900">Compliance</p>
                <p className="mt-1 text-sm text-ink-500">Policies updated</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit">Save changes</Button>
              <Button type="reset" variant="neutral">Cancel</Button>
            </div>
            {statusMessage ? <p className="rounded-2xl border border-accent-100 bg-accent-50 px-4 py-3 text-sm font-medium text-accent-700">{statusMessage}</p> : null}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}