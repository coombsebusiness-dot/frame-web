'use client';

type SharePostButtonProps = {
  postId: string;
  caption?: string | null;
};

export default function SharePostButton({
  postId,
  caption,
}: SharePostButtonProps) {
  const handleShare = async () => {
    const postUrl = `https://frameapp.uk/post/${postId}`;
    const shareText = `${caption || 'Check out this post on Frame'}\n\n${postUrl}`;

    try {
      await navigator.clipboard.writeText(shareText);
      alert('Post link copied to clipboard');
    } catch (error) {
      window.prompt('Copy this link:', postUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="mt-3 inline-flex w-full justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white"
    >
      Share Post
    </button>
  );
}