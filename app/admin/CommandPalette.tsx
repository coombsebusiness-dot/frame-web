"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const commands = [
  { name: "Dashboard", path: "/admin", icon: "🏠" },
  { name: "Users", path: "/admin/users", icon: "👥" },
  { name: "Applications", path: "/admin/applications", icon: "🥇" },
  { name: "Reports", path: "/admin/reports", icon: "🚩" },
  { name: "Posts", path: "/admin/posts", icon: "📸" },
  { name: "Videos", path: "/admin/videos", icon: "🎥" },
  { name: "Stories", path: "/admin/stories", icon: "📖" },
  { name: "Analytics", path: "/admin/analytics", icon: "📈" },
  { name: "Settings", path: "/admin/settings", icon: "⚙️" },
];

export default function CommandPalette() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const results = useMemo(() => {
    if (!search) return commands;

    return commands.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center bg-black/70 backdrop-blur-md pt-32">

      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">

        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Frame HQ..."
          className="w-full border-b border-white/10 bg-transparent px-8 py-6 text-xl text-white outline-none"
        />

        <div className="max-h-[500px] overflow-y-auto">

          {results.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
                setOpen(false);
                setSearch("");
              }}
              className="flex w-full items-center gap-5 px-8 py-5 text-left hover:bg-white/5"
            >
              <span className="text-2xl">{item.icon}</span>

              <span className="text-lg font-semibold">
                {item.name}
              </span>
            </button>
          ))}

          {results.length === 0 && (
            <div className="p-8 text-zinc-500">
              No results found.
            </div>
          )}

        </div>
      </div>

    </div>
  );
}