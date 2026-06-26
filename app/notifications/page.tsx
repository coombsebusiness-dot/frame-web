'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('notifications')
     .select(`
  *,
  profiles!notifications_actor_id_fkey (
    username
  )
`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

   if (!error) {
  setNotifications(data || []);

  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false);
}

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="space-y-3">
  {notifications.map((notification) => {
   let href = '/notifications';

if (notification.post_id) {
  href = `/post/${notification.post_id}`;
} else if (
  notification.type === 'follow' &&
  notification.profiles?.username
) {
  href = `/profile/${notification.profiles.username}`;
} else if (notification.type === 'message' && notification.actor_id) {
  href = `/messages/${notification.actor_id}`;
}

    return (
      <Link
        key={notification.id}
        href={href}
        className={`block rounded-2xl border p-4 ${
          notification.read
            ? 'border-white/10 bg-zinc-950'
            : 'border-blue-500/30 bg-blue-500/10'
        }`}
      >
        <p>{notification.message}</p>

        <p className="mt-2 text-sm text-zinc-500">
          {new Date(notification.created_at).toLocaleString()}
        </p>
      </Link>
    );
  })}
  </div>
    </main>
  );
}