import Link from "next/link";
import CommandPalette from "../admin/CommandPalette";
import NotificationBell from "../admin/NotificationBell";
import CommandPaletteButton from "../admin/CommandPaletteButton";
import AdminSidebar from "../admin/AdminSidebar";

const navItems = [
  ["Dashboard", "/admin"],
  ["Users", "/admin/users"],
  ["Applications", "/admin/applications"],
  ["Creator Collective", "/admin/creator-collective"],
  ["Reports", "/admin/reports"],
  ["Posts", "/admin/posts"],
  ["Videos", "/admin/videos"],
  ["Stories", "/admin/stories"],
  ["Analytics", "/admin/analytics"],
  ["Announcements", "/admin/announcements"],
  ["Competitions", "/admin/competitions"],
  ["Creator Hub", "/admin/creator-hub"],
  ["Feedback", "/admin/feedback"],
  ["Settings", "/admin/settings"],
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">

        {/* Sidebar */}
       <aside className="flex min-h-screen flex-col border-r border-white/10 bg-zinc-950 px-6 py-8">
    <AdminSidebar />
</aside>

        {/* Main Content */}
        <section className="px-8 py-8">

          {/* Top Bar */}
          <div className="mb-10 flex items-center justify-between">

            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
                Frame HQ
              </p>

              <h1 className="mt-3 text-5xl font-black">
                Control Centre
              </h1>
            </div>

            <div className="flex items-center gap-4">

              <CommandPaletteButton />

              <NotificationBell />

              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 font-black text-black">
                  L
                </div>

                <div className="hidden md:block">
                  <p className="font-bold">Leigh Coombs</p>
                  <p className="text-xs text-zinc-500">
                    Super Administrator
                  </p>
                </div>
              </div>

              <Link
                href="/"
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-zinc-300 hover:bg-white/10"
              >
                Back to site
              </Link>

            </div>

          </div>

          <CommandPalette />

          {children}

        </section>

      </div>
    </main>
  );
}