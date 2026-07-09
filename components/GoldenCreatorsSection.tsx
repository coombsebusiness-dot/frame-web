import { getGoldenCreators } from "@/lib/getGoldenCreators";
import Image from "next/image";

function formatMemberSince(date?: string | null) {
  if (!date) return "Founding Member";

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
              creator.display_name ||
              creator.username ||
              "Golden Creator";

            return (
              <article
                key={creator.id}
                className="group relative overflow-hidden rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-white/[0.04] to-black p-8 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-500/10"
              >
                <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-yellow-400/10 blur-3xl" />

                <div className="relative z-10">

                  {/* Avatar */}
                  <div className="flex justify-center">
                    <div className="h-24 w-24 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-lg">
                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl font-black text-yellow-400">
                          {name[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="mt-5 flex justify-center">
                    <Image
                      src="/assets/gold-frame-64.png"
                      alt="The Gold Frame"
                      width={48}
                      height={48}
                    />
                  </div>

                  {/* Name */}
                  <h3 className="mt-5 text-center text-2xl font-black leading-tight text-white break-words">
                    {name}
                  </h3>

                  {/* Subtitle */}
                  <p className="mt-2 text-center text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
                    Founding Creator
                  </p>

                  {/* Creator Type */}
                  <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                      Creative Discipline
                    </p>

                    <p className="mt-2 text-lg font-bold text-white">
                      {creator.creator_type || "Creator"}
                    </p>
                  </div>

                  {/* Bio */}
                  {creator.bio && (
                    <p className="mt-6 min-h-[72px] text-center text-sm leading-7 text-zinc-400">
                      {creator.bio}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-8 border-t border-white/10 pt-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-600">
                      Founder Since
                    </p>

                    <p className="mt-2 font-bold text-white">
                      {formatMemberSince(
                        creator.founding_creator_since ||
                          creator.created_at
                      )}
                    </p>

                    <div className="mt-5 inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-sm font-bold text-yellow-400">
                      The Gold Frame
                    </div>
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