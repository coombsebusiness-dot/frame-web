import Navbar from '@/components/Navbar';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Frame',
  description: 'Privacy Policy for Frame Creative Network.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="mb-8 inline-block text-sm text-zinc-400 hover:text-white">
          ← Back to Frame
        </Link>

        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-3 text-zinc-500">Last updated: 10 June 2026</p>

        <div className="mt-10 space-y-8 leading-7 text-zinc-300">
          <p>
            Frame is a creative community app that allows users to share photos,
            stories, messages and creative content with other users.
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Information We Collect</h2>
            <p>When you use Frame, we may collect the following information:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Email address used to create and access your account</li>
              <li>Profile information such as display name, username, bio and profile photo</li>
              <li>Photos, stories, captions, tags, comments and other content you upload</li>
              <li>Messages and story replies sent within the app</li>
              <li>Notification tokens used to send push notifications</li>
              <li>Basic account identifiers needed for app functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">How We Use Your Information</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Create and manage your account</li>
              <li>Display your profile, posts, stories and comments</li>
              <li>Enable messaging and story replies</li>
              <li>Send notifications for likes, comments, follows, stories and messages</li>
              <li>Improve app functionality and user experience</li>
              <li>Support safety, moderation, reporting and blocking features</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">User Generated Content</h2>
            <p>
              Frame allows users to upload and share their own content. You are responsible
              for ensuring that you own or have permission to share any content you upload.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Messaging</h2>
            <p>
              Frame includes private messaging features. Messages are stored so that users
              can send, receive and view conversations within the app.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Push Notifications</h2>
            <p>
              We may use push notification tokens to send alerts about app activity,
              including messages, likes, comments, follows and stories.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Sharing Your Information</h2>
            <p>
              We do not sell your personal information. Some information may be stored or
              processed using trusted service providers that help operate Frame, including
              hosting, authentication, storage and notification services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Content Moderation and Safety</h2>
            <p>
              Frame includes reporting and blocking features. Reported content may be
              reviewed and removed if it violates our rules, copyright requirements or
              safety standards.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Data Retention</h2>
            <p>
              We keep your information for as long as needed to provide the app’s services,
              maintain your account, comply with legal obligations, resolve disputes and
              protect the safety of users.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Deleting Your Data</h2>
            <p>
              If you would like to request deletion of your account or personal data,
              please contact us using the email below.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Children</h2>
            <p>
              Frame is not intended for children under 13. Users must be old enough to use
              social and messaging features in accordance with applicable laws and app
              store requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be
              posted on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Contact</h2>
            <p>
              Email:{' '}
              <a href="mailto:coombs.e.business@gmail.com" className="text-white underline">
                coombs.e.business@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}