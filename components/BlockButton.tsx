'use client';

import { supabase } from '@/lib/supabase';

type Props = {
  profileId: string;
};

export default function BlockButton({ profileId }: Props) {
  async function blockUser() {
    const confirmed = window.confirm(
      'Block this user? They will no longer be able to interact with you.'
    );

    if (!confirmed) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from('blocked_users')
      .insert({
        blocker_id: user.id,
        blocked_id: profileId,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert('User blocked');
    window.location.href = '/home';
  }

  return (
    <button
      onClick={blockUser}
      className="mt-3 rounded-full border border-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
    >
      Block User
    </button>
  );
}