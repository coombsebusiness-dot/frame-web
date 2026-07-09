"use client";

import { useState } from "react";
import { toggleCommentLike } from "@/lib/toggleCommentLike";
import { timeAgo } from "@/lib/timeAgo";

export type CommentCardData = {
  id: string;
  body: string | null;
  created_at: string;

  like_count?: number;
  user_has_liked?: boolean;
  replies?: CommentCardData[];

  user_id?: string;

  profiles?: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    is_founding_creator?: boolean | null;
    is_golden_creator?: boolean | null;
  } | null;
};


export default function CommentCard({
  comment,
  onReply,
}: {
  comment: CommentCardData;
  onReply?: (comment: CommentCardData) => void;
  replies?: CommentCardData[];
}) {
  const [liked, setLiked] = useState(comment.user_has_liked || false);
const [likeCount, setLikeCount] = useState(comment.like_count || 0);

  const name =
    comment.profiles?.display_name ||
    comment.profiles?.username ||
    "Frame Creator";

  async function handleCommentLike() {
    try {
      const previousLiked = liked;

      setLiked(!previousLiked);
      setLikeCount((current) =>
        previousLiked ? Math.max(0, current - 1) : current + 1
      );

      const result = await toggleCommentLike(comment.id);
      setLiked(result.liked);
    } catch (error) {
      console.error("Could not like comment:", error);

      setLiked((current) => !current);
      setLikeCount((current) =>
        liked ? current + 1 : Math.max(0, current - 1)
      );
    }
  }

  return (
  <div>
    <div className="flex gap-3">
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
        {comment.profiles?.avatar_url ? (
          <img
            src={comment.profiles.avatar_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-black text-yellow-400">
            {name[0].toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
  <p className="text-sm font-bold">{name}</p>

  {(comment.profiles?.is_founding_creator ||
    comment.profiles?.is_golden_creator) && (
   <img
  src="/assets/gold-frame-16.png"
  alt="Golden Creator"
  className="h-4 w-4"
  draggable={false}
/>
  )}
</div>
<p className="text-xs text-zinc-500">
  {timeAgo(comment.created_at)}
</p>

        <p className="mt-1 text-sm leading-5 text-zinc-300">
          {comment.body}
        </p>

        <div className="mt-2 flex items-center gap-4 text-xs font-bold text-zinc-500">
          <button
            onClick={handleCommentLike}
            className={liked ? "text-red-400" : "hover:text-white"}
          >
            ❤️ {likeCount}
          </button>

          <button
            onClick={() => onReply?.(comment)}
            className="hover:text-white"
          >
            Reply
          </button>
        </div>
      </div>
    </div>

    {comment.replies && comment.replies.length > 0 && (
      <div className="mt-4 space-y-4 border-l border-white/10 pl-5">
        {comment.replies.map((reply) => (
          <CommentCard
            key={reply.id}
            comment={reply}
            onReply={onReply}
          />
        ))}
      </div>
    )}
  </div>
);
}