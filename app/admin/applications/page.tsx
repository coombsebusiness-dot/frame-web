"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Application = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string | null;
  creator_type: string | null;
  instagram: string | null;
  website: string | null;
  bio: string | null;
  reason: string | null;
  status: string;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [search, setSearch] = useState("");

  async function loadApplications() {
    setLoading(true);

    let query = supabase
      .from("golden_creator_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (statusFilter !== "All") {
      query = query.eq("status", statusFilter);
    }

    if (search.trim()) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,creator_type.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      alert("Could not load applications.");
    } else {
      setApplications(data || []);
    }

    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("golden_creator_applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not update application.");
      return;
    }

    await loadApplications();
  }

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  return (
    <>
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
          Golden Creator Applications
        </p>
        <h2 className="mt-3 text-4xl font-black md:text-5xl">
          Review Applications
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Approve, reject and manage creators applying to join the Golden
          Creator Collective.
        </p>
      </div>

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or creator type..."
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500"
          />

          <button
            onClick={loadApplications}
            className="rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300"
          >
            Search
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {["Pending", "Approved", "Rejected", "All"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-5 py-3 text-sm font-bold ${
                statusFilter === status
                  ? "bg-yellow-400 text-black"
                  : "border border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5">
        {loading ? (
          <EmptyState text="Loading applications..." />
        ) : applications.length === 0 ? (
          <EmptyState text="No applications found." />
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <h3 className="text-2xl font-bold">
                    {app.first_name} {app.last_name}
                  </h3>
                  <p className="mt-1 text-zinc-400">{app.email}</p>
                  <p className="mt-2 text-sm text-yellow-400">
                    {app.creator_type || "Creator"} ·{" "}
                    {app.country || "Country not added"}
                  </p>
                </div>

                <span className="h-fit rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
                  {app.status}
                </span>
              </div>

              <div className="mt-5 grid gap-4 text-sm text-zinc-300 md:grid-cols-2">
                <p>
                  <strong>Instagram:</strong> {app.instagram || "Not added"}
                </p>
                <p>
                  <strong>Website:</strong> {app.website || "Not added"}
                </p>
              </div>

              {app.bio && (
                <p className="mt-5 text-zinc-300">
                  <strong>Bio:</strong> {app.bio}
                </p>
              )}

              {app.reason && (
                <p className="mt-4 text-zinc-300">
                  <strong>Reason:</strong> {app.reason}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => updateStatus(app.id, "Approved")}
                  className="rounded-full bg-green-500 px-5 py-3 font-bold text-black hover:bg-green-400"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(app.id, "Rejected")}
                  className="rounded-full bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-400"
                >
                  Reject
                </button>

                <button
                  onClick={() => updateStatus(app.id, "Pending")}
                  className="rounded-full border border-white/10 px-5 py-3 font-bold text-white hover:bg-white/10"
                >
                  Mark Pending
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-zinc-500">
      {text}
    </div>
  );
}