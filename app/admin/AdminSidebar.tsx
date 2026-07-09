"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navGroups = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: "🏠" }],
  },
  {
    title: "Community",
    items: [
      { label: "Users", href: "/admin/users", icon: "👥" },
      { label: "Applications", href: "/admin/applications", icon: "🥇" },
      { label: "Reports", href: "/admin/reports", icon: "🚩" },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Posts", href: "/admin/posts", icon: "📸" },
      { label: "Videos", href: "/admin/videos", icon: "🎥" },
      { label: "Stories", href: "/admin/stories", icon: "📖" },
    ],
  },
  {
    title: "Growth",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: "📈" },
     { label: "Golden Creator Hub", href: "/golden-creator-hub", icon: "🥇" },
      { label: "Announcements", href: "/admin/announcements", icon: "📣" },
      { label: "Competitions", href: "/admin/competitions", icon: "🏆" },
      { label: "Feedback", href: "/admin/feedback", icon: "💬" },
      { label: "Frame AI", href: "/admin/ai", icon: "🤖" }
    ],
  },
  {
    title: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: "⚙️" }],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <Link href="/admin" className="text-2xl font-black tracking-wide">
        FRAME HQ
      </Link>

      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-yellow-400">
        Control Centre
      </p>

      <nav className="mt-10 space-y-8">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-zinc-600">
              {group.title}
            </p>

            <div className="space-y-2">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      active
                        ? "bg-yellow-400 text-black shadow-lg shadow-yellow-500/20"
                        : "text-zinc-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-10">
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
          <p className="font-bold text-green-400">🟢 All Systems Operational</p>
          <p className="mt-2 text-xs text-zinc-400">Frame HQ v1.0</p>
        </div>
      </div>
    </>
  );
}