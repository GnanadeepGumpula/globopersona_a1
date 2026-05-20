export type DashboardStat = {
  label: string;
  value: string;
  change: string;
  tone: "accent" | "sand";
};

export const dashboardStats: DashboardStat[] = [
  { label: "Campaigns sent", value: "248", change: "+12%", tone: "accent" },
  { label: "Open rate", value: "38.4%", change: "+4.1%", tone: "sand" },
  { label: "Click-through", value: "7.9%", change: "+1.2%", tone: "accent" },
  { label: "Active automations", value: "14", change: "+2", tone: "sand" }
];

export const campaignPerformance = [
  { label: "Mon", value: 58 },
  { label: "Tue", value: 71 },
  { label: "Wed", value: 63 },
  { label: "Thu", value: 79 },
  { label: "Fri", value: 84 },
  { label: "Sat", value: 67 },
  { label: "Sun", value: 52 }
];

export type CampaignTone = "amber" | "green" | "slate";

export type CampaignRow = {
  name: string;
  audience: string;
  sent: string;
  opens: string;
  status: string;
  tone: CampaignTone;
};

export const recentCampaigns: CampaignRow[] = [
  {
    name: "Q2 welcome sequence",
    audience: "New subscribers",
    sent: "12,450",
    opens: "41.2%",
    status: "Scheduled",
    tone: "amber"
  },
  {
    name: "Spring product update",
    audience: "Active customers",
    sent: "18,210",
    opens: "39.8%",
    status: "Live",
    tone: "green"
  },
  {
    name: "Win-back offer",
    audience: "Dormant leads",
    sent: "8,740",
    opens: "33.1%",
    status: "Draft",
    tone: "slate"
  }
];

export type ActivityItem = {
  title: string;
  detail: string;
  time: string;
};

export const activities: ActivityItem[] = [
  { title: "Campaign approved", detail: "Marketing team approved the Spring product update campaign.", time: "8 min ago" },
  { title: "Automation triggered", detail: "Abandoned cart journey sent follow-up email to 212 contacts.", time: "36 min ago" },
  { title: "Segment refreshed", detail: "High-intent leads list synced from the latest form submissions.", time: "2 hours ago" }
];

export type ContactRow = {
  name: string;
  email: string;
  segment: string;
  status: string;
};

export const contacts: ContactRow[] = [
  { name: "Ava Thompson", email: "ava.thompson@northpeak.co", segment: "Enterprise", status: "Engaged" },
  { name: "Marcus Lee", email: "marcus.lee@northpeak.co", segment: "Trials", status: "Nurture" },
  { name: "Elena Garcia", email: "elena.garcia@northpeak.co", segment: "Webinar", status: "Active" },
  { name: "Noah Patel", email: "noah.patel@northpeak.co", segment: "Product tour", status: "Engaged" }
];

export type AudienceSegment = {
  name: string;
  count: string;
  note: string;
};

export const audienceSegments: AudienceSegment[] = [
  { name: "High intent", count: "2,148", note: "Opened 3+ campaigns in the last 30 days." },
  { name: "At risk", count: "634", note: "No activity for more than 45 days." },
  { name: "Repeat buyers", count: "891", note: "Purchased more than twice this quarter." }
];

export type SettingsPanel = {
  title: string;
  description: string;
};

export const settingsPanels: SettingsPanel[] = [
  {
    title: "Brand profile",
    description: "Company identity used across campaigns and email footers."
  },
  {
    title: "Sending domain",
    description: "Configure the verified domain that sends transactional and marketing email."
  },
  {
    title: "Team access",
    description: "Control permissions for marketing, sales, and support contributors."
  }
];