"use client";

import { ArrowRight, Filter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui";
import { getCampaigns } from "../../lib/api";
import type { CampaignRow } from "../../lib/types";

const filters = ["All campaigns", "Scheduled", "Live", "Draft", "Archived"];

export default function CampaignsPage() {
  const [activeFilter, setActiveFilter] = useState("All campaigns");
  const [query, setQuery] = useState("");
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCampaigns({
          status: activeFilter === "All campaigns" ? undefined : activeFilter,
          search: query.trim() || undefined
        });

        if (isMounted) {
          setCampaigns(data.items);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load campaigns from the backend.");
          setCampaigns([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadCampaigns();

    return () => {
      isMounted = false;
    };
  }, [activeFilter, query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-600">Campaign center</p>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Campaigns list</h1>
        <p className="max-w-3xl text-sm leading-6 text-ink-500">A cleaner operational view with easy filtering, stronger row hierarchy, and visible status states.</p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 border-b border-sand-100 pb-5">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-sand-100 bg-sand-50 px-4 py-2 text-sm font-medium text-ink-700">
            <Filter size={16} /> Filters
          </div>
          {filters.map((item, index) => (
            <button key={item} type="button" onClick={() => setActiveFilter(item)} className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${activeFilter === item ? "bg-ink-900 text-white shadow-sm" : "bg-white text-ink-700 hover:bg-sand-50"}`}>
              {item}
            </button>
          ))}
          <div className="w-full min-w-0 sm:ml-auto sm:min-w-[240px] sm:flex-1 lg:flex-none">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search campaigns" className="h-11 w-full rounded-2xl border border-sand-200 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-accent-500 focus:ring-4 focus:ring-accent-100" />
          </div>
        </CardContent>

        <CardContent className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.2em] text-ink-500">
                <th scope="col" className="px-4 pb-2">Campaign</th>
                <th scope="col" className="px-4 pb-2">Audience</th>
                <th scope="col" className="px-4 pb-2">Delivered</th>
                <th scope="col" className="px-4 pb-2">Open rate</th>
                <th scope="col" className="px-4 pb-2">Status</th>
                <th scope="col" className="px-4 pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="rounded-[22px] border border-dashed border-sand-100 bg-white px-4 py-8 text-sm text-ink-500" colSpan={6}>
                    Loading campaigns from the backend...
                  </td>
                </tr>
              ) : null}
              {!loading && error ? (
                <tr>
                  <td className="rounded-[22px] border border-dashed border-orange-100 bg-orange-50 px-4 py-8 text-sm text-orange-700" colSpan={6}>
                    {error}
                  </td>
                </tr>
              ) : null}
              {!loading && !error ? campaigns.map((campaign) => (
                <tr key={campaign.name} className="rounded-[22px] bg-white shadow-sm ring-1 ring-sand-100">
                  <td className="rounded-l-[22px] px-4 py-4">
                    <p className="font-semibold text-ink-900">{campaign.name}</p>
                    <p className="text-sm text-ink-500">Optimized preview subject and header</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-ink-700">{campaign.audience}</td>
                  <td className="px-4 py-4 text-sm text-ink-700">{campaign.sent}</td>
                  <td className="px-4 py-4 text-sm text-ink-700">{campaign.opens}</td>
                  <td className="px-4 py-4"><Badge tone={campaign.tone === "green" ? "green" : campaign.tone === "amber" ? "amber" : "slate"}>{campaign.status}</Badge></td>
                  <td className="rounded-r-[22px] px-4 py-4 text-right">
                    <Link href="/campaigns/new" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600">
                      Edit <ArrowRight size={16} />
                    </Link>
                  </td>
                </tr>
              )) : null}
              {!loading && !error && !campaigns.length ? (
                <tr>
                  <td className="rounded-[22px] border border-dashed border-sand-100 bg-white px-4 py-8 text-sm text-ink-500" colSpan={6}>
                    No campaigns match the current filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          <div className="mt-4 space-y-3 md:hidden">
            {campaigns.map((campaign) => (
              <div key={`${campaign.name}-mobile`} className="rounded-[24px] border border-sand-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink-900">{campaign.name}</p>
                    <p className="mt-1 text-sm text-ink-500">{campaign.audience}</p>
                  </div>
                  <Badge tone={campaign.tone === "green" ? "green" : campaign.tone === "amber" ? "amber" : "slate"}>{campaign.status}</Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-ink-500">Delivered</p>
                    <p className="font-semibold text-ink-900">{campaign.sent}</p>
                  </div>
                  <div>
                    <p className="text-ink-500">Open rate</p>
                    <p className="font-semibold text-ink-900">{campaign.opens}</p>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <Link href="/campaigns/new" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600">
                    Edit <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Launch readiness</CardTitle>
              <CardDescription>Five quick checks before a campaign goes out.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-ink-600">
            <div className="rounded-2xl bg-sand-50 p-4">Audience selected and validated</div>
            <div className="rounded-2xl bg-sand-50 p-4">Content review completed</div>
            <div className="rounded-2xl bg-sand-50 p-4">Schedule set for best send window</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Delivery health</CardTitle>
              <CardDescription>Brand-safe sender performance and reputation signals.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-500">Inbox placement</span>
              <span className="font-semibold text-ink-900">92%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-500">Unsubscribe rate</span>
              <span className="font-semibold text-ink-900">0.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-500">Spam complaints</span>
              <span className="font-semibold text-ink-900">Very low</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Create once, reuse often</CardTitle>
              <CardDescription>The layout supports human operations, not just visuals.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-ink-500">Each campaign row behaves like a working object: it surfaces its status, audience, and next action without requiring the user to open another screen.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}