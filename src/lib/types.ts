export type DashboardStat = {
	label: string;
	value: string;
	change: string;
	tone: "accent" | "sand";
};

export type DashboardTrackingScores = {
	campaignVelocity: number;
	engagementRate: number;
	workflowCoverage: number;
	trackingScore: number;
};

export type PerformancePoint = {
	label: string;
	value: number;
};

export type CampaignTone = "amber" | "green" | "slate";

export type CampaignRow = {
	id: string;
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
	entityId?: string | null;
	entityType?: string | null;
};

export type ContactRow = {
	id: string;
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
	globalUnsubscribeLabel?: string;
	doubleOptInEnabled?: boolean;
	doubleOptInSequence?: string;
	postalAddress?: string;
	webhookUrl?: string;
	apiToken?: string;
	preferences?: Record<string, unknown>;
	timezone?: string; // Add this line
};

export type DashboardResponse = {
	stats: DashboardStat[];
	performance: PerformancePoint[];
	recentCampaigns: CampaignRow[];
	activities: ActivityItem[];
	overview?: {
		engagementScore?: number | null;
		deliverability?: number | null;
		audienceFreshness?: number | null;
		trackingScores?: DashboardTrackingScores | null;
	};
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

