import type { ActivityItem, AudienceSegment, CampaignsResponse, ContactRow, ContactsResponse, DashboardResponse, DashboardStat, NotificationItem, PerformancePoint, SearchResult, SettingsPanel, SettingsResponse, WorkspaceProfile } from "./types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api";

const settingsPanels: SettingsPanel[] = [
	{ title: "Brand profile", description: "Tune the workspace name, sender details, and support signature." },
	{ title: "Delivery controls", description: "Review sending domain, timezone, and campaign delivery defaults." },
	{ title: "Team readiness", description: "Keep role coverage and compliance cues visible for operators." }
];

type QueryValue = string | number | boolean | undefined | null;

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
	status: "draft" | "scheduled" | "live" | "archived";
	scheduled_at: string | null;
	sent_at: string | null;
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
		name: record.name,
		audience: record.subject,
		sent: record.sent_at ? formatTime(record.sent_at) : record.status === "scheduled" ? "Scheduled" : "Not sent",
		opens: record.status === "live" ? "74%" : record.status === "scheduled" ? "Queued" : "—",
		status: capitalize(record.status),
		tone: record.status === "live" ? "green" : record.status === "scheduled" ? "amber" : "slate"
	} satisfies CampaignsResponse["items"][number];
}

function toContactRow(record: BackendContactRecord, segmentName?: string) {
	const name = [record.first_name, record.last_name].filter(Boolean).join(" ") || record.email.split("@")[0] || record.email;
	return {
		name,
		email: record.email,
		segment: segmentName ?? "Unassigned",
		status: capitalize(record.status)
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
		time: formatTime(record.created_at)
	} satisfies ActivityItem;
}

function toSettingsResponse(record: BackendWorkspaceSettings): SettingsResponse {
	return {
		panels: settingsPanels,
		workspace: {
			name: record.company_name,
			brandColor: String(record.preferences.brandColor ?? "#2f8f7b"),
			supportSignature: String(record.preferences.supportSignature ?? record.default_sender_name),
			sendingDomain: record.sending_domain ?? undefined
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
			supportSignature: workspace.supportSignature
		}
	};
}

function resolveApiBaseUrl() {
	if (typeof window !== "undefined") {
		return new URL("/api/", window.location.origin).toString();
	}

	if (apiBaseUrl.startsWith("http://") || apiBaseUrl.startsWith("https://")) {
		return apiBaseUrl;
	}

	return `http://localhost:3000${apiBaseUrl.startsWith("/") ? apiBaseUrl : `/${apiBaseUrl}`}/`;
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
		throw new Error(`Request failed with status ${response.status}`);
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

	const recentCampaignRows = recentCampaigns.map(toCampaignRow);
	const activityRows = activities.slice(0, 4).map(toActivityItem);

	return {
		stats: campaignStats,
		performance: campaignPerformance,
		recentCampaigns: recentCampaignRows,
		activities: activityRows
	} satisfies DashboardResponse;
}

export async function getCampaigns(query?: { status?: string; search?: string }) {
	const response = await fetchJson<BackendPaginated<BackendCampaignRecord>>("/campaigns", {
		status: query?.status,
		q: query?.search
	});

	return {
		items: response.data.map(toCampaignRow)
	} satisfies CampaignsResponse;
}

export async function getContacts(query?: { search?: string }) {
	const [contactsResponse, segmentsResponse] = await Promise.all([
		fetchJson<BackendPaginated<BackendContactRecord>>("/contacts", { q: query?.search }),
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
		audienceSegments: segmentsResponse.map((segment) => toAudienceSegment(segment, segmentCounts.get(segment.id) ?? 0))
	} satisfies ContactsResponse;
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

export async function getActivities() {
	const response = await fetchJson<BackendActivityRecord[]>("/activities");
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
