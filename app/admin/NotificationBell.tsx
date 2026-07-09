"use client";

import { useEffect, useRef, useState } from "react";

const notifications = [
  {
    id: 1,
    icon: "🥇",
    title: "New Golden Creator Application",
    body: "Sarah Johnson applied",
    time: "2 mins ago",
  },
  {
    id: 2,
    icon: "🚩",
    title: "New Report",
    body: "Community report received",
    time: "5 mins ago",
  },
  {
    id: 3,
    icon: "👤",
    title: "New Creator",
    body: "James Cooper joined Frame",
    time: "12 mins ago",
  },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClick);

    return () =>
      window.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>

      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full border border-white/10 bg-white/5 p-3 hover:bg-white/10"
      >
        🔔

        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {notifications.length}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">

          <div className="border-b border-white/10 px-6 py-5">
            <h3 className="text-xl font-black">
              Notifications
            </h3>
          </div>

          {notifications.map((n) => (
            <button
              key={n.id}
              className="flex w-full gap-4 border-b border-white/5 px-6 py-5 text-left hover:bg-white/5"
            >
              <div className="text-2xl">{n.icon}</div>

              <div className="flex-1">
                <p className="font-bold">{n.title}</p>
                <p className="mt-1 text-sm text-zinc-400">
                  {n.body}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  {n.time}
                </p>
              </div>
            </button>
          ))}

        </div>
      )}
    </div>
  );
}