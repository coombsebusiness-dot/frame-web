import { StatCard } from "../AdminStats";

type Props = {
  users: number;
  posts: number;
  videos: number;
  applications: number;
};

export default function StatsGrid({
  users,
  posts,
  videos,
  applications,
}: Props) {
  return (
    <section className="grid gap-5 md:grid-cols-4">
      <StatCard
        title="Users"
        value={users}
        subtitle="Registered creators"
      />

      <StatCard
        title="Posts"
        value={posts}
        subtitle="Published posts"
        colour="blue"
      />

      <StatCard
        title="Videos"
        value={videos}
        subtitle="Uploaded videos"
        colour="green"
      />

      <StatCard
        title="Applications"
        value={applications}
        subtitle="Pending review"
        colour="gold"
      />
    </section>
  );
}