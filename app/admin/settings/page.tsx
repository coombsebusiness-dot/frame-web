"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [allowSignups, setAllowSignups] = useState(true);
  const [allowStories, setAllowStories] = useState(true);
  const [allowVideos, setAllowVideos] = useState(true);
  const [creatorApplications, setCreatorApplications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <>
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
          Settings
        </p>

        <h2 className="mt-3 text-4xl font-black md:text-5xl">
          Frame Settings
        </h2>

        <p className="mt-4 max-w-2xl text-zinc-400">
          Control core platform settings, community features and future admin
          tools from one place.
        </p>
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <Panel title="General">
          <Field label="Platform Name" value="Frame" />
          <Field label="Website" value="frame-network.com" />
          <Field label="Support Email" value="hello@frame-network.com" />
        </Panel>

        <Panel title="Community Features">
          <Toggle
            label="Allow Signups"
            description="Let new creators create accounts."
            enabled={allowSignups}
            onClick={() => setAllowSignups(!allowSignups)}
          />

          <Toggle
            label="Stories"
            description="Allow creators to post stories."
            enabled={allowStories}
            onClick={() => setAllowStories(!allowStories)}
          />

          <Toggle
            label="Video Uploads"
            description="Allow creators to upload videos."
            enabled={allowVideos}
            onClick={() => setAllowVideos(!allowVideos)}
          />

          <Toggle
            label="Golden Creator Applications"
            description="Allow applications from the landing page."
            enabled={creatorApplications}
            onClick={() => setCreatorApplications(!creatorApplications)}
          />
        </Panel>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <Panel title="System Health">
          <Health label="Supabase" />
          <Health label="Storage" />
          <Health label="Website" />
          <Health label="API" />
          <Health label="Push Notifications" />
        </Panel>

        <Panel title="Maintenance Mode">
          <div
            className={`rounded-2xl border p-6 ${
              maintenanceMode
                ? "border-red-500/30 bg-red-500/10"
                : "border-green-500/30 bg-green-500/10"
            }`}
          >
            <p
              className={`text-3xl font-black ${
                maintenanceMode ? "text-red-400" : "text-green-400"
              }`}
            >
              {maintenanceMode ? "Maintenance Mode" : "Online"}
            </p>

            <p className="mt-3 text-zinc-400">
              {maintenanceMode
                ? "Frame is marked as being under maintenance."
                : "Frame is currently marked as online."}
            </p>

            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`mt-6 rounded-full px-6 py-3 font-bold ${
                maintenanceMode
                  ? "bg-green-500 text-black hover:bg-green-400"
                  : "bg-red-500 text-white hover:bg-red-400"
              }`}
            >
              {maintenanceMode ? "Set Online" : "Enable Maintenance"}
            </button>
          </div>
        </Panel>
      </section>

      <section className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="text-2xl font-black text-red-400">Danger Zone</h3>
        <p className="mt-3 text-zinc-400">
          Future destructive actions like disabling uploads or locking the
          platform will live here.
        </p>
      </section>
    </>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h3 className="text-2xl font-black">{title}</h3>
      <div className="mt-6 grid gap-4">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4">
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 font-bold text-white">{value}</p>
    </div>
  );
}

function Toggle({
  label,
  description,
  enabled,
  onClick,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-left hover:bg-white/[0.06]"
    >
      <div>
        <p className="font-bold">{label}</p>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>

      <span
        className={`rounded-full px-4 py-2 text-xs font-black ${
          enabled ? "bg-green-500 text-black" : "bg-zinc-700 text-zinc-300"
        }`}
      >
        {enabled ? "ON" : "OFF"}
      </span>
    </button>
  );
}

function Health({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-5 py-4">
      <span className="font-bold">{label}</span>
      <span className="text-sm font-black text-green-400">Online</span>
    </div>
  );
}