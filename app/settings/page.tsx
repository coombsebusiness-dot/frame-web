'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  async function loadBlockedUsers() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: blocks } = await supabase
      .from('blocked_users')
      .select('id, blocked_id')
      .eq('blocker_id', user.id);

    const blockedIds = (blocks || []).map((block) => block.blocked_id);

    if (blockedIds.length === 0) {
      setBlockedUsers([]);
      setLoading(false);
      return;
    }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', blockedIds);

    const usersWithBlockId = (profiles || []).map((profile) => {
      const block = blocks?.find((b) => b.blocked_id === profile.id);

      return {
        ...profile,
        blockId: block?.id,
      };
    });

    setBlockedUsers(usersWithBlockId);
    setLoading(false);
  }

  async function unblockUser(blockId: number) {
    const confirmed = window.confirm('Unblock this user?');

    if (!confirmed) return;

    const { error } = await supabase
      .from('blocked_users')
      .delete()
      .eq('id', blockId);

    if (error) {
      alert(error.message);
      return;
    }

    loadBlockedUsers();
  }
 async function deleteAccount() {
  const confirmed = window.confirm(
    'Are you absolutely sure? This will permanently delete your Frame account.'
  );

  if (!confirmed) return;

  const { data, error } = await supabase.functions.invoke('delete-account');

  if (error) {
    alert(error.message);
    return;
  }

  await supabase.auth.signOut();

  alert('Account deleted');

  window.location.href = '/';
}

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Settings
        </h1>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <h2 className="mb-4 text-2xl font-bold">Blocked Users</h2>

          {loading && (
            <p className="text-zinc-500">Loading blocked users...</p>
          )}

          {!loading && blockedUsers.length === 0 && (
            <p className="text-zinc-500">You have not blocked anyone.</p>
          )}

          <div className="space-y-3">
            {blockedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black p-4"
              >
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-3"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-zinc-800" />
                  )}

                  <div>
                    <p className="font-semibold">
                      {user.display_name || user.username}
                    </p>
                    <p className="text-sm text-zinc-500">
                      @{user.username}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => unblockUser(user.blockId)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white hover:text-black"
                >
                  Unblock
                </button>
                <section className="mt-8 rounded-3xl border border-red-500/20 bg-zinc-950 p-6">
  <h2 className="mb-4 text-2xl font-bold text-red-400">
    Danger Zone
  </h2>

  <p className="mb-4 text-zinc-400">
    Permanently delete your Frame account.
  </p>

  <button
    onClick={deleteAccount}
    className="rounded-full border border-red-500/20 px-5 py-3 text-red-400 hover:bg-red-500/10"
  >
    Delete Account
  </button>
</section>
              </div>
              
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}