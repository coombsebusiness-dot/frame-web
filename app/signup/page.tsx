'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!acceptedTerms) {
      setError('You need to accept the Terms and Privacy Policy.');
      return;
    }

    setLoading(true);

    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      setLoading(false);
      setError(signupError.message);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        display_name: fullName,
      });
    }

    setLoading(false);
    setSuccess(true);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2 text-center">Create Account</h1>
        <p className="text-gray-400 mb-8 text-center">
          Join Frame and start sharing your creative work.
        </p>

        {success ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
            <h2 className="text-2xl font-bold mb-3">Check your email</h2>
            <p className="text-gray-300 mb-6">
              We&apos;ve sent you a verification link. Verify your email, then sign in.
            </p>

            <Link
              href="/login"
              className="inline-block rounded-xl bg-white text-black font-semibold px-6 py-3"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3"
            />

            <label className="flex items-center justify-center gap-3 text-sm text-gray-400 text-center">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="text-white font-semibold">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-white font-semibold">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading || !acceptedTerms}
              className="w-full rounded-xl bg-white text-black font-semibold py-3 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-white font-semibold">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}