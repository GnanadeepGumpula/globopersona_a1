"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "../../components/ui";
import { getContacts } from "../../lib/api";
import type { AudienceSegment, ContactRow } from "../../lib/types";

export default function ContactsPage() {
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [segments, setSegments] = useState<AudienceSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getContacts({ search: query.trim() || undefined });

        if (isMounted) {
          setContacts(data.contacts);
          setSegments(data.audienceSegments);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load contacts from the backend.");
          setContacts([]);
          setSegments([]);
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
  }, [query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-600">Audience management</p>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Contacts</h1>
        <p className="max-w-3xl text-sm leading-6 text-ink-500">A clean contact surface that gives the operations team visible segmentation and clear list scanning.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Audience segments</CardTitle>
              <CardDescription>Segment cards with concise notes and totals.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? <p className="rounded-2xl border border-dashed border-sand-100 bg-white px-4 py-8 text-sm text-ink-500">Loading audience segments...</p> : null}
            {!loading && error ? <p className="rounded-2xl border border-dashed border-orange-100 bg-orange-50 px-4 py-8 text-sm text-orange-700">{error}</p> : null}
            {!loading && !error ? segments.map((segment) => (
              <div key={segment.name} className="rounded-[24px] border border-sand-100 bg-sand-50/70 p-4">
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-sand-100 bg-white px-4 py-3">
              <Search className="text-ink-500" size={16} />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} className="border-0 bg-transparent px-0 focus:ring-0" placeholder="Search contacts" />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.2em] text-ink-500">
                    <th scope="col" className="px-4 pb-2">Name</th>
                    <th scope="col" className="px-4 pb-2">Email</th>
                    <th scope="col" className="px-4 pb-2">Segment</th>
                    <th scope="col" className="px-4 pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="rounded-[22px] border border-dashed border-sand-100 bg-white px-4 py-8 text-sm text-ink-500" colSpan={4}>
                        Loading contacts from the backend...
                      </td>
                    </tr>
                  ) : null}
                  {!loading && error ? (
                    <tr>
                      <td className="rounded-[22px] border border-dashed border-orange-100 bg-orange-50 px-4 py-8 text-sm text-orange-700" colSpan={4}>
                        {error}
                      </td>
                    </tr>
                  ) : null}
                  {!loading && !error ? contacts.map((contact) => (
                    <tr key={contact.email} className="rounded-[22px] bg-white shadow-sm ring-1 ring-sand-100">
                      <td className="rounded-l-[22px] px-4 py-4 font-semibold text-ink-900">{contact.name}</td>
                      <td className="px-4 py-4 text-sm text-ink-700">{contact.email}</td>
                      <td className="px-4 py-4 text-sm text-ink-700">{contact.segment}</td>
                      <td className="rounded-r-[22px] px-4 py-4"><Badge tone={contact.status === "Engaged" ? "green" : "default"}>{contact.status}</Badge></td>
                    </tr>
                  )) : null}
                  {!loading && !error && !contacts.length ? (
                    <tr>
                      <td className="rounded-[22px] border border-dashed border-sand-100 bg-white px-4 py-8 text-sm text-ink-500" colSpan={4}>
                        No contacts match the current search.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {contacts.map((contact) => (
                <div key={`${contact.email}-mobile`} className="rounded-[24px] border border-sand-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink-900">{contact.name}</p>
                      <p className="mt-1 text-sm text-ink-500">{contact.email}</p>
                    </div>
                    <Badge tone={contact.status === "Engaged" ? "green" : "default"}>{contact.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-ink-700">{contact.segment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}