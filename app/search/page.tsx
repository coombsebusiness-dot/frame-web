'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  async function searchUsers(value: string) {
    setQuery(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    const { data } = await supabase
      .from('profiles')
     .select('id, username, display_name, avatar_url, bio')
      .or(
        `username.ilike.%${value}%,display_name.ilike.%${value}%`
      )
      .limit(20);

    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  setUsers(data || []);
  return;
}

const { data: blockedUsers } = await supabase
  .from('blocked_users')
  .select('blocked_id, blocker_id')
  .or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`);

const blockedIds = (blockedUsers || []).map((block) =>
  block.blocker_id === user.id ? block.blocked_id : block.blocker_id
);

const filteredUsers = (data || []).filter(
  (profile) => !blockedIds.includes(profile.id)
);

setUsers(filteredUsers);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold">
          Search Creators
        </h1>

        <input
          type="text"
          placeholder="Search creators..."
          value={query}
          onChange={(e) => searchUsers(e.target.value)}
          className="mb-6 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
        />

        <div className="space-y-3">
          {users.map((user) => (
            <Link
              key={user.username}
              href={`/profile/${user.username}`}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 hover:bg-zinc-900"
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-zinc-800" />
              )}

              <div>
                <p className="font-semibold">
                  {user.display_name || user.username}
                </p>

                <p className="text-sm text-zinc-500">
                  @{user.username}
                </p>

                {user.bio && (
                  <p className="mt-1 text-sm text-zinc-400">
                    {user.bio}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}