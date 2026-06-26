'use client';

import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ChangeEmailPage() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from('email_change_requests')
      .insert({
        current_email: currentEmail,
        new_email: newEmail,
        reason,
      });

    if (error) {
      setStatus('Something went wrong. Please try again.');
      return;
    }

    await fetch(
      'https://slcgluybjdxsxqyuyjog.functions.supabase.co/send-form-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'email_change_request',
          current_email: currentEmail,
          new_email: newEmail,
          reason,
        }),
      }
    );

    setCurrentEmail('');
    setNewEmail('');
    setReason('');
    setStatus('Thank you. Your email change request has been sent.');
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10 text-center">
          <img
            src="/frame-icon.png"
            alt="Frame"
            className="mx-auto mb-6 h-24 w-24 rounded-3xl"
          />

          <h1 className="text-4xl font-bold">
            Change Email Address
          </h1>

          <p className="mt-3 text-zinc-400">
            Frame Account Support
          </p>
        </div>

        <p className="mb-4 text-center text-zinc-300">
          If you no longer have access to the email address connected
          to your Frame account, you can request an email change below.
        </p>

        <p className="mb-8 text-center text-zinc-300">
          For security, email address changes are reviewed manually.
        </p>

        <form
          onSubmit={submitRequest}
          className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
        >
          <label className="mb-2 block font-semibold">
            Current Frame Email Address
          </label>

          <input
            type="email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            required
            className="mb-4 w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3"
          />

          <label className="mb-2 block font-semibold">
            New Email Address
          </label>

          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="mb-4 w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3"
          />

          <label className="mb-2 block font-semibold">
            Reason For Request
          </label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
            className="mb-4 w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3"
          />

          <button
            type="submit"
            className="w-full rounded-full bg-white px-6 py-3 font-bold text-black"
          >
            Submit Request
          </button>

          {status && (
            <p className="mt-4 text-center text-zinc-400">
              {status}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}