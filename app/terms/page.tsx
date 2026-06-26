import Navbar from '@/components/Navbar';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | Frame',
  description: 'Frame Terms of Use and Community Guidelines.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-zinc-400 hover:text-white"
        >
          ← Back to Frame
        </Link>

        <h1 className="text-4xl font-bold">
          Terms of Use and Community Guidelines
        </h1>

        <p className="mt-3 text-zinc-500">
          Last updated: June 2026
        </p>

        <div className="mt-10 space-y-8 leading-7 text-zinc-300">
          <p>
            Frame is a creative social platform for photographers,
            artists, designers and visual creatives to share their
            work, discover others and connect with the creative
            community.
          </p>

          <p>
            By creating an account or using Frame, you agree to these
            Terms of Use and Community Guidelines.
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              1. User Accounts
            </h2>

            <p>
              You must provide accurate information when creating an
              account. You are responsible for the content you upload
              and for activity on your account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              2. User-Generated Content
            </h2>

            <p>
              Frame allows users to upload and share photos, stories,
              comments, messages and profile content.
            </p>

            <p>
              You must only upload content that you own or have
              permission to share.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              3. Zero Tolerance Policy
            </h2>

            <ul className="list-disc space-y-2 pl-6">
              <li>Harassment or bullying</li>
              <li>Hate speech or discrimination</li>
              <li>Threats or intimidation</li>
              <li>Violence or encouragement of harm</li>
              <li>Child exploitation or abuse</li>
              <li>Sexually explicit exploitation</li>
              <li>Illegal content</li>
              <li>Terrorist or extremist content</li>
              <li>Spam, scams or impersonation</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              4. Reporting Content
            </h2>

            <p>
              Users can report objectionable content directly within
              Frame using the reporting features.
            </p>

            <p>
              We aim to review reports and take action within 24 hours
              where content or user behaviour violates these Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              5. Blocking Users
            </h2>

            <p>
              Users can block other users to prevent unwanted contact
              and interaction.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              6. Moderation and Enforcement
            </h2>

            <p>
              Frame may remove content, restrict features, suspend
              accounts or permanently delete accounts that violate
              these Terms or Community Guidelines.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              7. Account Deletion
            </h2>

            <p>
              Users can delete their account directly within the app
              or website using the built-in account deletion tools.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              8. Privacy
            </h2>

            <p>
              Please review our Privacy Policy for information about
              how we collect, use and store data.
            </p>

            <Link
              href="/privacy"
              className="text-white underline"
            >
              View Privacy Policy
            </Link>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              9. Contact
            </h2>

            <p>
              For support, reports, safety concerns or questions about
              these Terms, contact:
            </p>

            <p>
              <a
                href="mailto:help@frameapp.uk"
                className="text-white underline"
              >
                help@frameapp.uk
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}