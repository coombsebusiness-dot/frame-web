export default function VideoActions({
  likes,
  comments,
  saves,
}: {
  likes: number;
  comments: number;
  saves: number;
}) {
  return (
    <div className="flex items-center gap-3 text-sm font-bold text-zinc-300">
      <span>❤️ {likes}</span>
      <span>💬 {comments}</span>
      <span>🔖 {saves}</span>
    </div>
  );
}