import Link from "next/link";

export function AdminHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-4xl font-black md:text-5xl">{title}</h2>
      {description && (
        <p className="mt-4 max-w-2xl text-zinc-400">{description}</p>
      )}
    </div>
  );
}

export function AdminCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      {children}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-zinc-500">
      {text}
    </div>
  );
}

export function ActionButton({
  children,
  variant = "default",
  onClick,
  href,
}: {
  children: React.ReactNode;
  variant?: "default" | "danger" | "success" | "gold";
  onClick?: () => void;
  href?: string;
}) {
  const styles =
    variant === "danger"
      ? "border border-red-500/40 text-red-400 hover:bg-red-500/10"
      : variant === "success"
      ? "bg-green-500 text-black hover:bg-green-400"
      : variant === "gold"
      ? "bg-yellow-400 text-black hover:bg-yellow-300"
      : "border border-white/10 text-white hover:bg-white/10";

  const className = `rounded-full px-5 py-3 text-sm font-bold ${styles}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}