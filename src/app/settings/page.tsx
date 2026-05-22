"use client";

import { ShieldCheck, Users, Webhook } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea } from "../../components/ui";
import { getSettings, updateSettings } from "../../lib/api";
import type { SettingsPanel, WorkspaceProfile } from "../../lib/types";

export default function SettingsPage() {
  const [statusMessage, setStatusMessage] = useState("");
  const [panels, setPanels] = useState<SettingsPanel[]>([]);
  const [workspace, setWorkspace] = useState<WorkspaceProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSettings();

        if (isMounted) {
          setPanels(data.panels);
          setWorkspace(data.workspace);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load settings from the backend.");
          setPanels([]);
          setWorkspace(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshSettings = async () => {
    const data = await getSettings();
    setPanels(data.panels);
    setWorkspace(data.workspace);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-600">Workspace settings</p>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Settings</h1>
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
            {loading ? <p className="rounded-2xl border border-dashed border-sand-100 bg-white px-4 py-8 text-sm text-ink-500">Loading workspace settings...</p> : null}
            {!loading && error ? <p className="rounded-2xl border border-dashed border-orange-100 bg-orange-50 px-4 py-8 text-sm text-orange-700">{error}</p> : null}
            {!loading && !error ? panels.map((panel) => (
              <div key={panel.title} className="rounded-[24px] border border-sand-100 bg-sand-50/70 p-4">
                <p className="font-semibold text-ink-900">{panel.title}</p>
                <p className="mt-1 text-sm leading-6 text-ink-500">{panel.description}</p>
              </div>
            )) : null}

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
              onSubmit={async (event) => {
                event.preventDefault();

                if (!workspace) {
                  return;
                }

                try {
                  setStatusMessage("");
                  const result = await updateSettings(workspace);
                  setPanels(result.panels);
                  setWorkspace(result.workspace);
                  setStatusMessage("Settings saved to the backend.");
                } catch {
                  setStatusMessage("Unable to save settings right now.");
                }
              }}
              onReset={async (event) => {
                event.preventDefault();

                try {
                  await refreshSettings();
                  setStatusMessage("Changes reverted.");
                } catch {
                  setStatusMessage("Unable to reload settings right now.");
                }
              }}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label>Workspace name</Label>
                  <Input
                    value={workspace?.name ?? ""}
                    onChange={(event) => setWorkspace((current) => ({ ...(current ?? { name: "", brandColor: "", supportSignature: "" }), name: event.target.value }))}
                    placeholder="Workspace name"
                  />
                </div>
                <div>
                  <Label>Primary brand color</Label>
                  <Input
                    value={workspace?.brandColor ?? ""}
                    onChange={(event) => setWorkspace((current) => ({ ...(current ?? { name: "", brandColor: "", supportSignature: "" }), brandColor: event.target.value }))}
                    placeholder="Primary brand color"
                  />
                </div>
              </div>
              <div>
                <Label>Support email signature</Label>
                <Textarea
                  value={workspace?.supportSignature ?? ""}
                  onChange={(event) => setWorkspace((current) => ({ ...(current ?? { name: "", brandColor: "", supportSignature: "" }), supportSignature: event.target.value }))}
                  placeholder="Support signature"
                />
              </div>
              <div className="grid gap-5 md:grid-cols-1 lg:grid-cols-3">
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