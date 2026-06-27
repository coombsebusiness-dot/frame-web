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

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Frame Creative Network',
          text: caption || 'Check out this post on Frame',
          url: postUrl,
        });
      } else {
        await navigator.clipboard.writeText(postUrl);
        alert('Post link copied to clipboard');
      }
    } catch (error) {
      console.log('Share cancelled or failed:', error);
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