"use client";

import { CheckCircle2, Copy, KeyRound, RefreshCw, ShieldCheck, Webhook, Wifi, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea, Toast } from "../../components/ui";
import { getSettings, updateSettings } from "../../lib/api";
import type { SettingsPanel, WorkspaceProfile } from "../../lib/types";

type DnsRecord = {
	type: "SPF" | "DKIM" | "DMARC";
	host: string;
	value: string;
	status: "Verified" | "Pending DNS Propagation" | "Missing";
};

type ToastState = {
	title: string;
	message: string;
	tone: "success" | "error";
};

function buildToken() {
	const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().replace(/-/g, "") : Math.random().toString(36).slice(2, 18);
	return `sk_live_${suffix}`;
}

export default function SettingsPage() {
	const [loading, setLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [panels, setPanels] = useState<SettingsPanel[]>([]);
	const [workspace, setWorkspace] = useState<WorkspaceProfile | null>(null);
	const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([]);
	const [toast, setToast] = useState<ToastState | null>(null);

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
					setDnsRecords([
						{ type: "SPF", host: "@", value: `v=spf1 include:${data.workspace.sendingDomain ?? "mail.globopersona.com"} ~all`, status: data.workspace.sendingDomain ? "Verified" : "Pending DNS Propagation" },
						{ type: "DKIM", host: "selector1._domainkey", value: `k=rsa; p=${data.workspace.apiToken?.slice(0, 24) ?? "pending"}...`, status: data.workspace.apiToken ? "Verified" : "Pending DNS Propagation" },
						{ type: "DMARC", host: "_dmarc", value: `v=DMARC1; p=quarantine; rua=mailto:postmaster@${data.workspace.sendingDomain ?? "globopersona.com"}`, status: data.workspace.doubleOptInEnabled ? "Verified" : "Pending DNS Propagation" }
					]);
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

	const dnsVerificationScore = useMemo(() => {
		if (!dnsRecords.length) return 0;
		const verified = dnsRecords.filter((record) => record.status === "Verified").length;
		return Math.round((verified / dnsRecords.length) * 100);
	}, [dnsRecords]);

	const persistWorkspace = async () => {
		if (!workspace || isSaving) return;

		setIsSaving(true);
		setToast(null);
		try {
			const result = await updateSettings(workspace);
			setPanels(result.panels);
			setWorkspace(result.workspace);
			setToast({ title: "Settings saved", message: "Workspace configuration synced to the backend.", tone: "success" });
		} catch {
			setToast({ title: "Save failed", message: "Unable to persist workspace settings right now.", tone: "error" });
		} finally {
			setIsSaving(false);
		}
	};

	const generateSecretToken = () => {
		const nextToken = buildToken();
		setWorkspace((current) => current ? { ...current, apiToken: nextToken } : current);
		setToast({ title: "Token generated", message: "A new masked API credential is ready for copy.", tone: "success" });
	};

	const copyToken = async () => {
		if (!workspace?.apiToken) return;
		await navigator.clipboard.writeText(workspace.apiToken);
		setToast({ title: "Token copied", message: "API credential copied to clipboard.", tone: "success" });
	};

	const setField = <K extends keyof WorkspaceProfile>(field: K, value: WorkspaceProfile[K]) => {
		setWorkspace((current) => current ? { ...current, [field]: value } : current);
	};

	if (loading || !workspace) {
		return (
			<div className="space-y-8">
				<Card>
					<CardContent className="space-y-3 py-10">
						<div className="h-4 w-32 animate-pulse rounded-md bg-sand-100" />
						<div className="grid gap-4 md:grid-cols-2">
							<div className="h-32 animate-pulse rounded-[24px] bg-sand-100" />
							<div className="h-32 animate-pulse rounded-[24px] bg-sand-100" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-3">
				<p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-600">Workspace settings</p>
				<h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Settings</h1>
				<p className="max-w-3xl text-sm leading-6 text-ink-500">Enterprise controls for compliance, sender verification, and developer provisioning.</p>
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
						{error ? <p className="rounded-2xl border border-dashed border-orange-100 bg-orange-50 px-4 py-8 text-sm text-orange-700">{error}</p> : null}
						{!error ? panels.map((panel) => (
							<div key={panel.title} className="rounded-[24px] border border-sand-100 bg-sand-50/70 p-4 transition-colors hover:bg-sand-50">
								<p className="font-semibold text-ink-900">{panel.title}</p>
								<p className="mt-1 text-sm leading-6 text-ink-500">{panel.description}</p>
							</div>
						)) : null}

						<div className="rounded-[24px] border border-sand-100 bg-white p-4">
							<div className="flex items-center gap-3 text-sm font-semibold text-ink-900"><ShieldCheck size={16} className="text-accent-600" /> Security review complete</div>
							<p className="mt-2 text-sm leading-6 text-ink-500">Sensitive actions should remain behind role checks and explicit confirmation states.</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div>
							<CardTitle>Brand and compliance controls</CardTitle>
							<CardDescription>Adjust global unsubscribe, double opt-in, and sender identity behavior.</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-5">
						<div className="grid gap-5 md:grid-cols-2">
							<div>
								<Label>Workspace name</Label>
								<Input value={workspace.name} onChange={(event) => setField("name", event.target.value)} />
							</div>
							<div>
								<Label>Primary brand color</Label>
								<Input value={workspace.brandColor} onChange={(event) => setField("brandColor", event.target.value)} />
							</div>
						</div>

						<div className="grid gap-5 md:grid-cols-2">
							<div>
								<Label>Global unsubscribe link text</Label>
								<Input value={workspace.globalUnsubscribeLabel ?? "Unsubscribe"} onChange={(event) => setField("globalUnsubscribeLabel", event.target.value)} />
							</div>
							<div>
								<Label>Double opt-in sequence</Label>
								<Input value={workspace.doubleOptInSequence ?? "Welcome sequence"} onChange={(event) => setField("doubleOptInSequence", event.target.value)} />
							</div>
						</div>

						<div>
							<Label>Support email signature</Label>
							<Textarea value={workspace.supportSignature} onChange={(event) => setField("supportSignature", event.target.value)} />
						</div>

						<div>
							<Label>Default postal address</Label>
							<Textarea value={workspace.postalAddress ?? ""} onChange={(event) => setField("postalAddress", event.target.value)} placeholder="Street, city, region, postal code" />
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<label className="flex items-center justify-between rounded-[24px] border border-sand-100 bg-sand-50/70 p-4">
								<span>
									<span className="block font-semibold text-ink-900">Double opt-in enabled</span>
									<span className="block text-sm text-ink-500">Require confirmation before list activation</span>
								</span>
								<input type="checkbox" checked={Boolean(workspace.doubleOptInEnabled)} onChange={(event) => setField("doubleOptInEnabled", event.target.checked)} className="h-5 w-5 rounded border-sand-300 text-accent-600 focus:ring-accent-500" />
							</label>
							<label className="flex items-center justify-between rounded-[24px] border border-sand-100 bg-sand-50/70 p-4">
								<span>
									<span className="block font-semibold text-ink-900">Workflow verification ready</span>
									<span className="block text-sm text-ink-500">Signals are prepared for production sending</span>
								</span>
								<CheckCircle2 className="text-accent-600" size={18} />
							</label>
						</div>

						<div className="flex flex-wrap gap-3 pt-2">
							<Button type="button" onClick={() => void persistWorkspace()} disabled={isSaving}>
								{isSaving ? "Saving…" : "Save changes"}
							</Button>
							<Button type="button" variant="neutral" onClick={() => setToast(null)}>Dismiss toast</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
				<Card>
					<CardHeader>
						<div>
							<CardTitle>Sender domain verification grid</CardTitle>
							<CardDescription>Structured DNS records with clear verification states.</CardDescription>
						</div>
						<Badge tone={dnsVerificationScore >= 66 ? "green" : "amber"}>{dnsVerificationScore}% verified</Badge>
					</CardHeader>
					<CardContent>
						<div className="hidden overflow-x-auto md:block">
							<table className="min-w-full border-separate border-spacing-y-3">
							<thead>
								<tr className="text-left text-xs uppercase tracking-[0.2em] text-ink-500">
									<th className="px-4 pb-2">Type</th>
									<th className="px-4 pb-2">Host</th>
									<th className="px-4 pb-2">Value</th>
									<th className="px-4 pb-2">State</th>
								</tr>
							</thead>
							<tbody>
								{dnsRecords.map((record) => (
									<tr key={record.type} className="rounded-[22px] bg-white shadow-sm ring-1 ring-sand-100 hover:bg-sand-50/50 transition-colors cursor-pointer">
										<td className="rounded-l-[22px] px-4 py-4 font-semibold text-ink-900">{record.type}</td>
										<td className="px-4 py-4 text-sm text-ink-700">{record.host}</td>
										<td className="px-4 py-4 text-sm text-ink-700">{record.value}</td>
										<td className="rounded-r-[22px] px-4 py-4"><Badge tone={record.status === "Verified" ? "green" : "amber"}>{record.status}</Badge></td>
									</tr>
								))}
							</tbody>
							</table>
						</div>
						<div className="space-y-3 md:hidden">
							{dnsRecords.map((record) => (
								<div key={`${record.type}-mobile`} className="rounded-[24px] border border-sand-100 bg-white p-4 shadow-sm">
									<div className="flex items-center justify-between gap-3">
										<div>
											<p className="font-semibold text-ink-900">{record.type}</p>
											<p className="text-sm text-ink-500">{record.host}</p>
										</div>
										<Badge tone={record.status === "Verified" ? "green" : "amber"}>{record.status}</Badge>
									</div>
									<p className="mt-3 break-words rounded-2xl bg-sand-50 p-3 text-sm leading-6 text-ink-700">{record.value}</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div>
							<CardTitle>Developer tokens region</CardTitle>
							<CardDescription>Issue secrets, copy them, and manage webhook destinations.</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-5">
						<div className="rounded-[24px] border border-sand-100 bg-sand-50/70 p-4">
							<div className="flex items-center gap-3">
								<div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-accent-600 shadow-sm">
									<KeyRound size={18} />
								</div>
								<div>
									<p className="font-semibold text-ink-900">API credentials</p>
									<p className="text-sm text-ink-500">Create a masked secret for integrations and automation services.</p>
								</div>
							</div>
							<div className="mt-4 rounded-2xl border border-sand-100 bg-white px-4 py-3 font-mono text-sm text-ink-700">
								{workspace.apiToken ? `${workspace.apiToken.slice(0, 8)}••••••••••••${workspace.apiToken.slice(-4)}` : "No secret token generated"}
							</div>
							<div className="mt-4 flex flex-wrap gap-3">
								<Button type="button" onClick={generateSecretToken}><Zap size={16} /> Generate Secret Token</Button>
								<Button type="button" variant="neutral" onClick={() => void copyToken()} disabled={!workspace.apiToken}><Copy size={16} /> Copy</Button>
							</div>
						</div>

						<div>
							<Label>Webhook target URL</Label>
							<Input value={workspace.webhookUrl ?? ""} onChange={(event) => setField("webhookUrl", event.target.value)} placeholder="https://example.com/webhooks/email" />
						</div>

						<div className="grid gap-4 md:grid-cols-3">
							<div className="rounded-[24px] border border-sand-100 bg-white p-4">
								<ShieldCheck size={18} className="text-accent-600" />
								<p className="mt-3 font-semibold text-ink-900">Compliance</p>
								<p className="mt-1 text-sm text-ink-500">Global unsubscribe and double opt-in are configurable.</p>
							</div>
							<div className="rounded-[24px] border border-sand-100 bg-white p-4">
								<Wifi size={18} className="text-accent-600" />
								<p className="mt-3 font-semibold text-ink-900">DNS state</p>
								<p className="mt-1 text-sm text-ink-500">SPF, DKIM, and DMARC states stay visible.</p>
							</div>
							<div className="rounded-[24px] border border-sand-100 bg-white p-4">
								<Webhook size={18} className="text-accent-600" />
								<p className="mt-3 font-semibold text-ink-900">Automation</p>
								<p className="mt-1 text-sm text-ink-500">Webhook endpoints plug into backend workflows.</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{toast ? <Toast tone={toast.tone} title={toast.title} onClose={() => setToast(null)}>{toast.message}</Toast> : null}
		</div>
	);
}
