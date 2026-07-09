"use client";

import { useEffect, useState } from "react";

import { addComment } from "@/lib/addComment";
import CommentCard, { CommentCardData } from "./CommentCard";
import { getComments } from "@/lib/getComments";

type Comment = {
  id: string;
  body: string | null;
  created_at: string;
  profiles?: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export default function CommentsSheet({
  postId,
  open,
  onClose,
  onCommentAdded,
}: {
  postId: string;
  open: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}) {
  const [comments, setComments] = useState<CommentCardData[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<CommentCardData | null>(null);

 async function loadComments() {
  setLoading(true);

  const loadedComments = await getComments(postId);

  setComments(loadedComments);

  setLoading(false);
}

  async function submitComment() {
    if (!text.trim() || sending) return;

    try {
      setSending(true);

     const newComment = await addComment(
  postId,
  text,
  replyingTo?.id || null
);

setComments((current) => [
  {
    id: newComment.id,
    body: newComment.body,
    created_at: newComment.created_at,
    profiles: null,
  },
  ...current,
]);

setTimeout(() => {
  loadComments();
}, 300);

setText("");
setReplyingTo(null);
onCommentAdded?.();
    } catch (error) {
      console.error("Could not add comment:", JSON.stringify(error, null, 2));
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    if (open) loadComments();
  }, [open, postId]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/40">
      <button
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        aria-label="Close comments"
      />

      <div className="relative z-10 max-h-[72%] w-full rounded-t-[2rem] border-t border-white/10 bg-zinc-950 p-5">
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-zinc-700" />

        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black">Comments</h3>

          <button
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-400"
          >
            Close
          </button>
        </div>

        <div className="mt-5 max-h-[300px] space-y-4 overflow-y-auto pr-1">
          {loading ? (
            <p className="text-sm text-zinc-500">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-zinc-500">
               No comments yet. Start the conversation.
    </p>
  ) : (
    comments.map((comment) => (
      <CommentCard
        key={comment.id}
        comment={comment}
       onReply={(comment) => {
  setReplyingTo(comment);
        }}
      />
    ))
  )}
</div>
{replyingTo && (
  <div className="mb-3 flex items-center justify-between rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-2">
    <span className="text-sm text-yellow-300">
      Replying to{" "}
      <strong>
        {replyingTo.profiles?.display_name ||
          replyingTo.profiles?.username ||
          "Creator"}
      </strong>
    </span>

    <button
      onClick={() => setReplyingTo(null)}
      className="text-xs text-zinc-400 hover:text-white"
    >
      Cancel
    </button>
  </div>
)}
{replyingTo && (
  <div className="mt-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-yellow-300">
        Replying to{" "}
        <span className="font-black">
          {replyingTo.profiles?.display_name ||
            replyingTo.profiles?.username ||
            "Frame Creator"}
        </span>
      </p>

      <button
        onClick={() => setReplyingTo(null)}
        className="text-xs font-bold text-zinc-400 hover:text-white"
      >
        Cancel
      </button>
    </div>
  </div>
)}
<div className="mt-5 flex gap-2">
  <input
    value={text}
    onChange={(e) => setText(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") submitComment();
    }}
    placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
    className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-zinc-600"
  />

  <button
    onClick={submitComment}
    disabled={sending}
    className="rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-black disabled:opacity-50"
  >
    Send
  </button>
</div>
      </div>
    </div>
  );
}