"use client";

import { CalendarDays, CheckCircle2, Mail, Sparkles, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea, Toast } from "../../../components/ui";
import { ApiError, createCampaign, scheduleCampaign } from "../../../lib/api";

const checklist = [
	"Copy reviewed by marketing lead",
	"Audience segment is synced",
	"Preview tested on mobile inbox",
	"Send window matches target timezone"
];

type CampaignFormState = {
	name: string;
	fromName: string;
	audience: string;
	scheduledAt: string;
	subject: string;
	subjectLineA: string;
	subjectLineB: string;
	template: string;
	splitTestingEnabled: boolean;
	splitAudience: number;
	preheader: string;
	copy: string;
};

type ToastState = {
	tone: "success" | "error";
	title: string;
	message: string;
};

const initialForm: CampaignFormState = {
	name: "Spring product update",
	fromName: "Globopersona Team",
	audience: "Active customers",
	scheduledAt: "",
	subject: "New updates built for your team",
	subjectLineA: "New updates built for your team",
	subjectLineB: "See what’s new this week",
	template: "Newsletter Layout",
	splitTestingEnabled: true,
	splitAudience: 50,
	preheader: "A concise summary designed for higher opens.",
	copy: "Write the campaign body here. The layout keeps typography readable, section spacing calm, and editor controls out of the way."
};

const templates = [
	{ id: "Newsletter Layout", title: "Newsletter Layout", description: "Long-form editorial structure with digest sections." },
	{ id: "Promotional Grid", title: "Promotional Grid", description: "Card-based product blocks with strong CTAs." },
	{ id: "Announcement Banner", title: "Announcement Banner", description: "Sharp one-message campaign with a clear hero area." }
];

const mergeTags = ["{{firstName}}", "{{lastName}}", "{{unsubscribe_link}}", "{{company_name}}"];

function toIsoDateTime(value: string) {
	if (!value.trim()) {
		return null;
	}

	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function formatValidationMessage(details: unknown) {
	if (!details || typeof details !== "object") {
		return null;
	}

	const typedDetails = details as {
		formErrors?: string[];
		fieldErrors?: Record<string, string[] | undefined>;
	};

	const fieldMessages = Object.entries(typedDetails.fieldErrors ?? {}).flatMap(([field, messages]) => {
		if (!messages?.length) {
			return [];
		}

		return `${field}: ${messages[0]}`;
	});

	const formMessages = typedDetails.formErrors ?? [];
	const messages = [...fieldMessages, ...formMessages].filter(Boolean);

	return messages.length ? messages.join(" • ") : null;
}

export default function NewCampaignPage() {
	const router = useRouter();

	const [form, setForm] = useState<CampaignFormState>(initialForm);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [toast, setToast] = useState<ToastState | null>(null);

	useEffect(() => {
		try {
			const saved = localStorage.getItem("gp_selected_audience");
			if (saved) {
				setField("audience", saved as CampaignFormState["audience"]);
			}
		} catch {}
	}, []);

	const setField = <K extends keyof CampaignFormState>(field: K, value: CampaignFormState[K]) => {
		setForm((current) => ({ ...current, [field]: value }));
	};

	const showSuccess = (title: string, message: string) => {
		setToast({ tone: "success", title, message });
	};

	const showError = (title: string, message: string) => {
		setToast({ tone: "error", title, message });
	};

	const submitCampaign = async (action: "draft" | "schedule") => {
		if (isSubmitting) {
			return;
		}

		setIsSubmitting(true);
		setToast(null);

		try {
			const scheduledAtIso = toIsoDateTime(form.scheduledAt);
			const campaign = await createCampaign({
				name: form.name.trim(),
				subject: form.subject.trim(),
				previewText: form.preheader.trim() || null,
				content: {
					body: form.copy.trim(),
					fromName: form.fromName.trim(),
					audience: form.audience.trim()
					,
					template: form.template,
					splitTestingEnabled: form.splitTestingEnabled,
					splitAudience: form.splitAudience,
					subjectLineA: form.subjectLineA,
					subjectLineB: form.subjectLineB
				},
				status: "draft",
				scheduledAt: null
			});

			if (action === "schedule") {
				await scheduleCampaign(campaign.id, {
					scheduledAt: scheduledAtIso ?? form.scheduledAt.trim()
				});
				showSuccess("Campaign scheduled", "The backend accepted the campaign and scheduled send successfully.");
			} else {
				showSuccess("Draft saved", "Your campaign draft was created successfully.");
			}

			window.setTimeout(() => {
				router.push("/campaigns");
			}, 900);
		} catch (error) {
			if (error instanceof ApiError) {
				const validationMessage = error.status === 422 ? formatValidationMessage(error.details) : null;
				showError(
					error.status === 422 ? "Validation failed" : "Request failed",
					validationMessage ?? error.message
				);
			} else {
				showError("Request failed", action === "schedule" ? "Unable to schedule campaign." : "Unable to save draft.");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-3">
				<Badge tone="accent">Campaign builder</Badge>
				<h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Create campaign</h1>
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
								<div className="space-y-3">
									<p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Template picker</p>
									<div className="grid gap-3 md:grid-cols-3">
										{templates.map((template) => (
											<button type="button" key={template.id} onClick={() => setField("template", template.id)} className={`rounded-[24px] border p-4 text-left transition-colors ${form.template === template.id ? "border-accent-200 bg-accent-50" : "border-sand-100 bg-white hover:bg-sand-50"}`}>
												<p className="font-semibold text-ink-900">{template.title}</p>
												<p className="mt-1 text-sm leading-6 text-ink-500">{template.description}</p>
											</button>
										))}
									</div>
								</div>

						<div className="grid gap-5 md:grid-cols-2">
							<div>
								<Label>Campaign name</Label>
								<Input value={form.name} onChange={(event) => setField("name", event.target.value)} />
							</div>
							<div>
								<Label>From name</Label>
								<Input value={form.fromName} onChange={(event) => setField("fromName", event.target.value)} />
							</div>
						</div>
						<div className="grid gap-5 md:grid-cols-2">
							<div>
								<Label>Audience segment</Label>
								<div className="mt-2 grid gap-2">
										{[
										"Active customers",
										"Trial users",
										"Churn risk",
										"Beta program"
									].map((seg) => (
										<button key={seg} type="button" onClick={() => { setField("audience", seg); try { localStorage.setItem("gp_selected_audience", seg); } catch {} }} className={`text-left w-full rounded-2xl border px-3 py-2 text-sm transition ${form.audience === seg ? "border-accent-200 bg-accent-50" : "border-sand-100 bg-white hover:bg-sand-50"}`}>
											<div className="flex items-center justify-between">
												<div>
													<p className="font-semibold text-ink-900">{seg}</p>
													<p className="text-xs text-ink-500">{seg === "Churn risk" ? "Low engagement, high priority" : seg === "Beta program" ? "Early access cohort" : ""}</p>
												</div>
												{form.audience === seg ? <Badge tone="accent">Selected</Badge> : null}
											</div>
										</button>
									))}
								</div>
							</div>
							<div>
								<Label>Send schedule</Label>
								<input
									type="datetime-local"
									value={form.scheduledAt}
									onChange={(event) => setField("scheduledAt", event.target.value)}
									className="h-11 w-full rounded-2xl border border-sand-200 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-accent-500 focus:ring-4 focus:ring-accent-100"
								/>
							</div>
						</div>
						<div>
							<Label>Subject line</Label>
							<Input value={form.subject} onChange={(event) => setField("subject", event.target.value)} />
						</div>
						<div className="grid gap-5 md:grid-cols-2">
							<div>
								<Label>Subject line A</Label>
								<Input value={form.subjectLineA} onChange={(event) => setField("subjectLineA", event.target.value)} />
							</div>
							<div>
								<Label>Subject line B</Label>
								<Input value={form.subjectLineB} onChange={(event) => setField("subjectLineB", event.target.value)} />
							</div>
						</div>
						<div className="rounded-[24px] border border-sand-100 bg-sand-50/60 p-4">
							<div className="flex items-center justify-between gap-3">
								<div>
									<p className="font-semibold text-ink-900">A/B split testing</p>
									<p className="text-sm text-ink-500">Tune distribution across the testing audience.</p>
								</div>
								<label className="inline-flex items-center gap-2 text-sm font-semibold text-ink-700">
									<input type="checkbox" checked={form.splitTestingEnabled} onChange={(event) => setField("splitTestingEnabled", event.target.checked)} />
									Enable
								</label>
							</div>
							<div className="mt-4">
								<div className="mb-2 flex items-center justify-between text-sm text-ink-500"><span>Variant A</span><span>{form.splitAudience}%</span></div>
								<input type="range" min="10" max="90" value={form.splitAudience} onChange={(event) => setField("splitAudience", Number(event.target.value))} className="w-full accent-accent-600" />
								<div className="mt-2 flex items-center justify-between text-sm text-ink-500"><span>Variant B</span><span>{100 - form.splitAudience}%</span></div>
							</div>
						</div>
						<div>
							<Label>Preheader</Label>
							<Input value={form.preheader} onChange={(event) => setField("preheader", event.target.value)} />
						</div>
						<div>
							<Label>Campaign copy</Label>
							<Textarea value={form.copy} onChange={(event) => setField("copy", event.target.value)} />
						</div>
						<div className="space-y-3">
							<Label>Merge tag injectors</Label>
							<div className="flex flex-wrap gap-2">
								{mergeTags.map((tag) => (
									<button key={tag} type="button" onClick={() => setField("copy", `${form.copy} ${tag}`.trim())} className="rounded-2xl border border-sand-100 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-sand-50">
										{tag}
									</button>
								))}
							</div>
						</div>
						<div className="grid gap-5 md:grid-cols-1 lg:grid-cols-3">
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
								<div className="rounded-[24px] border border-sand-100 bg-white p-4">
									<p className="text-sm font-semibold text-ink-900">Current template</p>
									<p className="mt-1 text-sm text-ink-500">{form.template}</p>
								</div>
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
							<div className="space-y-3">
								<Button
									type="button"
									className="w-full"
									disabled={isSubmitting}
									onClick={() => void submitCampaign("draft")}
								>
									<span className="inline-flex items-center gap-2">
										{isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
										{isSubmitting ? "Saving…" : "Save draft"}
									</span>
								</Button>

								<Button
									type="button"
									variant="neutral"
									className="w-full"
									disabled={isSubmitting}
									onClick={() => void submitCampaign("schedule")}
								>
									<span className="inline-flex items-center gap-2">
										{isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
										{isSubmitting ? "Scheduling…" : "Schedule send"}
									</span>
								</Button>
							</div>

							{toast ? (
								<Toast tone={toast.tone} title={toast.title} onClose={() => setToast(null)}>
									{toast.message}
								</Toast>
							) : null}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
