import Navbar from '@/components/Navbar';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delete Account | Frame',
  description: 'How to delete your Frame account and associated data.',
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="mb-8 inline-block text-sm text-zinc-400 hover:text-white">
          ← Back to Frame
        </Link>

        <h1 className="text-4xl font-bold">Delete Your Frame Account</h1>

        <div className="mt-10 space-y-8 leading-7 text-zinc-300">
          <p>
            If you would like to permanently delete your Frame account and associated
            data, you can do this from your account settings inside Frame.
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Delete from the website
            </h2>
            <p>
              Log in to Frame, go to <strong>Settings</strong>, then use the
              <strong> Delete Account</strong> option in the Danger Zone.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Contact us
            </h2>
            <p>
              You can also request deletion by contacting:
            </p>
            <p className="mt-3">
              <a href="mailto:help@frameapp.uk" className="text-white underline">
                help@frameapp.uk
              </a>
            </p>
            <p className="mt-3">
              Subject: <strong>Delete Frame Account</strong>
            </p>
            <p>
              Please include the email address associated with your Frame account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              What will be deleted?
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Profile information</li>
              <li>Photos and stories</li>
              <li>Comments and likes</li>
              <li>Messages</li>
              <li>Account information</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Data Retention
            </h2>
            <p>
              Some information may be retained for a limited period where required
              for security, legal obligations, fraud prevention, or abuse
              investigations.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}