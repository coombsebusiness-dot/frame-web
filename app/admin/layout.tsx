"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import CommandPalette from "../admin/CommandPalette";
import NotificationBell from "../admin/NotificationBell";
import CommandPaletteButton from "../admin/CommandPaletteButton";
import AdminSidebar from "../admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    async function checkAdminAccess() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (profileError || !profile?.is_admin) {
        router.replace("/");
        return;
      }

      setCheckingAccess(false);
    }

    checkAdminAccess();
  }, [router]);

  if (checkingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
            Frame HQ
          </p>

          <p className="mt-4 text-zinc-400">
            Checking administrator access...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="flex min-h-screen flex-col border-r border-white/10 bg-zinc-950 px-6 py-8">
          <AdminSidebar />
        </aside>

        <section className="px-8 py-8">
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