import type { ActivityItem, AudienceSegment, CampaignsResponse, ContactRow, ContactsResponse, DashboardResponse, DashboardStat, DashboardTrackingScores, NotificationItem, PerformancePoint, SearchResult, SettingsPanel, SettingsResponse, WorkspaceProfile } from "./types";
import { settingsPanels } from "../config/settingsPanels";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api";

type QueryValue = string | number | boolean | undefined | null;

export class ApiError extends Error {
	status: number;
	details?: unknown;

	constructor(message: string, status: number, details?: unknown) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.details = details;
	}
}

type BackendWorkspaceSettings = {
	id: string;
	workspace_id: string;
	company_name: string;
	reply_to_email: string;
	default_sender_name: string;
	sending_domain: string | null;
	timezone: string;
	logo_url: string | null;
	preferences: Record<string, unknown>;
	created_at: string;
	updated_at: string;
};

type BackendPaginated<T> = {
	data: T[];
	total: number;
	page: number;
	limit: number;
};

type BackendCampaignRecord = {
	id: string;
	name: string;
	subject: string;
	preview_text: string | null;
	content: Record<string, unknown> | null;
	status: "draft" | "scheduled" | "live" | "archived";
	scheduled_at: string | null;
	sent_at: string | null;
	created_at: string;
	updated_at: string;
};

type BackendContactRecord = {
	id: string;
	email: string;
	first_name: string | null;
	last_name: string | null;
	status: "engaged" | "nurture" | "active";
	segment_id: string | null;
	metadata: Record<string, unknown>;
};

type BackendSegmentRecord = {
	id: string;
	name: string;
	description: string | null;
	rules: Record<string, unknown>;
};

type BackendNotificationRecord = {
	id: string;
	title: string;
	body: string | null;
	is_read: boolean;
	created_at: string;
};

type BackendActivityRecord = {
	id: string;
	title: string;
	type: string;
	entity_type: string;
	entity_id: string | null;
	details: Record<string, unknown>;
	created_at: string;
};

type BackendDashboardSummary = {
	campaigns: {
		total: number;
		draft: number;
		scheduled: number;
		live: number;
		archived: number;
		sent: number;
	};
	contacts: {
		total: number;
		engaged: number;
		nurture: number;
		active: number;
	};
	segments: number;
	unreadNotifications: number;
	activityCount: number;
	settingsConfigured: boolean;
	trackingScores: DashboardTrackingScores;
};

type BackendDashboardPerformance = {
	series: Array<{
		date: string;
		campaignsSent: number;
		contactsCreated: number;
	}>;
};

function capitalize(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatTime(value: string) {
	return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function toCampaignRow(record: BackendCampaignRecord) {
	return {
		id: record.id,
		name: record.name,
		audience: record.subject,
		sent: record.sent_at ? formatTime(record.sent_at) : record.status === "scheduled" ? "Scheduled" : "Not sent",
		opens: record.sent_at ? "—" : record.status === "scheduled" ? "Queued" : "—",
		status: capitalize(record.status),
		tone: record.status === "live" ? "green" : record.status === "scheduled" ? "amber" : "slate",
		subject: record.subject,
		clicks: record.status === "live" ? "—" : "—"
	} satisfies CampaignsResponse["items"][number];
}

function toContactRow(record: BackendContactRecord, segmentName?: string) {
	const name = [record.first_name, record.last_name].filter(Boolean).join(" ") || record.email.split("@")[0] || record.email;
	const isUnsubscribed = Boolean(record.metadata?.unsubscribed);
	return {
		id: record.id,
		name,
		email: record.email,
		segment: segmentName ?? "Unassigned",
		status: isUnsubscribed ? "Unsubscribed" : capitalize(record.status)
	} satisfies ContactRow;
}

function toAudienceSegment(record: BackendSegmentRecord, count: number) {
	return {
		name: record.name,
		count: String(count),
		note: record.description ?? "Segment synced from the backend database"
	} satisfies AudienceSegment;
}

function toNotificationItem(record: BackendNotificationRecord) {
	return {
		title: record.title,
		detail: record.body ?? "No detail provided.",
		time: formatTime(record.created_at),
		read: record.is_read
	} satisfies NotificationItem;
}

function toActivityItem(record: BackendActivityRecord) {
	return {
		title: record.title,
		detail: record.details && Object.keys(record.details).length ? JSON.stringify(record.details) : record.type,
		time: formatTime(record.created_at),
		entityId: record.entity_id,
		entityType: record.entity_type
	} satisfies ActivityItem;
}

function toSettingsResponse(record: BackendWorkspaceSettings): SettingsResponse {
	const preferences = record.preferences as Record<string, unknown>;
	return {
		panels: [...settingsPanels],
		workspace: {
			name: record.company_name,
			brandColor: String(preferences.brandColor ?? "#2f8f7b"),
			supportSignature: String(preferences.supportSignature ?? record.default_sender_name),
			sendingDomain: record.sending_domain ?? undefined,
			globalUnsubscribeLabel: String(preferences.globalUnsubscribeLabel ?? "Unsubscribe"),
			doubleOptInEnabled: Boolean(preferences.doubleOptInEnabled ?? false),
			doubleOptInSequence: String(preferences.doubleOptInSequence ?? "Welcome sequence"),
			postalAddress: String(preferences.postalAddress ?? ""),
			webhookUrl: String(preferences.webhookUrl ?? ""),
			apiToken: String(preferences.apiToken ?? ""),
			preferences
		}
	};
}

function toBackendSettingsUpdate(workspace: WorkspaceProfile) {
	return {
		companyName: workspace.name,
		defaultSenderName: workspace.supportSignature || workspace.name,
		replyToEmail: `${workspace.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "workspace"}@globopersona.com`,
		sendingDomain: workspace.sendingDomain ?? null,
		timezone: "UTC",
		preferences: {
			brandColor: workspace.brandColor,
			supportSignature: workspace.supportSignature,
			globalUnsubscribeLabel: workspace.globalUnsubscribeLabel,
			doubleOptInEnabled: workspace.doubleOptInEnabled,
			doubleOptInSequence: workspace.doubleOptInSequence,
			postalAddress: workspace.postalAddress,
			webhookUrl: workspace.webhookUrl,
			apiToken: workspace.apiToken,
			...(workspace.preferences ?? {})
		}
	};
}

function resolveApiBaseUrl() {
	// If the environment explicitly contains an absolute URL, prefer it (works in browser and server)
	if (apiBaseUrl && (apiBaseUrl.startsWith("http://") || apiBaseUrl.startsWith("https://"))) {
		return apiBaseUrl.replace(/\/$/, "") + "/";
	}

	// Otherwise, when running in the browser, resolve relative API paths against the current origin
	if (typeof window !== "undefined") {
		return new URL(apiBaseUrl || "/api/", window.location.origin).toString();
	}

	// Server-side fallback: assume localhost:3000 when no absolute URL provided
	return `http://localhost:3000${apiBaseUrl && apiBaseUrl.startsWith("/") ? apiBaseUrl : `/${apiBaseUrl || "api"}`}/`;
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
	const url = new URL(path.replace(/^\//, ""), resolveApiBaseUrl());

	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined && value !== null && value !== "") {
				url.searchParams.set(key, String(value));
			}
		}
	}

	return url.toString();
}

async function fetchJson<T>(path: string, query?: Record<string, QueryValue>, init?: RequestInit) {
	const response = await fetch(buildUrl(path, query), {
		cache: "no-store",
		...init,
		headers: {
			"Content-Type": "application/json",
			...(init?.headers ?? {})
		}
	});

	if (!response.ok) {
		let message = `Request failed with status ${response.status}`;
		let details: unknown;

		try {
			const errorBody = await response.json() as { error?: { message?: string; details?: unknown } };
			if (errorBody?.error?.message) {
				message = errorBody.error.message;
			}
			details = errorBody?.error?.details;
		} catch {
			// ignore non-JSON error responses
		}

		throw new ApiError(message, response.status, details);
	}

	const payload = await response.json() as T | { data: T };

	if (payload && typeof payload === "object" && "data" in payload && Object.keys(payload).length === 1) {
		return payload.data;
	}

	return payload as T;
}

export async function getDashboardData() {
	const [summary, performance, recentCampaigns, activities] = await Promise.all([
		fetchJson<BackendDashboardSummary>("/dashboard/summary"),
		fetchJson<BackendDashboardPerformance>("/dashboard/performance", { days: 7 }),
		fetchJson<BackendCampaignRecord[]>("/dashboard/recent-campaigns", { limit: 4 }),
		fetchJson<BackendActivityRecord[]>("/activities", { limit: 4 })
	]);

	const campaignStats: DashboardStat[] = [
		{ label: "Campaigns", value: String(summary.campaigns.total), change: `${summary.campaigns.sent} sent`, tone: "accent" },
		{ label: "Contacts", value: String(summary.contacts.total), change: `${summary.contacts.engaged} engaged`, tone: "sand" },
		{ label: "Segments", value: String(summary.segments), change: `${summary.settingsConfigured ? "Configured" : "Needs setup"}`, tone: "accent" },
		{ label: "Alerts", value: String(summary.unreadNotifications), change: `${summary.activityCount} recent events`, tone: "sand" }
	];

	const campaignPerformance: PerformancePoint[] = performance.series.map((item) => ({
		label: item.date.slice(5),
		value: Math.min(100, item.campaignsSent * 60 + item.contactsCreated * 20)
	}));

	// derive simple overview metrics for the send-quality panel
	const engagementScore = summary.contacts.total ? Math.round((summary.contacts.engaged / Math.max(1, summary.contacts.total)) * 100) : null;
	const deliverability = summary.campaigns.sent || summary.campaigns.scheduled ? Math.round((summary.campaigns.sent / Math.max(1, summary.campaigns.sent + summary.campaigns.scheduled)) * 100) : null;
	const audienceFreshness = summary.contacts.total ? Math.round((summary.contacts.active / Math.max(1, summary.contacts.total)) * 100) : null;

	const recentCampaignRows = recentCampaigns.map(toCampaignRow);
	const activityRows = activities.slice(0, 4).map(toActivityItem);

	return {
		stats: campaignStats,
		performance: campaignPerformance,
		recentCampaigns: recentCampaignRows,
		activities: activityRows,
		overview: {
			engagementScore,
			deliverability,
			audienceFreshness,
			trackingScores: summary.trackingScores
		}
	} satisfies DashboardResponse;
}

export async function getCampaign(campaignId: string) {
	return fetchJson<BackendCampaignRecord>(`/campaigns/${campaignId}`);
}

export async function getCampaigns(query?: { status?: string; search?: string; page?: number; limit?: number }) {
	const response = await fetchJson<BackendPaginated<BackendCampaignRecord>>("/campaigns", {
		status: query?.status,
		q: query?.search,
		page: (query as any)?.page,
		limit: (query as any)?.limit
	});

	return {
		items: response.data.map(toCampaignRow),
		total: response.total,
		page: response.page,
		limit: response.limit
	} as unknown as CampaignsResponse & { total?: number; page?: number; limit?: number };
}

export async function updateCampaign(campaignId: string, payload: Partial<{ name: string; subject: string; previewText: string | null; content: Record<string, unknown>; status: string; scheduledAt: string | null }>) {
	const response = await fetchJson<BackendCampaignRecord>(`/campaigns/${campaignId}`, undefined, {
		method: "PATCH",
		body: JSON.stringify(payload)
	});

	return response;
}

export async function deleteCampaign(campaignId: string) {
	return fetchJson<{ success: boolean }>(`/campaigns/${campaignId}`, undefined, {
		method: "DELETE"
	});
}

export async function createContact(payload: { email: string; firstName?: string | null; lastName?: string | null; status?: string; segmentId?: string | null; metadata?: Record<string, unknown> }) {
	return fetchJson<BackendContactRecord>("/contacts", undefined, {
		method: "POST",
		body: JSON.stringify(payload)
	});
}

export async function updateContact(contactId: string, payload: Partial<{ email: string; firstName: string | null; lastName: string | null; status: string; segmentId: string | null; metadata: Record<string, unknown> }>) {
	return fetchJson<BackendContactRecord>(`/contacts/${contactId}`, undefined, {
		method: "PATCH",
		body: JSON.stringify(payload)
	});
}

export async function deleteContact(contactId: string) {
	return fetchJson<{ success: boolean }>(`/contacts/${contactId}`, undefined, {
		method: "DELETE"
	});
}

export async function getContacts(query?: { search?: string; page?: number; limit?: number }) {
	const [contactsResponse, segmentsResponse] = await Promise.all([
		fetchJson<BackendPaginated<BackendContactRecord>>("/contacts", { q: query?.search, page: (query as any)?.page, limit: (query as any)?.limit }),
		fetchJson<BackendSegmentRecord[]>("/segments")
	]);

	const segmentCounts = new Map<string, number>();
	for (const contact of contactsResponse.data) {
		if (contact.segment_id) {
			segmentCounts.set(contact.segment_id, (segmentCounts.get(contact.segment_id) ?? 0) + 1);
		}
	}

	const segmentNames = new Map(segmentsResponse.map((segment) => [segment.id, segment.name]));

	return {
		contacts: contactsResponse.data.map((contact) => toContactRow(contact, contact.segment_id ? segmentNames.get(contact.segment_id) : undefined)),
		audienceSegments: segmentsResponse.map((segment) => toAudienceSegment(segment, segmentCounts.get(segment.id) ?? 0)),
		total: contactsResponse.total,
		page: contactsResponse.page,
		limit: contactsResponse.limit
	} as unknown as ContactsResponse & { total?: number; page?: number; limit?: number };
}

export async function createCampaign(payload: { name: string; subject: string; previewText?: string | null; content?: Record<string, unknown>; status?: string; scheduledAt?: string | null }) {
	const response = await fetchJson<BackendCampaignRecord>("/campaigns", undefined, {
		method: "POST",
		body: JSON.stringify(payload)
	});

	return toCampaignRow(response);
}

export async function scheduleCampaign(campaignId: string, payload: { scheduledAt: string }) {
	const response = await fetchJson<BackendCampaignRecord>(`/campaigns/${campaignId}/schedule`, undefined, {
		method: "POST",
		body: JSON.stringify(payload)
	});

	return toCampaignRow(response);
}

export async function getSettings() {
	const response = await fetchJson<BackendWorkspaceSettings>("/settings");
	return toSettingsResponse(response);
}

export async function updateSettings(workspace: WorkspaceProfile) {
	const response = await fetchJson<BackendWorkspaceSettings>("/settings", undefined, {
		method: "PATCH",
		body: JSON.stringify(toBackendSettingsUpdate(workspace))
	});

	return toSettingsResponse(response);
}

export async function getNotifications() {
	const response = await fetchJson<BackendNotificationRecord[]>("/notifications");
	return {
		items: response.map(toNotificationItem)
	};
}

export async function markAllNotificationsRead() {
	return fetchJson<{ success: boolean }>("/notifications/mark-all-read", undefined, {
		method: "POST"
	});
}

export async function getSearchResults(query: string) {
	const response = await fetchJson<{
		campaigns: Array<{ id: string; name: string; subject: string; status: string }>;
		contacts: Array<{ id: string; email: string; first_name: string | null; last_name: string | null; status: string }>;
		activities: Array<{ id: string; title: string; type: string }>;
		settings: Array<{ id: string; company_name: string; reply_to_email: string; default_sender_name: string; timezone: string }>;
	}>("/search", { q: query });

	const results: SearchResult[] = [
		...response.campaigns.map((item) => ({
			href: "/campaigns",
			title: item.name,
			description: item.subject,
			group: "Campaigns",
			keywords: item.status
		})),
		...response.contacts.map((item) => ({
			href: "/contacts",
			title: [item.first_name, item.last_name].filter(Boolean).join(" ") || item.email,
			description: item.email,
			group: "Contacts",
			keywords: item.status
		})),
		...response.activities.map((item) => ({
			href: "/",
			title: item.title,
			description: item.type,
			group: "Activity",
			keywords: item.type
		})),
		...response.settings.map((item) => ({
			href: "/settings",
			title: item.company_name,
			description: `${item.default_sender_name} · ${item.reply_to_email}`,
			group: "Settings",
			keywords: item.timezone
		}))
	];

	return { items: results.slice(0, 10) };
}

export async function getActivities(query?: { limit?: number; entityId?: string; entityType?: string }) {
	const response = await fetchJson<BackendActivityRecord[]>("/activities", {
		limit: query?.limit,
		entityId: query?.entityId,
		entityType: query?.entityType
	});
	return {
		items: response.map(toActivityItem)
	};
}

export async function getSegments() {
	const [segmentsResponse, contactsResponse] = await Promise.all([
		fetchJson<BackendSegmentRecord[]>("/segments"),
		fetchJson<BackendPaginated<BackendContactRecord>>("/contacts", { limit: 1000 })
	]);

	const segmentCounts = new Map<string, number>();
	for (const contact of contactsResponse.data) {
		if (contact.segment_id) {
			segmentCounts.set(contact.segment_id, (segmentCounts.get(contact.segment_id) ?? 0) + 1);
		}
	}

	return {
		items: segmentsResponse.map((segment) => toAudienceSegment(segment, segmentCounts.get(segment.id) ?? 0))
	};
}
