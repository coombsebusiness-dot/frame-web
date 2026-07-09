"use client";

export default function Toast({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-[9999] -translate-x-1/2 rounded-full border border-white/10 bg-zinc-950 px-5 py-3 text-sm font-bold text-white shadow-2xl">
      {message}
    </div>
  );
}