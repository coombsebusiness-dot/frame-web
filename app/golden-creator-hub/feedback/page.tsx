"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type FeedbackType = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

const feedbackTypes: FeedbackType[] = [
  {
    id: "feature_request",
    icon: "💡",
    title: "Feature Request",
    description: "Suggest a new tool or improvement.",
  },
  {
    id: "bug_report",
    icon: "🐞",
    title: "Bug Report",
    description: "Tell us about something not working.",
  },
  {
    id: "creator_idea",
    icon: "🎨",
    title: "Creator Idea",
    description: "Share an idea for the creative community.",
  },
  {
    id: "general_feedback",
    icon: "❤️",
    title: "General Feedback",
    description: "Tell us what you think about Frame.",
  },
];

export default function GoldFrameFeedbackPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [creatorName, setCreatorName] = useState("Golden Creator");

  const [selectedType, setSelectedType] = useState(
    feedbackTypes[0].id
  );

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadCreator();
  }, []);

  async function loadCreator() {
    setLoading(true);
    setErrorMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.replace("/login");
      return;
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select(
          "id, username, display_name, is_founding_creator"
        )
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
      setErrorMessage(
        "We could not load your creator profile."
      );
      setLoading(false);
      return;
    }

    if (!profile.is_founding_creator) {
      router.replace("/golden-creator-hub");
      return;
    }

    setUserId(user.id);

    setCreatorName(
      profile.display_name ||
        profile.username ||
        "Golden Creator"
    );

    setLoading(false);
  }

  async function submitFeedback(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const cleanTitle = title.trim();
    const cleanMessage = message.trim();

    if (!selectedType) {
      setErrorMessage("Choose a feedback type.");
      return;
    }

    if (cleanTitle.length < 3) {
      setErrorMessage(
        "Please enter a short title for your feedback."
      );
      return;
    }

    if (cleanMessage.length < 10) {
      setErrorMessage(
        "Please give us a little more detail."
      );
      return;
    }

    if (!userId) {
      setErrorMessage(
        "We could not identify your creator account."
      );
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from("creator_feedback")
      .insert({
        user_id: userId,
        feedback_type: selectedType,
        title: cleanTitle,
        message: cleanMessage,
        status: "new",
      });

    if (error) {
      console.error("Creator feedback error:", error);

      setErrorMessage(
        "Your feedback could not be submitted. Please try again."
      );

      setSubmitting(false);
      return;
    }

    setTitle("");
    setMessage("");
    setSelectedType(feedbackTypes[0].id);

    setSuccessMessage(
      "Thank you — your feedback has been sent directly to Frame HQ."
    );

    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <Image
            src="/assets/gold-frame-64.png"
            alt=""
            width={64}
            height={64}
            className="mx-auto animate-pulse"
          />

          <p className="mt-5 text-zinc-400">
            Opening creator feedback...
          </p>
        </div>
      </main>
    );
  }

  const activeFeedbackType = feedbackTypes.find(
    (feedbackType) =>
      feedbackType.id === selectedType
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Link
          href="/golden-creator-hub"
          className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:bg-white/10"
        >
          ← Back to The Gold Frame
        </Link>

        <section className="mt-16 text-center">
          <div className="relative mx-auto h-32 w-32">
            <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-2xl" />

            <Image
              src="/assets/gold-frame-512.png"
              alt="The Gold Frame"
              width={120}
              height={120}
              className="relative mx-auto"
              priority
            />
          </div>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
            Creator Feedback
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Help shape Frame.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Welcome, {creatorName}. Share ideas, report
            issues and tell us what would make Frame better
            for creators.
          </p>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-2">
          {feedbackTypes.map((feedbackType) => {
            const selected =
              feedbackType.id === selectedType;

            return (
              <button
                key={feedbackType.id}
                type="button"
                onClick={() => {
                  setSelectedType(feedbackType.id);
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
                className={`rounded-[2rem] border p-8 text-left transition-all duration-300 ${
                  selected
                    ? "border-yellow-400/50 bg-yellow-400/10 shadow-[0_18px_60px_rgba(250,204,21,0.08)]"
                    : "border-white/10 bg-white/[0.04] hover:-translate-y-1 hover:border-yellow-400/30 hover:bg-yellow-400/[0.06]"
                }`}
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="text-4xl">
                    {feedbackType.icon}
                  </div>

                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                      selected
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : "border-white/20 text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                </div>

                <h3 className="mt-6 text-2xl font-black">
                  {feedbackType.title}
                </h3>

                <p className="mt-4 leading-7 text-zinc-400">
                  {feedbackType.description}
                </p>
              </button>
            );
          })}
        </section>

        <section className="mt-20 rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-black p-8 md:p-10">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
                Submit Feedback
              </p>

              <h2 className="mt-4 text-4xl font-black">
                Tell Frame HQ what you think
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
                Your feedback goes directly to the Frame
                team and helps influence future features,
                improvements and creator tools.
              </p>
            </div>

            {activeFeedbackType && (
              <div className="inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2">
                <span>{activeFeedbackType.icon}</span>

                <span className="text-sm font-bold text-yellow-300">
                  {activeFeedbackType.title}
                </span>
              </div>
            )}
          </div>

          <form
            onSubmit={submitFeedback}
            className="mt-10 grid gap-5"
          >
            <div>
              <label
                htmlFor="feedback-title"
                className="mb-3 block text-sm font-bold text-zinc-300"
              >
                Feedback title
              </label>

              <input
                id="feedback-title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                maxLength={120}
                placeholder="Give your feedback a clear title"
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10"
              />

              <div className="mt-2 text-right text-xs text-zinc-600">
                {title.length}/120
              </div>
            </div>

            <div>
              <label
                htmlFor="feedback-message"
                className="mb-3 block text-sm font-bold text-zinc-300"
              >
                Tell us more
              </label>

              <textarea
                id="feedback-message"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                maxLength={2000}
                placeholder="Describe your idea, issue or suggestion..."
                rows={8}
                className="w-full resize-y rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10"
              />

              <div className="mt-2 text-right text-xs text-zinc-600">
                {message.length}/2000
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-300">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm font-semibold text-green-300">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-yellow-400 px-6 py-4 font-black text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Sending feedback..."
                : "Send to Frame HQ"}
            </button>
          </form>
        </section>

        <section className="mt-12 text-center">
          <Link
            href="/golden-creator-hub"
            className="inline-flex rounded-full border border-white/10 px-8 py-4 font-bold text-white transition hover:bg-white/10"
          >
            Return to Creator Hub
          </Link>
        </section>
      </div>
    </main>
  );
}