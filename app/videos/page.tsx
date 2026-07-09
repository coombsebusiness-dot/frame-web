export const dynamic = "force-dynamic";
export const revalidate = 0;

import FramePlayer from "@/components/videos/FramePlayer";
import { getVideos } from "@/lib/getVideos";

export default async function VideosPage() {
  const videos = await getVideos();

  return <FramePlayer videos={videos} />;
}