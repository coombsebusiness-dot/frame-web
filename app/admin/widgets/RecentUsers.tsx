type User = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
};

export default function RecentUsers({
  users,
}: {
  users: User[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-2xl font-black">
        Recent Users
      </h2>

      <div className="mt-6 space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border-b border-white/10 pb-4 last:border-none"
          >
            <p className="font-bold">
              {user.username ||
                user.full_name ||
                "Unnamed User"}
            </p>

            <p className="text-sm text-zinc-500">
              {user.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}