import { getGoldenCreators } from "@/lib/getGoldenCreators";
import Image from "next/image";

function formatMemberSince(date?: string | null) {
  if (!date) return "Founding member";

  return new Date(date).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default async function GoldenCreatorsSection() {
  const creators = await getGoldenCreators();

  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Founding Creators
        </p>

        <h2 className="mt-5 text-4xl font-black md:text-6xl">
          Meet The Founders.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
          The creators who believed in Frame before the world knew its name.
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {creators.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-zinc-500">
            Founding creators will appear here soon.
          </div>
        ) : (
          creators.map((creator) => {
            const name =
              creator.display_name || creator.username || "Golden Creator";

            return (
              <article
                key={creator.id}
                className="group relative overflow-hidden rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-white/[0.04] to-black p-7 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-500/10"
              >
                <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-yellow-400/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="flex items-start gap-5">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-black">
                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl font-black text-yellow-400">
                          {name[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-2xl font-black leading-tight">
                            {name}
                          </h3>

                          <p className="mt-2 text-sm font-bold text-yellow-400">
                            Founding Creator
                          </p>
                        </div>

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-black/30">
                          <Image
                            src="/assets/gold-frame-64.png"
                            alt="The Gold Frame"
                            width={42}
                            height={42}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 rounded-2xl border border-white/10 bg-black/40 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                      Creator Type
                    </p>
                    <p className="mt-2 font-bold text-white">
                      {creator.creator_type || "Creator"}
                    </p>
                  </div>

                  {creator.bio && (
                    <p className="mt-5 line-clamp-3 min-h-[72px] text-sm leading-6 text-zinc-400">
                      {creator.bio}
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
                        Member since
                      </p>
                      <p className="mt-1 text-sm font-bold text-zinc-300">
                        {formatMemberSince(
                          creator.founding_creator_since || creator.created_at
                        )}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-zinc-300 transition-colors group-hover:border-yellow-400/40 group-hover:text-yellow-400">
                      Gold Frame
                    </span>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}