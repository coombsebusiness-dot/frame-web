type Props = {
  users: number;
  posts: number;
  videos: number;
  applications: number;
  reports: number;
};

export default function WelcomeHero({
  users,
  posts,
  videos,
  applications,
  reports,
}: Props) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <section className="overflow-hidden rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 via-black to-zinc-950 p-10">

      <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
        Frame HQ
      </p>

      <h1 className="mt-4 text-5xl font-black">
        {greeting}, Lee 👋
      </h1>

      <p className="mt-4 max-w-3xl text-lg text-zinc-300">
        Welcome back to Frame HQ.
        Here's what's happening across your creative community today.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-5">

        <Stat
          value={users}
          label="Users"
        />

        <Stat
          value={posts}
          label="Posts"
        />

        <Stat
          value={videos}
          label="Videos"
        />

        <Stat
          value={applications}
          label="Applications"
        />

        <Stat
          value={reports}
          label="Reports"
        />

      </div>

    </section>
  );
}

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div>

      <h2 className="text-4xl font-black text-yellow-400">
        {value}
      </h2>

      <p className="mt-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>

    </div>
  );
}