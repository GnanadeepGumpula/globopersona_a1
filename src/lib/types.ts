export type DashboardStat = {
	label: string;
	value: string;
	change: string;
	tone: "accent" | "sand";
};

export type PerformancePoint = {
	label: string;
	value: number;
};

export type CampaignTone = "amber" | "green" | "slate";

export type CampaignRow = {
	name: string;
	audience: string;
	sent: string;
	opens: string;
	status: string;
	tone: CampaignTone;
};

export type ActivityItem = {
	title: string;
	detail: string;
	time: string;
};

export type ContactRow = {
	name: string;
	email: string;
	segment: string;
	status: string;
};

export type AudienceSegment = {
	name: string;
	count: string;
	note: string;
};

export type SettingsPanel = {
	title: string;
	description: string;
};

export type NotificationItem = {
	title: string;
	detail: string;
	time: string;
	read?: boolean;
};

export type WorkspaceProfile = {
	name: string;
	brandColor: string;
	supportSignature: string;
	sendingDomain?: string;
};

export type DashboardResponse = {
	stats: DashboardStat[];
	performance: PerformancePoint[];
	recentCampaigns: CampaignRow[];
	activities: ActivityItem[];
};

export type CampaignsResponse = {
	items: CampaignRow[];
};

export type ContactsResponse = {
	contacts: ContactRow[];
	audienceSegments: AudienceSegment[];
};

export type SettingsResponse = {
	panels: SettingsPanel[];
	workspace: WorkspaceProfile;
};

export type SearchResult = {
	href: string;
	title: string;
	description: string;
	group: string;
	keywords: string;
};
