"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Report = {
  id: string;
  created_at: string;
  reason?: string | null;
  post_id?: string | null;
  user_id?: string | null;
  reported_user_id?: string | null;
  status?: string | null;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  async function loadReports() {
    setLoading(true);

    let query = supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (statusFilter !== "All") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      alert("Could not load reports.");
    } else {
      setReports(data || []);
    }

    setLoading(false);
  }

  async function updateReportStatus(id: string, status: string) {
    const { error } = await supabase
      .from("reports")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not update report.");
      return;
    }

    await loadReports();
  }

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  return (
    <>
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
          Reports
        </p>
        <h2 className="mt-3 text-4xl font-black md:text-5xl">
          Moderation Centre
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Review reported posts and keep Frame safe for the creative community.
        </p>
      </div>

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-wrap gap-3">
          {["All", "Pending", "Reviewed", "Dismissed"].map((status) => (
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
          <EmptyState text="Loading reports..." />
        ) : reports.length === 0 ? (
          <EmptyState text="No reports found." />
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <h3 className="text-2xl font-bold">
                    Report #{report.id.slice(0, 8)}
                  </h3>
                  <p className="mt-2 text-zinc-400">
                    {report.reason || "No reason provided"}
                  </p>
                </div>

                <span className="h-fit rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
                  {report.status || "Pending"}
                </span>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
                <p>
                  <strong>Post ID:</strong> {report.post_id || "Unknown"}
                </p>
                <p>
                  <strong>Reporter:</strong> {report.user_id || "Unknown"}
                </p>
                <p>
                  <strong>Reported User:</strong>{" "}
                  {report.reported_user_id || "Unknown"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {report.created_at
                    ? new Date(report.created_at).toLocaleString()
                    : "Unknown"}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => updateReportStatus(report.id, "Reviewed")}
                  className="rounded-full bg-green-500 px-5 py-3 font-bold text-black hover:bg-green-400"
                >
                  Mark Reviewed
                </button>

                <button
                  onClick={() => updateReportStatus(report.id, "Dismissed")}
                  className="rounded-full border border-white/10 px-5 py-3 font-bold text-white hover:bg-white/10"
                >
                  Dismiss
                </button>

                <button
                  onClick={() => updateReportStatus(report.id, "Pending")}
                  className="rounded-full border border-yellow-400/40 px-5 py-3 font-bold text-yellow-400 hover:bg-yellow-400/10"
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