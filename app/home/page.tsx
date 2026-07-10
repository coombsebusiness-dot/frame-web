'use client';

import Navbar from '@/components/Navbar';
import FollowButton from '@/components/FollowButton';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [suggestedCreators, setSuggestedCreators] = useState<any[]>([]);
  const [feedMode, setFeedMode] = useState<'following' | 'forYou'>('following');
  const [stories, setStories] = useState<any[]>([]);

 useEffect(() => {
  loadPosts(feedMode);
}, [feedMode]);

  async function loadPosts(mode: 'following' | 'forYou' = feedMode) {

const twentyFourHoursAgo = new Date(
  Date.now() - 24 * 60 * 60 * 1000
).toISOString();

const { data: storiesData } = await supabase
  .from('stories')
  .select(`
    id,
    user_id,
    media_url,
    media_type,
    thumbnail_url,
    story_text,
    text_color,
    text_x,
    text_y,
    created_at,
    profiles!stories_user_id_fkey (
      username,
      display_name,
      avatar_url
    )
  `)
  .gte('created_at', twentyFourHoursAgo)
  .order('created_at', { ascending: false });
 

setStories(storiesData || []);


    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) return;

setUserId(user.id);

const { data: blockedUsers } = await supabase
  .from('blocked_users')
  .select('blocked_id')
  .eq('blocker_id', user.id);

const blockedIds =
  blockedUsers?.map((b) => b.blocked_id) || [];
if (user) {
 const { data: creators } = await supabase
  .from('profiles')
  .select('id, username, display_name, avatar_url')
  .neq('id', user.id);

const { data: follows } = await supabase
  .from('follows')
  .select('following_id');

const followerCounts = new Map<string, number>();

(follows ?? []).forEach((follow) => {
  followerCounts.set(
    follow.following_id,
    (followerCounts.get(follow.following_id) || 0) + 1
  );
});



const sortedCreators = (creators ?? [])
  .map((creator) => ({
    ...creator,
    followers_count: followerCounts.get(creator.id) || 0,
  }))
  .sort((a, b) => b.followers_count - a.followers_count)
  .slice(0, 6);

setSuggestedCreators(sortedCreators);
}
let followedUserIds: string[] = [];

if (mode === 'following' && user) {
  const { data: follows } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id);

  followedUserIds = (follows ?? []).map((follow) => follow.following_id);

  if (followedUserIds.length === 0) {
    setPosts([]);
    setLoading(false);
    return;
  }
}
  let query = supabase
  .from('posts')
  .select(`
    *,
   profiles!posts_user_id_fkey (
  username,
  display_name,
  avatar_url,
  is_founding_creator,
  is_golden_creator
    ),
    likes (
      id,
      user_id
    ),
    comments (
      id,
      body,
      created_at,
      profiles!comments_user_id_fkey (
        username,
        display_name,
        avatar_url
      ),
      comment_likes (
        id,
        user_id
      )
    )
  `)
  .order('created_at', { ascending: false })
  .limit(30);

if (mode === 'following') {
  query = query.in('user_id', followedUserIds);
}

const { data, error } = await query;

    if (error) {
      console.log('Home feed error:', error);
    } else {
      setPosts(data || []);
    }
    const filteredPosts =
  (data || []).filter(
    (post) => !blockedIds.includes(post.user_id)
  );

setPosts(filteredPosts);

    setLoading(false);
  }
  async function toggleCommentLike(commentId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: existing } = await supabase
    .from('comment_likes')
    .select('*')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    await supabase
      .from('comment_likes')
      .delete()
      .eq('id', existing.id);
  } else {
    await supabase
      .from('comment_likes')
      .insert({
        comment_id: commentId,
        user_id: user.id,
      });
  }

  loadPosts();
}
async function toggleLike(postId: string) {
  if (!userId) return;

 


  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);
  } else {
    await supabase
      .from('likes')
      .insert({
        post_id: postId,
        user_id: userId,
      });
  }

  loadPosts();
}
async function addComment(postId: string) {
  const commentText = commentDrafts[postId]?.trim();

  if (!userId || !commentText) return;

  const { error } = await supabase.from('comments').insert({
    user_id: userId,
    post_id: postId,
    body: commentText,
  });

  if (error) {
    console.log('Comment error:', error);
    return;
  }

  setCommentDrafts((current) => ({
    ...current,
    [postId]: '',
  }));

  loadPosts(feedMode);
}
    async function deletePost(postId: string) {
  const confirmed = window.confirm('Delete this post?');

  if (!confirmed) return;

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) {
    console.log('Delete error:', error);
    return;
  }

  loadPosts(feedMode);
}

async function sharePost(postId: string) {
  const postUrl = `${window.location.origin}/post/${postId}`;

  await navigator.clipboard.writeText(postUrl);

  alert('Post link copied.');
}
async function savePost(postId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: existing } = await supabase
    .from('saves')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .maybeSingle();

  if (existing) {
    alert('Already saved');
    return;
  }

  const { error } = await supabase
    .from('saves')
    .insert({
      user_id: user.id,
      post_id: postId,
    });

  if (!error) {
    alert('Post saved');
  }
}
console.log('Stories:', stories);
  return (
  <main className="min-h-screen bg-black text-white">
    <Navbar />

    

    <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
  {stories.map((story) => ( 
    
    <Link
  key={story.id}
  href={`/story/${story.id}`}
  
  className="flex min-w-[80px] flex-col items-center"
  
>
      {story.profiles?.avatar_url ? (
        <img
          src={story.profiles.avatar_url}
          alt=""
          className="h-16 w-16 rounded-full border-2 border-white object-cover"
        />
      ) : (
        <div className="h-16 w-16 rounded-full border-2 border-white bg-zinc-800" />
      )}

      <span className="mt-2 max-w-[80px] truncate text-xs text-zinc-400">
        {story.profiles?.username}
      </span>
      
    </Link>
  ))}
</div>
     <div className="mb-8 text-center">
  <h1 className="text-4xl font-bold tracking-tight">
    Home
  </h1>

  <p className="mt-2 text-sm text-zinc-500">
    Discover and connect with creatives
  </p>
</div>
      <div className="mb-8 flex rounded-full border border-white/10 bg-zinc-950 p-1">
  <button
    onClick={() => setFeedMode('following')}
    className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${
      feedMode === 'following'
        ? 'bg-white text-black'
        : 'text-zinc-400 hover:text-white'
    }`}
  >
    Following
  </button>

  <button
    onClick={() => setFeedMode('forYou')}
    className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${
      feedMode === 'forYou'
        ? 'bg-white text-black'
        : 'text-zinc-400 hover:text-white'
    }`}
  >
    For You
  </button>
</div>

        {loading && <p className="text-zinc-400">Loading feed...</p>}

        {!loading && posts.length === 0 && feedMode === 'following' && (
  <div>
    <p className="mb-6 text-center text-zinc-400">
      No posts from people you follow yet.
    </p>

    <h2 className="mb-4 text-center text-2xl font-bold">
      Suggested Creators
    </h2>

    <div className="grid gap-4 sm:grid-cols-2">
      {suggestedCreators.map((creator) => (
        <div
          key={creator.id}
          className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-center"
        >
          <Link href={`/profile/${creator.username}`}>
            {creator.avatar_url ? (
              <img
                src={creator.avatar_url}
                alt=""
                className="mx-auto mb-3 h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-zinc-800" />
            )}

            <p className="font-semibold">
              {creator.display_name || creator.username}
            </p>

            <p className="text-sm text-zinc-500">@{creator.username}</p>
            <p className="mt-1 text-xs text-zinc-500">
  {creator.followers_count || 0} followers
</p>
          </Link>

          <div className="mt-3">
            <FollowButton profileId={creator.id} />
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{!loading && posts.length === 0 && feedMode === 'forYou' && (
  <p className="text-center text-zinc-400">No posts yet.</p>
)}
        

        <div className="space-y-8">
          {posts.map((post) => (
           <article
  key={post.id}
  className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"
>
  <div className="flex items-center gap-3 p-4">
    {post.profiles?.avatar_url ? (
      <img
        src={post.profiles.avatar_url}
        alt=""
        className="h-10 w-10 rounded-full object-cover"
      />
    ) : (
      <div className="h-10 w-10 rounded-full bg-zinc-800" />
    )}

    <div>
  <div className="flex items-center gap-2">
    <Link
      href={`/profile/${post.profiles?.username}`}
      className="font-semibold hover:underline"
    >
      {post.profiles?.display_name ||
        post.profiles?.username ||
        "Frame User"}
    </Link>

    {(post.profiles?.is_founding_creator ||
      post.profiles?.is_golden_creator) && (
      <img
        src="/assets/gold-frame-16.png"
        alt="Golden Creator"
        className="h-4 w-4 shrink-0"
        draggable={false}
      />
    )}
  </div>

  <p className="text-sm text-zinc-500">
    @{post.profiles?.username}
  </p>
</div>
  </div>

  <Link href={`/post/${post.id}`}>
    <img
      src={post.image_url}
      alt={post.caption || 'Frame post'}
      className="w-full object-cover"
    />
  </Link>
{post.user_id === userId && (
  <button
    onClick={() => deletePost(post.id)}
    className="ml-4 text-sm text-white/60 transition hover:text-white"
  >
    🗑️ Delete
  </button>
)}

  {post.caption && (
  <div className="p-4">
    <p className="text-zinc-200">{post.caption}</p>
  </div>
)}

{post.tags?.length > 0 && (
  <div className="px-4 pb-4 flex flex-wrap gap-2">
    {post.tags.map((tag: string) => (
      <span
        key={tag}
        className="rounded-full bg-zinc-900 px-3 py-1 text-sm text-zinc-300"
      >
        #{tag}
      </span>
    ))}
  </div>
)}
<div className="border-t border-white/10 px-4 py-3">
  <div className="mb-2 flex items-center gap-6 text-sm font-semibold text-zinc-200">
   <button
  onClick={() => toggleLike(post.id)}
  className="hover:text-white"
>
  {post.likes?.some((like: any) => like.user_id === userId)
    ? '❤️ Liked'
    : '🤍 Like'}
</button>
<button
  onClick={() => sharePost(post.id)}
  className="text-sm text-white/60 transition hover:text-white"
>
  🔗 Share
</button>

<button
  onClick={() => savePost(post.id)}
  className="text-sm text-white/60 transition hover:text-white"
>
  🔖 Save
</button>

   <div className="mt-3 flex items-end gap-2">
 <textarea
  placeholder="Write a comment..."
  value={commentDrafts[post.id] || ''}
  onChange={(e) =>
    setCommentDrafts((current) => ({
      ...current,
      [post.id]: e.target.value,
    }))
  }
  rows={2}
  className="flex-1 resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white outline-none"
/>

  <button
    onClick={() => addComment(post.id)}
    className="h-9 rounded-full bg-white px-4 text-sm font-semibold text-black hover:bg-zinc-200"
  >
    Post
  </button>
</div>
  </div>

  <div className="text-sm text-zinc-400">
    ❤️ {post.likes?.length || 0} Likes • 💬 {post.comments?.length || 0} Comments •{' '}
    {new Date(post.created_at).toLocaleDateString()}
  </div>
  {post.comments?.length > 0 && (
  <div className="border-t border-white/10 px-4 py-3">
    <div className="space-y-3">
      {post.comments.map((comment: any) => (
        <div key={comment.id} className="flex gap-3">
          {comment.profiles?.avatar_url ? (
            <img
              src={comment.profiles.avatar_url}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-zinc-800" />
          )}

          <div>
            <p className="text-sm">
              <span className="font-semibold">
                {comment.profiles?.display_name ||
                  comment.profiles?.username ||
                  'Frame User'}
              </span>{' '}
              <span className="text-zinc-300">
                {comment.body}
              </span>
            </p>

            <p className="text-xs text-zinc-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </p>
            <div className="mt-1 flex items-center gap-3">
  <button
    onClick={() => toggleCommentLike(comment.id)}
    className="text-xs text-zinc-400 hover:text-white"
  >
    {comment.comment_likes?.some(
      (like: any) => like.user_id === userId
    )
      ? '❤️ Liked'
      : '🤍 Like'}
  </button>
 

  <span className="text-xs text-zinc-500">
    {comment.comment_likes?.length || 0}
  </span>
</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
</div>
</article>
          ))}
        </div>
      </div>
    </main>
  );
}