'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
export default function MessagesPage() {
  const [userId, setUserId] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);
    const { data: deletedConversations } = await supabase
  .from('deleted_conversations')
  .select('other_user_id')
  .eq('user_id', user.id);

const deletedUserIds = (deletedConversations || []).map(
  (item) => item.other_user_id
);

    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    const uniqueUsers = new Map();

    (messages || []).forEach((message) => {
      const otherUserId =
        message.sender_id === user.id
          ? message.receiver_id
          : message.sender_id;

      if (!uniqueUsers.has(otherUserId)) {
        uniqueUsers.set(otherUserId, message);
      }
    });

    const latestMessages = Array.from(uniqueUsers.values()).filter(
  (message: any) => {
    const otherUserId =
      message.sender_id === user.id ? message.receiver_id : message.sender_id;

    return !deletedUserIds.includes(otherUserId);
  }
);

    const otherUserIds = latestMessages.map((message: any) =>
      message.sender_id === user.id ? message.receiver_id : message.sender_id
    );

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', otherUserIds);

    const conversationsWithProfiles = latestMessages.map((message: any) => {
      const otherUserId =
        message.sender_id === user.id ? message.receiver_id : message.sender_id;

      const profile = profiles?.find((p) => p.id === otherUserId);

      return {
        ...message,
        otherUser: profile,
      };
    });

    setConversations(conversationsWithProfiles);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Messages
        </h1>

       <div className="space-y-3">
  {conversations.map((conversation) => (
    <Link
      key={conversation.id}
      href={`/messages/${conversation.otherUser?.id}`}
      className="block"
    >
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 hover:border-white/20">
        <div className="flex items-center gap-3">
          {conversation.otherUser?.avatar_url ? (
            <img
              src={conversation.otherUser.avatar_url}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-zinc-800" />
          )}

          <div>
            <p className="font-semibold">
              {conversation.otherUser?.display_name ||
                conversation.otherUser?.username ||
                'Frame User'}
            </p>

            <p className="text-sm text-zinc-500">
              @{conversation.otherUser?.username}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm text-zinc-400 line-clamp-1">
          {conversation.body}
        </p>

        <p className="mt-2 text-xs text-zinc-500">
          {new Date(conversation.created_at).toLocaleString()}
        </p>
      </div>
    </Link>
  ))}
</div>
      </div>
    </main>
  );
}