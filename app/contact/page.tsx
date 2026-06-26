'use client';

import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    setStatus('');

    const { error } = await supabase.from('contact_requests').insert({
      name,
      email,
      subject,
      message,
    });

    if (error) {
      setStatus('Something went wrong. Please try again.');
      return;
    }

    await fetch('https://slcgluybjdxsxqyuyjog.functions.supabase.co/send-form-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contact_request',
        name,
        email,
        subject,
        message,
      }),
    });

    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setStatus('Thank you. Your message has been sent.');
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

          <h1 className="text-4xl font-bold">Contact Frame</h1>
          <p className="mt-3 text-zinc-400">Need help? We’re here.</p>
        </div>

        <p className="mb-4 text-center text-zinc-300">
          If you need help with your Frame account, beta access, login issues,
          email changes, safety concerns or anything else, send us a message below.
        </p>

        <p className="mb-8 text-center text-zinc-300">
          You can also email us directly at{' '}
          <a href="mailto:help@frameapp.uk" className="text-white underline">
            help@frameapp.uk
          </a>.
        </p>

        <form
          onSubmit={sendMessage}
          className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
        >
          <label className="mb-2 block text-sm font-semibold">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mb-4 w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 outline-none"
          />

          <label className="mb-2 block text-sm font-semibold">Your email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4 w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 outline-none"
          />

          <label className="mb-2 block text-sm font-semibold">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mb-4 w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 outline-none"
          />

          <label className="mb-2 block text-sm font-semibold">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            className="mb-4 w-full resize-none rounded-2xl border border-zinc-700 bg-black px-4 py-3 outline-none"
          />

          <button
            type="submit"
            className="w-full rounded-full bg-white px-6 py-3 font-bold text-black hover:bg-zinc-200"
          >
            Send Message
          </button>

          {status && (
            <p className="mt-4 text-center text-sm text-zinc-400">
              {status}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}