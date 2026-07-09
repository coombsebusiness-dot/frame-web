type Activity = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  time: string;
};

export default function ActivityFeed({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-black">
          Live Activity
        </h2>

        <span className="flex items-center gap-2 text-sm text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Live
        </span>

      </div>

      <div className="mt-8 space-y-6">

        {activities.length === 0 ? (

          <p className="text-zinc-500">
            No recent activity.
          </p>

        ) : (

          activities.map((activity) => (

            <div
              key={activity.id}
              className="flex gap-4"
            >

              <div className="text-3xl">
                {activity.icon}
              </div>

              <div className="flex-1">

                <p className="font-bold">
                  {activity.title}
                </p>

                <p className="text-sm text-zinc-400">
                  {activity.subtitle}
                </p>

              </div>

              <p className="text-xs text-zinc-500">
                {activity.time}
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}