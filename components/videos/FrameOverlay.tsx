"use client";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { VideoPost } from "@/lib/getVideos";
import { toggleLike } from "@/lib/toggleLike";
import CommentsSheet from "./CommentsSheet";
import { toggleSave } from "@/lib/toggleSave";
import Link from "next/link";
import Toast from "@/components/ui/Toast";


export default function FrameOverlay({ video }: { video: VideoPost }) {
  const creator = video.profiles;
  const name = creator?.display_name || creator?.username || "Frame Creator";
const [likes, setLikes] = useState(video.like_count || 0);
const [liked, setLiked] = useState(video.user_has_liked || false);
const [showHeart, setShowHeart] = useState(false);
const [shareMessage, setShareMessage] = useState("");
const [commentsOpen, setCommentsOpen] = useState(false);
const [saves, setSaves] = useState(video.save_count || 0);
const [saved, setSaved] = useState(false);
const [toast, setToast] = useState("");
const [commentCount, setCommentCount] = useState(
    


  video.comment_count || 0
);

useEffect(() => {
  async function checkLikedStatus() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) return;

   const { data } = await supabase
  .from("likes")
  .select("id")
  .eq("post_id", video.id)
  .eq("user_id", userId)
  .maybeSingle();

setLiked(!!data);

const { count } = await supabase
  .from("likes")
  .select("id", { count: "exact", head: true })
  .eq("post_id", video.id);

setLikes(count || 0);
  }

  checkLikedStatus();
}, [video.id]);

useEffect(() => {
  setLikes(video.like_count || 0);
  setLiked(video.user_has_liked || false);
}, [video.id, video.like_count, video.user_has_liked]);
  async function handleLike() {
    
  try {

    
    const previousLiked = liked;

    // Optimistic UI
    setLiked(!previousLiked);
    setLikes((current) =>
      previousLiked ? Math.max(0, current - 1) : current + 1
    );

    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 650);

    const result = await toggleLike(video.id);

    // Sync with database response
    setLiked(result.liked);
  } catch (err) {
    console.error(err);

    // Rollback optimistic update
    setLiked((current) => !current);
    setLikes((current) =>
      liked ? current + 1 : Math.max(0, current - 1)
    );
  }
}

async function handleShare() {
  const url = `${window.location.origin}/post/${video.id}`;
  const title = "Watch this video on Frame";

  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text: video.caption || title,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      setToast("Link copied");
setTimeout(() => setToast(""), 1600);
    }
  } catch (error) {
    console.error("Could not share video:", error);
  }
}
async function handleSave() {
  try {
    const previousSaved = saved;

    setSaved(!previousSaved);
    setSaves((current) =>
      previousSaved ? Math.max(0, current - 1) : current + 1
    );

    const result = await toggleSave(video.id);
    setSaved(result.saved);
  } catch (err) {
    console.error("Could not toggle save:", err);

    setSaved((current) => !current);
    setSaves((current) =>
      saved ? current + 1 : Math.max(0, current - 1)
    );
  }
}
useEffect(() => {
  async function checkSaveStatus() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    const { count } = await supabase
      .from("saves")
      .select("id", { count: "exact", head: true })
      .eq("post_id", video.id);

    setSaves(count || 0);

    if (!userId) return;

    const { data } = await supabase
      .from("saves")
      .select("id")
      .eq("post_id", video.id)
      .eq("user_id", userId)
      .maybeSingle();

    setSaved(!!data);
  }

  checkSaveStatus();
}, [video.id]);

  useEffect(() => {
    function onLike(event: Event) {
      const detail = (event as CustomEvent).detail;
      if (detail?.postId !== video.id) return;

      handleLike();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 650);
    }

    window.addEventListener("frame-video-like", onLike);
    return () => window.removeEventListener("frame-video-like", onLike);
  }, [video.id, liked]);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

      {showHeart && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-7xl">
          ❤️
        </div>
      )}

      <div className="absolute bottom-6 left-5 right-20 z-10">
       <Link
  href={creator?.username ? `/profile/${creator.username}` : "#"}
  className="group flex items-center gap-3"
>
  <div className="h-11 w-11 overflow-hidden rounded-2xl bg-zinc-900">
    {creator?.avatar_url ? (
      <img
        src={creator.avatar_url}
        alt=""
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center font-black text-yellow-400">
        {name[0].toUpperCase()}
      </div>
    )}
  </div>

  <div className="min-w-0">
    <div className="flex items-center gap-2">
      <p className="truncate font-black transition-colors group-hover:text-yellow-400">
        {name}
      </p>

      {(creator?.is_founding_creator || creator?.is_golden_creator) && (
        <Image
          src="/assets/gold-frame-64.png"
          alt="The Gold Frame"
          width={20}
          height={20}
        />
      )}
    </div>

    <p className="text-xs text-zinc-400">Tap video for sound</p>
  </div>
</Link>

        {video.caption && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-200">
            {video.caption}
          </p>
        )}
      </div>
      <p className="mt-2 text-[10px] text-red-400">
 
</p>

      <div className="absolute bottom-8 right-4 z-10 grid gap-5 text-center">
        <button
         onClick={handleLike}
          className="grid gap-1 text-white"
        >
          <span className="text-3xl">{liked ? "❤️" : "🤍"}</span>
          <span className="text-xs font-bold">{likes}</span>
        </button>

       <button
  onClick={() => setCommentsOpen(true)}
  className="grid gap-1 text-white"
>
  <span className="text-3xl">💬</span>
  <span className="text-xs font-bold">{commentCount}</span>
</button>

       <button onClick={handleSave} className="grid gap-1 text-white">
  <span className="text-3xl">{saved ? "🔖" : "📑"}</span>
  <span className="text-xs font-bold">{saves}</span>
</button>

       <button onClick={handleShare} className="grid gap-1 text-white">
  <span className="text-3xl">↗️</span>
  <span className="text-xs font-bold">
    {shareMessage || "Share"}
  </span>
</button>
      </div>
      <CommentsSheet
  postId={video.id}
  open={commentsOpen}
  onClose={() => setCommentsOpen(false)}
  onCommentAdded={() =>
    setCommentCount((current) => current + 1)
    
  }
/>
<Toast message={toast} />
    </>
  );
}