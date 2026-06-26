'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function StoryPage() {
  const params = useParams();
  const id = params.id as string;

  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState<any>(null);
  const [allStories, setAllStories] = useState<any[]>([]);
  const [viewCount, setViewCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
  loadStory();
}, [id]);

  useEffect(() => {
  if (!story || allStories.length === 0) return;

  const timer = setTimeout(() => {
    const currentIndex = allStories.findIndex(
      (item) => item.id === story.id
    );

    const nextStory = allStories[currentIndex + 1];

    if (nextStory) {
      window.location.href = `/story/${nextStory.id}`;
    } else {
      window.location.href = '/home';
    }
  }, 5000);

  return () => clearTimeout(timer);
}, [story, allStories]);

async function loadStory() {
  try {
    const { data } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    setStory(data);

   const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', data.user_id)
  .single();

setCreator(profile);



    if (data?.id) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
  setCurrentUserId(user.id);
}

      if (user) {
        await supabase.from('story_views').upsert({
          story_id: data.id,
          viewer_id: user.id,
        });
      }

      const { count } = await supabase
        .from('story_views')
        .select('*', { count: 'exact', head: true })
        .eq('story_id', data.id);

      setViewCount(count || 0);
    }
  } catch (error) {
    console.log('Story load error:', error);
  } finally {
    setLoading(false);
  }
}

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading story...
      </main>
    );
  }

  if (!story) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Story not found
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <Link
        href="/home"
        className="absolute left-6 top-6 text-sm text-zinc-400 hover:text-white"
      >
        ← Back
      </Link>

      <div className="relative max-h-[85vh] w-full max-w-md overflow-hidden rounded-3xl bg-zinc-950">
        <div className="absolute left-0 right-0 top-0 z-10 p-4">
  <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-white/30">
    <div
  className="h-full rounded-full bg-white transition-all duration-[5000ms]"
  style={{ width: '100%' }}
/>
  </div>
 {story.user_id === currentUserId && (
  <p className="mt-4 text-center text-sm text-zinc-400">
    👁 {viewCount} views
  </p>
)}
  

  <div className="flex items-center gap-3">
    {creator?.avatar_url ? (
      <img
        src={creator.avatar_url}
        alt=""
        className="h-9 w-9 rounded-full object-cover"
      />
    ) : (
      <div className="h-9 w-9 rounded-full bg-zinc-800" />
    )}

    <div>
      <p className="text-sm font-semibold">
        {creator?.display_name || creator?.username || 'Frame Creator'}
      </p>
      <p className="text-xs text-white/60">
        @{creator?.username}
      </p>
    </div>
  </div>
</div>
        {story.media_type === 'video' ? (
          <video
            src={story.media_url}
            controls
            autoPlay
            className="h-full w-full object-contain"
          />
        ) : (
          <img
            src={story.media_url}
            alt="Frame story"
            className="h-full w-full object-contain"
          />
        )}

        {story.story_text && story.story_text !== 'EMPTY' && (
          <div
            className="absolute font-bold drop-shadow-lg"
            style={{
              left: `${story.text_x || 20}px`,
              top: `${story.text_y || 420}px`,
              color: story.text_color || '#FFFFFF',
            }}
          >
            {story.story_text}
          </div>
          
          
        )}
      </div>
    
    </main>
  );
}