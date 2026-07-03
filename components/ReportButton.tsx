'use client';

import { supabase } from '@/lib/supabase';

type Props = {
  profileId: string;
};

export default function ReportButton({ profileId }: Props) {
  async function reportUser() {
    const reason = window.prompt('Why are you reporting this user?');

    if (!reason) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from('reports').insert({
      reporter_id: user.id,
      reported_user_id: profileId,
      report_type: 'user',
      reason,
      status: 'open',
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert('Report submitted');
  }

  return (
    <button
      onClick={reportUser}
      className="mt-3 rounded-full border border-yellow-500/20 px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-500/10"
    >
      Report User
    </button>
  );
}