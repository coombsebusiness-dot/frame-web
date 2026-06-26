'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type FollowButtonProps = {
  profileId: string;
};

export default function FollowButton({ profileId }: FollowButtonProps) {
  const [currentUserId, setCurrentUserId] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowState();
  }, []);

  async function loadFollowState() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setCurrentUserId(user.id);

    const { data } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', profileId)
      .single();

    setIsFollowing(!!data);
    setLoading(false);
  }

  async function toggleFollow() {
    if (!currentUserId || currentUserId === profileId) return;

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', profileId);

      setIsFollowing(false);
    } else {
      await supabase.from('follows').insert({
        follower_id: currentUserId,
        following_id: profileId,
      });

      setIsFollowing(true);
    }
  }

  if (loading || !currentUserId || currentUserId === profileId) {
    return null;
  }

  return (
    <button
      onClick={toggleFollow}
      className={`mt-5 rounded-full px-6 py-2 font-semibold ${
        isFollowing
          ? 'border border-white/20 bg-zinc-900 text-white hover:bg-zinc-800'
          : 'bg-white text-black hover:bg-zinc-200'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}