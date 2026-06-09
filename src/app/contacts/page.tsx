"use client";

import { Check, ChevronDown, FileUp, History, Mail, MoreHorizontal, Plus, Search, User, UserPlus, X, Building, Phone, Tag, Info } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea, Toast } from "../../components/ui";
import { ApiError, createContact, deleteContact, getActivities, getContacts, updateContact } from "../../lib/api";
import type { ActivityItem, AudienceSegment, ContactRow } from "../../lib/types";

type ContactFormState = {
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    phone: string;
    classification: "Customer" | "Lead" | "Partner" | "Internal";
    status: "engaged" | "nurture" | "active";
};

type CsvMapping = {
    email: string;
    firstName: string;
    lastName: string;
    status: string;
};

type ToastState = {
    title: string;
    message: string;
    tone: "success" | "error";
};

const initialContactForm: ContactFormState = {
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    classification: "Lead",
    status: "nurture"
};

const fallbackHeaderMap: CsvMapping = {
    email: "email",
    firstName: "first_name",
    lastName: "last_name",
    status: "status"
};

function getEngagementBadge(status: string) {
    const normalized = status.trim().toLowerCase();

    if (normalized === "engaged" || normalized === "active") {
        return { label: "Engaged", tone: "green" as const };
    }

    if (normalized === "unsubscribed") {
        return { label: "Unsubscribed", tone: "amber" as const };
    }

    return { label: "Inactive", tone: "slate" as const };
}

export default function ContactsPage() {
    return (
        <Suspense fallback={<ContactsSkeleton />}>
            <ContactsPageContent />
        </Suspense>
    );
}

function ContactsSkeleton() {
    return (
        <div className="space-y-8">
            <Card>
                <CardContent className="space-y-4 py-6">
                    <div className="h-4 w-40 animate-pulse rounded-md bg-sand-100" />
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="h-12 animate-pulse rounded-2xl bg-sand-100" />
                        <div className="h-12 animate-pulse rounded-2xl bg-sand-100" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="space-y-3 py-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-[1.2fr_1.2fr_0.9fr_0.8fr] gap-4 rounded-[22px] border border-sand-100 bg-white p-4 animate-pulse">
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

function parseCsv(text: string) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (!lines.length) {
        return { headers: [] as string[], rows: [] as Record<string, string>[] };
    }

    const headers = lines[0].split(",").map((value) => value.trim());
    const rows = lines.slice(1).map((line) => {
        const values = line.split(",").map((value) => value.trim());
        return headers.reduce<Record<string, string>>((accumulator, header, index) => {
            accumulator[header] = values[index] ?? "";
            return accumulator;
        }, {});
    });

    return { headers, rows };
}

function ContactsPageContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const page = Math.max(1, Number(searchParams?.get("page") ?? 1) || 1);
    const limit = Math.max(1, Number(searchParams?.get("limit") ?? 10) || 10);

    const [query, setQuery] = useState("");
    const [contacts, setContacts] = useState<ContactRow[]>([]);
    const [segments, setSegments] = useState<AudienceSegment[]>([]);
    const [total, setTotal] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedContact, setSelectedContact] = useState<ContactRow | null>(null);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isActivityLoading, setIsActivityLoading] = useState(false);
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [contactForm, setContactForm] = useState<ContactFormState>(initialContactForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [csvText, setCsvText] = useState("");
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [csvMapping, setCsvMapping] = useState<CsvMapping>(fallbackHeaderMap);
    const [csvPreviewRows, setCsvPreviewRows] = useState<Record<string, string>[]>([]);
    const [isMenuOpenFor, setIsMenuOpenFor] = useState<string | null>(null);
    const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadContacts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getContacts({ search: query.trim() || undefined, page, limit });

                if (isMounted) {
                    setContacts(data.contacts ?? []);
                    setSegments(data.audienceSegments ?? []);
                    setTotal(data.total ?? null);
                }
            } catch {
                if (isMounted) {
                    setError("Unable to load contacts from the backend.");
                    setContacts([]);
                    setSegments([]);
                    setTotal(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void loadContacts();

        return () => {
            isMounted = false;
        };
    }, [query, page, limit]);

    useEffect(() => {
        let isMounted = true;

        const loadActivityHistory = async () => {
            if (!selectedContact) {
                setActivities([]);
                return;
            }

            try {
                setIsActivityLoading(true);
                const data = await getActivities({ limit: 24, entityId: selectedContact.id, entityType: "contact" });
                if (isMounted) {
                    setActivities(data.items);
                }
            } finally {
                if (isMounted) {
                    setIsActivityLoading(false);
                }
            }
        };

        void loadActivityHistory();

        return () => {
            isMounted = false;
        };
    }, [selectedContact]);

    useEffect(() => {
        if (!csvText.trim()) {
            setCsvHeaders([]);
            setCsvPreviewRows([]);
            return;
        }

        const parsed = parseCsv(csvText);
        setCsvHeaders(parsed.headers);
        setCsvPreviewRows(parsed.rows.slice(0, 3));
    }, [csvText]);

    const updatePagination = (nextPage: number) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("page", String(nextPage));
        params.set("limit", String(limit));
        router.replace(`${pathname}?${params.toString()}`);
    };

    const totalPages = total !== null ? Math.max(1, Math.ceil(total / limit)) : null;
    const isLastPage = totalPages !== null ? page >= totalPages : contacts.length < limit;
    const selectedContactDisplay = useMemo(() => contacts.find((contact) => contact.id === selectedContact?.id) ?? selectedContact, [contacts, selectedContact]);

    const closeDrawer = () => {
        setSelectedContact(null);
        setIsMenuOpenFor(null);
    };

    const saveContact = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (isEditDrawerOpen && selectedContact) {
                await updateContact(selectedContact.id, {
                    email: contactForm.email,
                    firstName: contactForm.firstName || null,
                    lastName: contactForm.lastName || null,
                    status: contactForm.status,
                    metadata: { 
                        company: contactForm.company,
                        phone: contactForm.phone,
                        classification: contactForm.classification,
                        unsubscribed: selectedContact.status === "Unsubscribed" 
                    }
                });
                setToast({ title: "Contact updated", message: "The contact record was saved successfully.", tone: "success" });
            } else {
                await createContact({
                    email: contactForm.email,
                    firstName: contactForm.firstName || null,
                    lastName: contactForm.lastName || null,
                    status: contactForm.status,
                    metadata: {
                        company: contactForm.company || "N/A",
                        phone: contactForm.phone || "N/A",
                        classification: contactForm.classification
                    }
                });
                setToast({ title: "Contact created", message: "A new contact was added to the workspace.", tone: "success" });
            }
            setIsAddDrawerOpen(false);
            setIsEditDrawerOpen(false);
            setContactForm(initialContactForm);
            const refreshed = await getContacts({ search: query.trim() || undefined, page, limit });
            setContacts(refreshed.contacts ?? []);
            setSegments(refreshed.audienceSegments ?? []);
            setTotal(refreshed.total ?? null);
        } catch (error) {
            if (error instanceof ApiError) {
                setToast({ title: error.status === 422 ? "Validation failed" : "Request failed", message: error.message, tone: "error" });
            } else {
                setToast({ title: "Request failed", message: "Unable to save contact right now.", tone: "error" });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const importCsvBatch = async () => {
        if (isSubmitting || !csvPreviewRows.length) return;
        setIsSubmitting(true);
        try {
            for (const row of csvPreviewRows) {
                await createContact({
                    email: row[csvMapping.email] ?? "",
                    firstName: row[csvMapping.firstName] || null,
                    lastName: row[csvMapping.lastName] || null,
                    status: (row[csvMapping.status] as ContactFormState["status"]) ?? "nurture",
                    metadata: { csvImport: true }
                });
            }
            setToast({ title: "CSV imported", message: "The batch upload preview has been processed successfully.", tone: "success" });
            setCsvText("");
            const refreshed = await getContacts({ search: query.trim() || undefined, page, limit });
            setContacts(refreshed.contacts ?? []);
            setSegments(refreshed.audienceSegments ?? []);
            setTotal(refreshed.total ?? null);
        } catch {
            setToast({ title: "Import failed", message: "The batch upload preview could not be processed.", tone: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSubscription = async (contact: ContactRow) => {
        try {
            const nextUnsubscribed = contact.status === "Unsubscribed";
            await updateContact(contact.id, { metadata: { unsubscribed: !nextUnsubscribed } });
            setToast({ title: "Subscription updated", message: nextUnsubscribed ? "The contact was resubscribed." : "The contact was marked unsubscribed.", tone: "success" });
            const refreshed = await getContacts({ search: query.trim() || undefined, page, limit });
            setContacts(refreshed.contacts ?? []);
            setSegments(refreshed.audienceSegments ?? []);
            setTotal(refreshed.total ?? null);
        } catch {
            setToast({ title: "Update failed", message: "Unable to toggle subscription state.", tone: "error" });
        }
    };

    const openCreateDrawer = () => {
        setContactForm(initialContactForm);
        setIsEditDrawerOpen(false);
        setIsAddDrawerOpen(true);
    };

    const openCsvModal = () => setIsCsvModalOpen(true);
    const closeCsvModal = () => setIsCsvModalOpen(false);

    const openEditDrawer = (contact: ContactRow) => {
        setContactForm({
            email: contact.email,
            firstName: contact.name,
            lastName: "",
            company: (contact as any).metadata?.company || "",
            phone: (contact as any).metadata?.phone || "",
            classification: (contact as any).metadata?.classification || "Lead",
            status: "nurture"
        });
        setSelectedContact(contact);
        setIsEditDrawerOpen(true);
        setIsAddDrawerOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle>Audience segments</CardTitle>
                            <CardDescription>Segment cards with concise notes and totals.</CardDescription>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={openCreateDrawer} className="flex items-center gap-1.5 text-xs font-bold text-[#0B51C1]">
                            <Plus size={16} /> Add contact
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="animate-pulse rounded-[24px] border border-sand-100 bg-white p-4">
                                        <div className="h-4 w-2/5 rounded-md bg-sand-100" />
                                        <div className="mt-3 h-3 w-4/5 rounded-md bg-sand-100" />
                                    </div>
                                ))}
                            </div>
                        ) : null}
                        {!loading && error ? <p className="rounded-2xl border border-dashed border-orange-100 bg-orange-50 px-4 py-8 text-sm text-orange-700">{error}</p> : null}
                        {!loading && !error ? segments.map((segment) => (
                            <div key={segment.name} className="rounded-[20px] border border-[#E7EEF8] bg-[#F4F7FC] p-4 transition-colors hover:bg-white">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-ink-900">{segment.name}</p>
                                        <p className="mt-1 text-sm leading-6 text-ink-500">{segment.note}</p>
                                    </div>
                                    <Badge tone="accent">{segment.count}</Badge>
                                </div>
                            </div>
                        )) : null}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle>Contacts table</CardTitle>
                            <CardDescription>Readable rows with search emphasis and status clarity.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={openCreateDrawer} className="flex items-center gap-1.5"><UserPlus size={16} /> New contact</Button>
                            <Button type="button" variant="secondary" size="sm" onClick={openCsvModal} className="flex items-center gap-1.5"><FileUp size={16} /> Import CSV</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 rounded-2xl border border-[#D5DFED] bg-white px-4 py-3">
                            <Search className="text-ink-500" size={16} />
                            <Input value={query} onChange={(event) => setQuery(event.target.value)} className="border-0 bg-transparent px-0 focus:ring-0" placeholder="Search contacts" />
                        </div>

                        <div className="space-y-3">
                            {loading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <div key={index} className="h-20 animate-pulse rounded-[24px] bg-sand-100" />
                                    ))}
                                </div>
                            ) : null}
                            <div className="overflow-x-auto">
                                {/* FIXED TABULAR ENTITY STRUCTURE HERE */}
                                <table className="min-w-full border-separate border-spacing-y-3">
                                    <thead>
                                        <tr className="text-left text-xs uppercase tracking-[0.2em] text-ink-500">
                                            <th scope="col" className="px-4 pb-2">Name</th>
                                            <th scope="col" className="px-4 pb-2">Email</th>
                                            <th scope="col" className="px-4 pb-2">Segment</th>
                                            <th scope="col" className="px-4 pb-2">Status</th>
                                            <th scope="col" className="px-4 pb-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loading && error ? (
                                            <tr>
                                                <td className="rounded-[22px] border border-dashed border-orange-100 bg-orange-50 px-4 py-8 text-sm text-orange-700" colSpan={5}>{error}</td>
                                            </tr>
                                        ) : null}
                                        {!loading && !error ? contacts.map((contact) => {
                                            const isMenuOpen = isMenuOpenFor === contact.id;
                                            const engagementBadge = getEngagementBadge(contact.status);
                                            return (
                                                <tr key={contact.id} title={`${contact.name} • ${contact.email} • ${contact.segment}`} onClick={() => setSelectedContact(contact)} className="rounded-[20px] bg-white shadow-sm ring-1 ring-[#E7EEF8] hover:bg-[#F4F7FC]/70 transition-colors cursor-pointer hover:ring-[#DDE8FF]">
                                                    <td className="rounded-l-[22px] px-4 py-4 font-semibold text-ink-900">{contact.name}</td>
                                                    <td className="px-4 py-4 text-sm text-ink-700">{contact.email}</td>
                                                    <td className="px-4 py-4 text-sm text-ink-700">{contact.segment}</td>
                                                    <td className="px-4 py-4"><Badge tone={engagementBadge.tone}>{engagementBadge.label}</Badge></td>
                                                    <td className="rounded-r-[22px] px-4 py-4 text-right relative">
                                                        <button type="button" onClick={(event) => { event.stopPropagation(); setIsMenuOpenFor(isMenuOpen ? null : contact.id); }} className="inline-flex items-center gap-2 rounded-2xl border border-[#D5DFED] bg-white px-3 py-2 text-sm text-ink-700 hover:bg-[#F4F7FC]">
                                                            <MoreHorizontal size={16} /> Actions <ChevronDown size={14} />
                                                        </button>
                                                        {isMenuOpen ? (
                                                            <div className="absolute right-0 top-11 z-20 w-56 rounded-[20px] border border-[#DDE8FF] bg-white p-2 shadow-lift">
                                                                <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-[#F4F7FC]" onClick={(event) => { event.stopPropagation(); void toggleSubscription(contact); setIsMenuOpenFor(null); }}>
                                                                    <Check size={14} /> Toggle Unsubscribed Status
                                                                </button>
                                                                <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-[#F4F7FC]" onClick={(event) => { event.stopPropagation(); openEditDrawer(contact); setIsMenuOpenFor(null); }}>
                                                                    <User size={14} /> Edit Details
                                                                </button>
                                                                <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-[#F4F7FC]" onClick={(event) => { event.stopPropagation(); setSelectedContact(contact); setIsMenuOpenFor(null); }}>
                                                                    <History size={14} /> View Activity History Panel
                                                                </button>
                                                                <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-[#F4F7FC]" onClick={(event) => { event.stopPropagation(); void deleteContact(contact.id); setIsMenuOpenFor(null); }}>
                                                                    <X size={14} /> Remove Contact
                                                                </button>
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                </tr>
                                            );
                                        }) : null}
                                        {!loading && !error && !contacts.length ? (
                                            <tr>
                                                <td className="px-4 py-4" colSpan={5}>
                                                    <div className="mx-auto max-w-md">
                                                        <Card>
                                                            <CardContent className="space-y-4 p-6 text-center">
                                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sand-50 text-ink-500"><UserPlus size={22} /></div>
                                                                <h3 className="text-lg font-semibold text-ink-900">No active segments found</h3>
                                                                <p className="text-sm text-ink-500">Import your first contacts to start building live audience segments and engagement views.</p>
                                                                <div className="mt-4"><Button type="button" onClick={openCreateDrawer}>Import First Contact</Button></div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : null}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-3 md:hidden">
                                {contacts.map((contact) => (
                                    <div key={`${contact.id}-mobile`} className="rounded-[20px] border border-[#E7EEF8] bg-white p-4 shadow-sm" onClick={() => setSelectedContact(contact)}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-ink-900">{contact.name}</p>
                                                <p className="mt-1 text-sm text-ink-500">{contact.email}</p>
                                            </div>
                                            <Badge tone={getEngagementBadge(contact.status).tone}>{getEngagementBadge(contact.status).label}</Badge>
                                        </div>
                                        <p className="mt-3 text-sm text-ink-700">{contact.segment}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex flex-col gap-3 rounded-[20px] border border-[#DDE8FF] bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm text-ink-500">{total !== null ? `Page ${page} • ${total} total` : `Page ${page}`}</div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => updatePagination(Math.max(1, page - 1))} disabled={page <= 1 || loading} className="rounded-2xl border border-[#D5DFED] bg-white px-3 py-2 text-sm transition-colors hover:bg-[#F4F7FC] disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
                                    <button type="button" onClick={() => updatePagination(page + 1)} disabled={isLastPage || loading} className="rounded-2xl border border-[#D5DFED] bg-white px-3 py-2 text-sm transition-colors hover:bg-[#F4F7FC] disabled:cursor-not-allowed disabled:opacity-50">Next</button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle>Activity history</CardTitle>
                            <CardDescription>Chronological log sourced from the backend activity stream.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {selectedContactDisplay ? (
                            <div className="rounded-[24px] border border-sand-100 bg-sand-50/60 p-4">
                                <p className="font-semibold text-ink-900">{selectedContactDisplay.name}</p>
                                <p className="text-sm text-ink-500">{selectedContactDisplay.email}</p>
                            </div>
                        ) : null}
                        {isActivityLoading ? <div className="h-24 animate-pulse rounded-[24px] bg-sand-100" /> : null}
                        {!isActivityLoading ? activities.map((activity) => (
                            <div key={`${activity.title}-${activity.time}`} className="rounded-[24px] border border-sand-100 bg-white p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="font-semibold text-ink-900">{activity.title}</p>
                                    <span className="text-xs text-ink-500">{activity.time}</span>
                                </div>
                                <p className="mt-2 text-sm text-ink-500">{activity.detail}</p>
                            </div>
                        )) : null}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle>Profile drawer</CardTitle>
                            <CardDescription>Click a row to inspect the contact timeline and details.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-6 text-ink-500">The drawer state is exposed from the table rows and uses backend activities as the source of truth for subscription and engagement history.</p>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-2xl bg-sand-50 p-3"><p className="text-ink-500">Segments</p><p className="font-semibold text-ink-900">{segments.length}</p></div>
                            <div className="rounded-2xl bg-sand-50 p-3"><p className="text-ink-500">Rows</p><p className="font-semibold text-ink-900">{contacts.length}</p></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* CSV IMPORT PIPELINE MODAL */}
            {isCsvModalOpen ? (
                <div role="dialog" aria-modal="true" aria-label="CSV ingestion pipeline" className="fixed inset-0 z-50 bg-ink-900/50 p-3 backdrop-blur-sm sm:p-4" onClick={closeCsvModal}>
                    <div className="mx-auto mt-4 w-full max-w-6xl rounded-[32px] border border-sand-100 bg-white shadow-lift sm:mt-8" onClick={(event) => event.stopPropagation()}>
                        <div className="flex items-start justify-between gap-4 border-b border-sand-100 px-4 py-4 sm:px-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-600">Audience import</p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink-900">CSV ingestion pipeline</h2>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">Drop CSV, map columns, preview the batch, and import contacts.</p>
                            </div>
                            <button type="button" aria-label="Close CSV import" onClick={closeCsvModal} className="grid h-10 w-10 place-items-center rounded-2xl bg-sand-50 text-ink-700 transition hover:bg-sand-100">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="grid gap-6 p-4 sm:p-6 xl:grid-cols-[1.05fr_0.95fr]">
                            <div className="rounded-[28px] border border-sand-100 bg-gradient-to-br from-sand-50 to-white p-4 sm:p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-ink-900">Paste or upload</p>
                                        <p className="text-sm text-ink-500">Use the demo sample or paste your own list.</p>
                                    </div>
                                    <Badge tone="accent">Responsive</Badge>
                                </div>
                                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                    <textarea value={csvText} onChange={(event) => setCsvText(event.target.value)} placeholder="email,first_name,last_name,status\nalex@example.com,Alex,Stone,active" className="min-h-48 w-full rounded-[24px] border border-sand-200 bg-white p-4 text-sm outline-none shadow-sm resize-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100 sm:resize-y" />
                                    <div className="flex w-full flex-col gap-3 sm:max-w-[220px]">
                                        <label className="flex w-full cursor-pointer items-center gap-2 rounded-[24px] border border-dashed border-sand-200 bg-white px-4 py-3 text-sm text-ink-700 transition hover:border-accent-200 hover:bg-accent-50/30">
                                            <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                const reader = new FileReader();
                                                reader.onload = () => setCsvText(String(reader.result ?? ""));
                                                reader.readAsText(file);
                                            }} />
                                            <FileUp size={16} className="text-accent-600" />
                                            <span className="font-medium">Upload CSV file</span>
                                        </label>
                                        <Button type="button" variant="outline" size="sm" onClick={() => { setCsvText("email,first_name,last_name,status\nlee@example.com,Lee,Chan,active\nanya@example.com,Anya,Stone,nurture"); }}>
                                            Load demo
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => { setCsvText(""); setCsvHeaders([]); setCsvPreviewRows([]); }} className="text-[#718096]">
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                                {csvHeaders.length ? (
                                    <div className="mt-5 rounded-[24px] border border-sand-100 bg-white p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Column mapping</p>
                                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                            {["email", "firstName", "lastName", "status"].map((field) => (
                                                <label key={field} className="space-y-1 text-sm">
                                                    <span className="block font-semibold text-ink-700">{field}</span>
                                                    <select value={csvMapping[field as keyof CsvMapping]} onChange={(event) => setCsvMapping((current) => ({ ...current, [field]: event.target.value }))} className="h-11 w-full rounded-2xl border border-sand-200 bg-white px-4 text-sm outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100">
                                                        {csvHeaders.map((header) => <option key={header} value={header}>{header}</option>)}
                                                    </select>
                                                </label>
                                            ))}
                                        </div>
                                        <Button type="button" className="mt-4" onClick={() => void importCsvBatch()} disabled={!csvPreviewRows.length || isSubmitting}>Batch upload preview</Button>
                                    </div>
                                ) : null}
                            </div>

                            <div className="rounded-[28px] border border-sand-100 bg-white p-4 sm:p-5">
                                <p className="text-sm font-semibold text-ink-900">Preview rows</p>
                                <p className="mt-1 text-sm text-ink-500">The first three parsed rows are shown before import.</p>
                                <div className="mt-4 space-y-3">
                                    {csvPreviewRows.length ? csvPreviewRows.map((row, index) => (
                                        <div key={index} className="rounded-[22px] border border-sand-100 bg-sand-50/60 p-4 text-sm text-ink-700 shadow-sm">
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                {Object.entries(row).map(([key, value]) => (
                                                    <div key={key} className="rounded-2xl bg-white px-3 py-2">
                                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">{key}</p>
                                                        <p className="mt-1 break-words text-sm text-ink-700">{value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )) : <div className="rounded-[22px] border border-dashed border-sand-200 bg-sand-50/50 p-4 text-sm text-ink-500">Paste a CSV or upload a file to see a preview here.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* ========================================================
                CENTERED OVERLAY MODAL FOR CONTACT CREATION & EDITS
                ======================================================== */}
            {isAddDrawerOpen || isEditDrawerOpen ? (
                <div className="fixed inset-0 z-50 bg-[#002D72]/20 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border border-[#E2E8F0] w-full max-w-xl rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-scale-up">
                        
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-[#002D72] to-[#0B51C1] p-5 text-white flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-white/10 grid place-items-center border border-white/10">
                                    <UserPlus size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                                        {isEditDrawerOpen ? "Edit Profile Details" : "New Contact Record"}
                                    </h3>
                                    <p className="text-white/70 text-[10px]">Ingest metrics directly into your live audience index ledger.</p>
                                </div>
                            </div>
                            <button type="button" onClick={() => { setIsAddDrawerOpen(false); setIsEditDrawerOpen(false); }} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Interactive Form Context */}
                        <div className="p-6 space-y-4 bg-[#F8FAFC] overflow-y-auto max-h-[70vh]">
                            
                            {/* Input Field: Core Electronic Mail Endpoint */}
                            <div>
                                <Label>Email Address *</Label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-3 top-3.5 text-[#A0AEC0]" />
                                    <Input value={contactForm.email} onChange={(event) => setContactForm((current) => ({ ...current, email: event.target.value }))} className="pl-9 font-mono" placeholder="username@corporate-domain.com" />
                                </div>
                            </div>

                            {/* Input Fields Row: Split Identity Strings */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label>First Name</Label>
                                    <Input value={contactForm.firstName} onChange={(event) => setContactForm((current) => ({ ...current, firstName: event.target.value }))} placeholder="e.g. John" />
                                </div>
                                <div>
                                    <Label>Last Name</Label>
                                    <Input value={contactForm.lastName} onChange={(event) => setContactForm((current) => ({ ...current, lastName: event.target.value }))} placeholder="e.g. Doe" />
                                </div>
                            </div>

                            {/* Company & Phone Field Layout Extensions */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="flex items-center gap-1"><Building size={12} /> Corporate Firm / Organization</Label>
                                    <Input value={contactForm.company} onChange={(event) => setContactForm((current) => ({ ...current, company: event.target.value }))} placeholder="Company Enterprise Name" />
                                </div>
                                <div>
                                    <Label className="flex items-center gap-1"><Phone size={12} /> Contact Phone Stream</Label>
                                    <Input type="tel" value={contactForm.phone} onChange={(event) => setContactForm((current) => ({ ...current, phone: event.target.value }))} placeholder="+1 (555) 000-0000" className="font-mono" />
                                </div>
                            </div>

                            {/* Network Classifications & Status Lifecycle Groups */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="flex items-center gap-1"><Tag size={12} /> Classification Tag</Label>
                                    <select value={contactForm.classification} onChange={(event) => setContactForm((current) => ({ ...current, classification: event.target.value as ContactFormState["classification"] }))} className="h-11 w-full rounded-2xl border border-sand-200 bg-white px-4 text-sm outline-none font-semibold cursor-pointer shadow-sm text-[#4A5568]">
                                        <option value="Lead">Marketing Lead / Prospect</option>
                                        <option value="Customer">Verified Active Customer</option>
                                        <option value="Partner">External Network Affiliate / Partner</option>
                                        <option value="Internal">Internal Corporate Team Token</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Lifecycle Status Group</Label>
                                    <select value={contactForm.status} onChange={(event) => setContactForm((current) => ({ ...current, status: event.target.value as ContactFormState["status"] }))} className="h-11 w-full rounded-2xl border border-sand-200 bg-white px-4 text-sm outline-none font-semibold cursor-pointer shadow-sm text-[#4A5568]">
                                        <option value="nurture">Nurture Automation Sequence</option>
                                        <option value="engaged">Engaged Interaction Node</option>
                                        <option value="active">Active Broadcast Subscriber</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-3 bg-[#EEF4FF] rounded-xl border border-[#DDE8FF] flex items-start gap-2 text-[11px] text-[#004AAD] font-medium leading-relaxed">
                                <Info size={14} className="mt-0.5 shrink-0 text-[#0B51C1]" />
                                <span>Submitting this parameter token instantly executes database cache transformations over active pipeline segments.</span>
                            </div>
                        </div>

                        {/* Modal Action Controls Footer */}
                        <div className="p-4 bg-white border-t border-[#E2E8F0] flex justify-end gap-2 flex-shrink-0">
                            <button 
                                type="button" 
                                onClick={() => { setIsAddDrawerOpen(false); setIsEditDrawerOpen(false); }}
                                className="px-4 h-10 border border-[#E2E8F0] text-xs font-bold text-[#4A5568] rounded-xl hover:bg-[#F7FAFC] transition"
                            >
                                Cancel
                            </button>
                            <Button type="button" size="sm" className="font-bold text-white shadow-sm px-5" disabled={isSubmitting} onClick={() => void saveContact()}>
                                {isSubmitting ? "Saving Parameters..." : isEditDrawerOpen ? "Update details" : "Create Contact"}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            {toast ? <Toast message={toast.message} type="success" onClose={() => setToast(null)} /> : null}
        </div>
    );
}