type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  colour?: "gold" | "green" | "red" | "blue";
};

export function StatCard({
  title,
  value,
  subtitle,
  colour = "gold",
}: StatCardProps) {
  const colours = {
    gold: "text-yellow-400",
    green: "text-green-400",
    red: "text-red-400",
    blue: "text-sky-400",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-yellow-400/30 hover:bg-white/[0.06]">
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        {title}
      </p>

      <h3 className={`mt-3 text-5xl font-black ${colours[colour]}`}>
        {value}
      </h3>

      {subtitle && (
        <p className="mt-3 text-sm text-zinc-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}