import Navbar from "@/components/Navbar";
import FramePlayer from "@/components/videos/FramePlayer";
import { getVideos } from "@/lib/getVideos";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <main className="h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <div className="h-[calc(100vh-73px)]">
        <FramePlayer videos={videos} />
      </div>
    </main>
  );
}