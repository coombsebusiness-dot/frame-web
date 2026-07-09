"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const examplePrompts = [
  "Give me this morning's briefing",
  "Who should I feature today?",
  "How healthy is the community?",
  "Do we have any moderation issues?",
];

type Message = {
  role: "ai" | "user";
  text: string;
};

export default function FrameAIPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [briefing, setBriefing] = useState("");
  const [loadingBriefing, setLoadingBriefing] = useState(true);
  const [thinking, setThinking] = useState(false);

  async function askFrameAI(question: string) {
    const { data, error } = await supabase.functions.invoke("frame-ai", {
      body: { prompt: question },
    });

    if (error) {
      console.error(error);
      return "Sorry Leigh, I couldn't reach Frame AI. Check the Edge Function logs.";
    }

    return data?.reply || "Frame AI replied, but no message came back.";
  }

  async function loadMorningBriefing() {
    setLoadingBriefing(true);

    const reply = await askFrameAI(
      "Give me a concise morning briefing for Frame HQ. Include community health, key stats, moderation issues, creator recommendation and suggested actions."
    );

    setBriefing(reply);
    setLoadingBriefing(false);
  }

  async function sendMessage(text?: string) {
    const question = text || prompt;
    if (!question.trim()) return;

    setMessages((current) => [...current, { role: "user", text: question }]);
    setPrompt("");
    setThinking(true);

    const reply = await askFrameAI(question);

    setMessages((current) => [...current, { role: "ai", text: reply }]);
    setThinking(false);
  }

  useEffect(() => {
    loadMorningBriefing();
  }, []);

  return (
    <>
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
          Frame AI
        </p>

        <h2 className="mt-3 text-4xl font-black md:text-5xl">
          Morning Briefing
        </h2>

        <p className="mt-4 max-w-2xl text-zinc-400">
          Frame AI now reads live platform data and helps you decide what needs
          your attention.
        </p>
      </div>

      <section className="mt-10 rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-white/[0.04] to-black p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
              Daily Intelligence
            </p>

            <h3 className="mt-3 text-4xl font-black">
              Good morning, Leigh 👋
            </h3>

            <p className="mt-3 text-zinc-400">
              Your live operational briefing for Frame.
            </p>
          </div>

          <button
            onClick={loadMorningBriefing}
            className="h-fit rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
          >
            Refresh Briefing
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-black/50 p-6">
          {loadingBriefing ? (
            <p className="text-zinc-500">Frame AI is preparing your briefing...</p>
          ) : (
            <p className="whitespace-pre-wrap leading-7 text-zinc-200">
              {briefing}
            </p>
          )}
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-2xl font-black">Ask Frame AI</h3>

          <div className="mt-6 min-h-[360px] space-y-5">
            {messages.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-zinc-500">
                Ask a question about creators, reports, growth or community
                health.
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] rounded-3xl px-5 py-4 ${
                    message.role === "user"
                      ? "ml-auto bg-yellow-400 text-black"
                      : "bg-black/50 text-zinc-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              ))
            )}

            {thinking && (
              <div className="max-w-[85%] rounded-3xl bg-black/50 px-5 py-4 text-zinc-500">
                Frame AI is thinking...
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Ask Frame AI..."
              className="flex-1 rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500"
            />

            <button
              onClick={() => sendMessage()}
              className="rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300"
            >
              Ask
            </button>
          </div>
        </div>

        <aside className="grid gap-6">
          <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-6">
            <h3 className="text-2xl font-black text-green-400">
              Live Intelligence
            </h3>
            <p className="mt-3 text-sm text-zinc-300">
              Connected to Frame data, creator scoring and recommendation
              context.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-2xl font-black">Try asking</h3>

            <div className="mt-5 grid gap-3">
              {examplePrompts.map((item) => (
                <button
                  key={item}
                  onClick={() => sendMessage(item)}
                  className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-left text-sm font-bold text-white hover:bg-white/10"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}