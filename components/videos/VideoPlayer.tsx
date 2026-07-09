export default function VideoPlayer({ src }: { src: string }) {
  return (
    <video
      src={src}
      controls
      playsInline
      className="aspect-[9/16] w-full rounded-[2rem] bg-black object-cover"
    />
  );
}