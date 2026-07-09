"use client";

export default function CommandPaletteButton() {
  return (
    <button
      onClick={() => {
        window.dispatchEvent(new KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: true,
        }));
      }}
      className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-zinc-300 hover:bg-white/10 md:flex"
    >
      <span>Search Frame HQ</span>
      <kbd className="rounded-lg border border-white/10 bg-black px-2 py-1 text-xs text-zinc-500">
        Ctrl K
      </kbd>
    </button>
  );
}