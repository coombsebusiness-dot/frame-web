import Navbar from '@/components/Navbar';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EULA | Frame',
  description: 'End User License Agreement for Frame.',
};

export default function EulaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="mb-8 inline-block text-sm text-zinc-400 hover:text-white">
          ← Back to Frame
        </Link>

        <h1 className="text-4xl font-bold">End User License Agreement</h1>
        <p className="mt-3 text-zinc-500">Last updated: June 2026</p>

        <div className="mt-10 space-y-8 leading-7 text-zinc-300">
          <p>
            This End User License Agreement (&quot;Agreement&quot;) is a legal agreement
            between you and Frame governing your use of the Frame mobile application,
            website and related services.
          </p>

          {[
            ['1. License Grant', 'Frame grants you a limited, non-exclusive, non-transferable, revocable license to access and use the application for personal, non-commercial use in accordance with this Agreement.'],
            ['3. User Content', 'You are solely responsible for the content you upload, post or share through Frame. By uploading content, you confirm that you have the necessary rights to publish that content.'],
            ['4. Account Suspension and Termination', 'Frame reserves the right to suspend, restrict or permanently terminate accounts that violate this Agreement, the Terms of Use or Community Guidelines.'],
            ['5. Intellectual Property', 'All Frame branding, software, design elements and services remain the property of Frame and its licensors.'],
            ['6. Disclaimer', 'Frame is provided on an as available basis. We make no guarantees regarding uninterrupted service, availability or error-free operation.'],
            ['7. Limitation of Liability', 'To the maximum extent permitted by law, Frame shall not be liable for any indirect, incidental or consequential damages arising from use of the service.'],
            ['8. Changes to this Agreement', 'We may update this Agreement from time to time. Continued use of Frame constitutes acceptance of any revised version.'],
          ].map(([title, body]) => (
            <section key={title}>
              <h2 className="mb-3 text-2xl font-bold text-white">{title}</h2>
              <p>{body}</p>
            </section>
          ))}

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">2. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Use Frame for unlawful purposes.</li>
              <li>Attempt to gain unauthorized access to accounts or systems.</li>
              <li>Distribute malware, spam or harmful content.</li>
              <li>Harass, threaten or abuse other users.</li>
              <li>Upload content you do not own or have permission to share.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">9. Contact</h2>
            <p>For questions regarding this Agreement please contact:</p>
            <p className="mt-3">
              <a href="mailto:help@frameapp.uk" className="text-white underline">
                help@frameapp.uk
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}