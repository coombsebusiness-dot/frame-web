"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type UserProfile = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  created_at?: string | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);

    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (search.trim()) {
      query = query.or(
        `username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      alert("Could not load users.");
    } else {
      setUsers(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
          Users
        </p>
        <h2 className="mt-3 text-4xl font-black md:text-5xl">
          Manage Frame Users
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Search and review the latest user profiles on Frame.
        </p>
      </div>

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search username, name or email..."
            className="flex-1 rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500"
          />

          <button
            onClick={loadUsers}
            className="rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300"
          >
            Search
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-4">
        {loading ? (
          <EmptyState text="Loading users..." />
        ) : users.length === 0 ? (
          <EmptyState text="No users found." />
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:flex-row md:items-center"
            >
              <div>
                <h3 className="text-2xl font-bold">
                  {user.username || user.full_name || "Unnamed user"}
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  {user.email || user.id}
                </p>

                <p className="mt-2 text-xs text-zinc-500">
                  Joined:{" "}
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
               <Link
  href={`/admin/users/${user.id}`}
  className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
>
  View Profile
</Link>

                <button className="rounded-full border border-red-500/40 px-5 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10">
                  Suspend
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