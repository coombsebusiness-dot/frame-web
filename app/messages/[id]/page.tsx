'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

export default function ChatPage() {
  const params = useParams();
  const otherUserId = params.id as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);

  

useEffect(() => {
  console.log('Chat realtime useEffect running');

  loadMessages();


  
  

  const channel = supabase
    .channel(`messages-${otherUserId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
      },
      () => {
        console.log('Realtime message received');
        loadMessages();
      }
    )
    .subscribe((status) => {
      console.log('Realtime status:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  async function loadMessages() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);

    await supabase
  .from('messages')
  .update({ read: true })
  .eq('receiver_id', user.id)
  .eq('sender_id', otherUserId)
  .eq('read', false);

  const { data: blocked } = await supabase
  .from('blocked_users')
  .select('*')
  .or(
    `and(blocker_id.eq.${user.id},blocked_id.eq.${otherUserId}),and(blocker_id.eq.${otherUserId},blocked_id.eq.${user.id})`
  );

if (blocked && blocked.length > 0) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      You cannot message this user.
    </main>
  );
}

    const { data: profile } = await supabase
  .from('profiles')
  .select('username, display_name, avatar_url')
  .eq('id', otherUserId)
  .single();

setOtherUser(profile);

    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true });

    setMessages(data || []);
  }
async function sendMessage() {
  if (!userId || !newMessage.trim()) return;

  const { error } = await supabase.from('messages').insert({
    sender_id: userId,
    receiver_id: otherUserId,
    body: newMessage,
    read: false,
  });

  if (error) {
    console.log('Send message error:', error);
    return;
  }

  setNewMessage('');
  loadMessages();
}
async function deleteConversation() {
  if (!confirm('Delete this conversation?')) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from('deleted_conversations').insert({
    user_id: user.id,
    other_user_id: otherUserId,
  });

  window.location.href = '/messages';
}
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-4">
  {otherUser?.avatar_url ? (
    <img
      src={otherUser.avatar_url}
      alt=""
      className="h-12 w-12 rounded-full object-cover"
    />
  ) : (
    <div className="h-12 w-12 rounded-full bg-zinc-800" />
  )}

  <div>
    <h1 className="text-xl font-bold">
      {otherUser?.display_name ||
        otherUser?.username ||
        'Frame User'}
    </h1>

    <p className="text-sm text-zinc-500">
      @{otherUser?.username}
    </p>
   
  </div>
</div>
 <button
  onClick={deleteConversation}
  className="text-sm text-zinc-500 hover:text-white"
>
  Delete Conversation
</button>

        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.sender_id === userId
                  ? 'ml-auto bg-white text-black'
                  : 'bg-zinc-900 text-white'
              }`}
            >
              {message.body}
            </div>
            
          ))}
        </div>
        <div className="mt-6 flex items-end gap-2">
  <textarea
    placeholder="Type a message..."
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    rows={2}
    className="flex-1 resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white outline-none"
  />

  <button
    onClick={sendMessage}
    className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
  >
    Send
  </button>
</div>
      </div>
    </main>
  );
}