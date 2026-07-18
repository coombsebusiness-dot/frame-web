'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkingLink, setCheckingLink] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'PASSWORD_RECOVERY' && session) {
        setRecoveryReady(true);
        setCheckingLink(false);
        setMessage('');
      }
    });

    async function checkExistingSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session) {
        setRecoveryReady(true);
      }

      setCheckingLink(false);
    }

    checkExistingSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (password.length < 8) {
      setMessage('Your new password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('The passwords do not match.');
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    await supabase.auth.signOut();

    setSaving(false);
    setSuccess(true);
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-4xl font-extrabold tracking-tight">
            Frame
          </Link>

          <p className="mt-2 text-sm text-zinc-500">
            Share Your Vision
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-7 shadow-2xl">
          {checkingLink ? (
            <div className="py-10 text-center">
              <h1 className="text-2xl font-bold">
                Checking reset link
              </h1>

              <p className="mt-3 text-sm text-zinc-400">
                Please wait while Frame verifies your password reset link.
              </p>
            </div>
          ) : success ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-black">
                ✓
              </div>

              <h1 className="mt-5 text-2xl font-bold">
                Password updated
              </h1>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Your Frame password has been changed successfully. You can now
                sign in using your new password.
              </p>

              <Link
                href="/login"
                className="mt-7 block w-full rounded-full bg-white px-5 py-3 text-center font-bold text-black transition hover:bg-zinc-200"
              >
                Go to login
              </Link>
            </div>
          ) : recoveryReady ? (
            <>
              <div className="mb-7 text-center">
                <h1 className="text-3xl font-bold">
                  Create a new password
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Enter a new password for your Frame account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-zinc-300"
                  >
                    New password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-zinc-300"
                  >
                    Confirm new password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    placeholder="Enter it again"
                    className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
                  />
                </div>

                {message && (
                  <div
                    role="alert"
                    className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-full bg-white px-5 py-3 font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Updating password...' : 'Update password'}
                </button>
              </form>
            </>
          ) : (
            <div className="py-6 text-center">
              <h1 className="text-2xl font-bold">
                Reset link unavailable
              </h1>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                This password reset link is invalid, has expired, or has already
                been used. Return to Frame and request a new reset email.
              </p>

              <Link
                href="/login"
                className="mt-7 block w-full rounded-full border border-white/15 px-5 py-3 text-center font-semibold transition hover:bg-white hover:text-black"
              >
                Return to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}