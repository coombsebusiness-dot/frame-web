import Navbar from '@/components/Navbar';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Child Safety Standards | Frame',
  description: 'Frame Child Safety Standards and zero-tolerance policy.',
};

export default function ChildSafetyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="mb-8 inline-block text-sm text-zinc-400 hover:text-white">
          ← Back to Frame
        </Link>

        <h1 className="text-4xl font-bold">Frame Child Safety Standards</h1>
        <p className="mt-3 text-zinc-500">Last updated: 10 June 2026</p>

        <div className="mt-10 space-y-8 leading-7 text-zinc-300">
          <p>
            Frame is a creative community app for sharing photos, stories, messages
            and visual content. We are committed to helping maintain a safe
            environment for all users.
          </p>

          <p>
            Frame has a zero-tolerance policy toward child sexual abuse and
            exploitation, including child sexual abuse material, grooming,
            sexualisation of minors, or any behaviour that may endanger children.
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Prohibited Content and Behaviour
            </h2>

            <p>Frame does not allow:</p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Child sexual abuse material or exploitative content involving minors</li>
              <li>Grooming, coercion, solicitation or exploitation of minors</li>
              <li>Sexualised images, comments or messages involving minors</li>
              <li>Attempts to contact minors for exploitative or harmful purposes</li>
              <li>Sharing, requesting, promoting or distributing illegal child safety content</li>
              <li>Any content or behaviour that puts children at risk of harm</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Reporting</h2>
            <p>
              Users can report content, profiles or behaviour that they believe
              violates our safety standards using the in-app and website reporting
              tools.
            </p>
            <p className="mt-3">
              Reports relating to child safety are treated seriously and may result
              in immediate action.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Enforcement</h2>
            <p>
              Content or accounts that violate these standards may be removed,
              restricted or permanently banned from Frame.
            </p>
            <p className="mt-3">
              Where appropriate, Frame may preserve relevant information and
              cooperate with law enforcement, regulatory bodies or child safety
              organisations in accordance with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">User Responsibility</h2>
            <p>
              Users are responsible for ensuring that the content they upload and
              the messages they send comply with the law and with Frame&apos;s safety
              standards.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Contact</h2>
            <p>
              If you believe content or behaviour on Frame may involve child sexual
              abuse, exploitation or harm to a minor, please contact us immediately:
            </p>
            <p className="mt-3">
              Email:{' '}
              <a
                href="mailto:coombs.e.business@gmail.com"
                className="text-white underline"
              >
                coombs.e.business@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">Related Policies</h2>
            <Link href="/privacy" className="text-white underline">
              View Privacy Policy
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}