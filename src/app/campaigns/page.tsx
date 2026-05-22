"use client";

import { ArrowRight, ChevronDown, Copy, Filter, MailX, PauseCircle, PlayCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, TableSkeleton, Toast } from "../../components/ui";
import { ApiError, createCampaign, deleteCampaign, getCampaigns, updateCampaign } from "../../lib/api";
import type { CampaignRow } from "../../lib/types";

const filters = [
  { label: "All campaigns", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Live", value: "live" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" }
] as const;

export default function CampaignsPage() {
  return (
    <Suspense fallback={<CampaignsSkeleton />}>
      <CampaignsPageContent />
    </Suspense>
  );
}

function CampaignsSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="space-y-4 py-5">
          <div className="h-4 w-32 animate-pulse rounded-md bg-sand-100" />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <div className="h-10 animate-pulse rounded-2xl bg-sand-100" />
            <div className="h-10 animate-pulse rounded-2xl bg-sand-100" />
            <div className="h-10 animate-pulse rounded-2xl bg-sand-100" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-3 py-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid grid-cols-[1.6fr_1fr_0.9fr_0.9fr_0.8fr_0.5fr] gap-4 rounded-[22px] border border-sand-100 bg-white p-4 animate-pulse">
              <div className="h-4 rounded-md bg-sand-100" />
              <div className="h-4 rounded-md bg-sand-100" />
              <div className="h-4 rounded-md bg-sand-100" />
              <div className="h-4 rounded-md bg-sand-100" />
              <div className="h-4 rounded-md bg-sand-100" />
              <div className="h-4 rounded-md bg-sand-100" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CampaignsPageContent() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [query, setQuery] = useState("");
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Math.max(1, Number(searchParams?.get("page") ?? 1) || 1);
  const limit = Math.max(1, Number(searchParams?.get("limit") ?? 10) || 10);
  const [total, setTotal] = useState<number | null>(null);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string; tone: "success" | "error" } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCampaigns({
          status: activeFilter === "all" ? undefined : activeFilter,
          search: query.trim() || undefined,
          page,
          limit
        });

        if (isMounted) {
          setCampaigns(data.items ?? []);
          setTotal(data.total ?? null);
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
  }, [activeFilter, query, page, limit]);

  const updatePagination = (nextPage: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", String(nextPage));
    params.set("limit", String(limit));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const totalPages = total !== null ? Math.max(1, Math.ceil(total / limit)) : null;
  const isLastPage = totalPages !== null ? page >= totalPages : campaigns.length < limit;

  const refreshCampaigns = async () => {
    const data = await getCampaigns({
      status: activeFilter === "all" ? undefined : activeFilter,
      search: query.trim() || undefined,
      page,
      limit
    });

    setCampaigns(data.items ?? []);
    setTotal(data.total ?? null);
  };

  const pauseResumeCampaign = async (campaign: CampaignRow) => {
    try {
      const nextStatus = campaign.status === "Live" ? "scheduled" : "live";
      await updateCampaign(campaign.id, { status: nextStatus });
      setToast({ title: "Campaign updated", message: `Campaign marked ${nextStatus}.`, tone: "success" });
      await refreshCampaigns();
    } catch (error) {
      setToast({ title: "Update failed", message: error instanceof ApiError ? error.message : "Unable to update campaign status.", tone: "error" });
    }
  };

  const duplicateCampaign = async (campaign: CampaignRow) => {
    try {
      await createCampaign({
        name: `${campaign.name} Copy`,
        subject: campaign.audience,
        previewText: null,
        content: { duplicatedFrom: campaign.id, audience: campaign.audience },
        status: "draft",
        scheduledAt: null
      });
      setToast({ title: "Campaign duplicated", message: "A draft copy was created successfully.", tone: "success" });
      await refreshCampaigns();
    } catch (error) {
      setToast({ title: "Duplicate failed", message: error instanceof ApiError ? error.message : "Unable to duplicate campaign.", tone: "error" });
    }
  };

  const archiveCampaign = async (campaign: CampaignRow) => {
    try {
      await deleteCampaign(campaign.id);
      setToast({ title: "Campaign archived", message: "The campaign was soft-deleted successfully.", tone: "success" });
      await refreshCampaigns();
    } catch (error) {
      setToast({ title: "Archive failed", message: error instanceof ApiError ? error.message : "Unable to archive campaign.", tone: "error" });
    }
  };

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
          {filters.map((item) => (
            <button key={item.value} type="button" onClick={() => setActiveFilter(item.value)} className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${activeFilter === item.value ? "bg-ink-900 text-white shadow-sm" : "bg-white text-ink-700 hover:bg-sand-50"}`}>
              {item.label}
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
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`campaign-skeleton-${index}`} aria-hidden="true">
                    <td className="px-4 py-3" colSpan={6}>
                      <div className="grid grid-cols-[1.6fr_1fr_0.9fr_0.9fr_0.8fr_0.5fr] gap-4 rounded-[22px] border border-sand-100 bg-white p-4 animate-pulse">
                        <div className="h-4 rounded-md bg-sand-100" />
                        <div className="h-4 rounded-md bg-sand-100" />
                        <div className="h-4 rounded-md bg-sand-100" />
                        <div className="h-4 rounded-md bg-sand-100" />
                        <div className="h-4 rounded-md bg-sand-100" />
                        <div className="h-4 rounded-md bg-sand-100" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : null}
              {!loading && error ? (
                <tr>
                  <td className="rounded-[22px] border border-dashed border-orange-100 bg-orange-50 px-4 py-8 text-sm text-orange-700" colSpan={6}>
                    {error}
                  </td>
                </tr>
              ) : null}
              {!loading && !error ? campaigns.map((campaign) => (
                <tr key={campaign.id} title={`${campaign.name} • ${campaign.audience} • ${campaign.status}`} className="rounded-[22px] bg-white shadow-sm ring-1 ring-sand-100 hover:bg-sand-50/50 transition-colors cursor-pointer hover:ring-sand-200">
                  <td className="rounded-l-[22px] px-4 py-4">
                    <p className="font-semibold text-ink-900">{campaign.name}</p>
                    <p className="text-sm text-ink-500">Optimized preview subject and header</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-ink-700">{campaign.audience}</td>
                  <td className="px-4 py-4 text-sm text-ink-700">{campaign.sent}</td>
                  <td className="px-4 py-4 text-sm text-ink-700">{campaign.opens}</td>
                  <td className="px-4 py-4"><Badge tone={campaign.tone === "green" ? "green" : campaign.tone === "amber" ? "amber" : "slate"}>{campaign.status}</Badge></td>
                  <td className="rounded-r-[22px] px-4 py-4 text-right relative">
                    <button type="button" onClick={(event) => { event.stopPropagation(); setMenuOpenFor(menuOpenFor === campaign.id ? null : campaign.id); }} className="inline-flex items-center gap-2 rounded-2xl border border-sand-100 bg-white px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-sand-50">
                      Actions <ChevronDown size={14} />
                    </button>
                    {menuOpenFor === campaign.id ? (
                      <div className="absolute right-0 top-11 z-20 w-56 rounded-2xl border border-sand-100 bg-white p-2 shadow-lift">
                        <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-sand-50" onClick={(event) => { event.stopPropagation(); void pauseResumeCampaign(campaign); setMenuOpenFor(null); }}>
                          {campaign.status === "Live" ? <PauseCircle size={14} /> : <PlayCircle size={14} />} Pause/Resume
                        </button>
                        <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-sand-50" onClick={(event) => { event.stopPropagation(); void duplicateCampaign(campaign); setMenuOpenFor(null); }}>
                          <Copy size={14} /> Duplicate Campaign Configurations
                        </button>
                        <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-sand-50" onClick={(event) => { event.stopPropagation(); void archiveCampaign(campaign); setMenuOpenFor(null); }}>
                          <Trash2 size={14} /> Archive/Soft-Delete
                        </button>
                        <Link href="/campaigns/new" className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-sand-50" onClick={(event) => event.stopPropagation()}>
                          <ArrowRight size={14} /> Edit configuration
                        </Link>
                      </div>
                    ) : null}
                  </td>
                </tr>
              )) : null}
              {!loading && !error && !campaigns.length ? (
                <tr>
                  <td className="px-4 py-4" colSpan={6}>
                    <div className="mx-auto max-w-md">
                      <Card>
                        <CardContent className="space-y-4 p-6 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sand-50 text-ink-500">
                            <MailX size={22} />
                          </div>
                          <h3 className="text-lg font-semibold text-ink-900">No campaigns found</h3>
                          <p className="text-sm text-ink-500">Create your first campaign to start tracking delivery and engagement.</p>
                          <div className="mt-4">
                            <Link href="/campaigns/new" className="inline-flex items-center justify-center rounded-2xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white">Create new campaign</Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          <div className="mt-4 space-y-3 md:hidden">
              {campaigns.map((campaign) => (
              <div key={`${campaign.id}-mobile`} className="rounded-[24px] border border-sand-100 bg-white p-4 shadow-sm">
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
                    <div className="flex flex-wrap justify-end gap-2">
                      <button type="button" className="inline-flex items-center gap-2 rounded-2xl border border-sand-100 bg-white px-3 py-2 text-sm font-semibold text-ink-700" onClick={() => void pauseResumeCampaign(campaign)}>
                        <PauseCircle size={14} /> Pause/Resume
                      </button>
                      <button type="button" className="inline-flex items-center gap-2 rounded-2xl border border-sand-100 bg-white px-3 py-2 text-sm font-semibold text-ink-700" onClick={() => void duplicateCampaign(campaign)}>
                        <Copy size={14} /> Duplicate
                      </button>
                      <button type="button" className="inline-flex items-center gap-2 rounded-2xl border border-sand-100 bg-white px-3 py-2 text-sm font-semibold text-ink-700" onClick={() => void archiveCampaign(campaign)}>
                        <Trash2 size={14} /> Archive
                      </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 rounded-[24px] border border-sand-100 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-ink-500">{total !== null ? `Page ${page} • ${total} total` : `Page ${page}`}</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const next = Math.max(1, page - 1);
                  updatePagination(next);
                }}
                disabled={page <= 1 || loading}
                className="rounded-2xl border border-sand-100 bg-white px-3 py-2 text-sm transition-colors hover:bg-sand-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = page + 1;
                  updatePagination(next);
                }}
                disabled={isLastPage || loading}
                className="rounded-2xl border border-sand-100 bg-white px-3 py-2 text-sm transition-colors hover:bg-sand-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
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

      {toast ? <Toast tone={toast.tone} title={toast.title} onClose={() => setToast(null)}>{toast.message}</Toast> : null}
    </div>
  );
}