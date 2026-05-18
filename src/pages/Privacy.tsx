export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Sell Rush is committed to protecting your personal information and
            using it responsibly.
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Information We Collect
            </h2>
            <ul className="mt-3 space-y-2 text-slate-700 list-disc list-inside">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Payment information</li>
              <li>Delivery address</li>
              <li>Device and browser information</li>
              <li>Affiliate activity and transaction records</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              How We Use Your Information
            </h2>
            <ul className="mt-3 space-y-2 text-slate-700 list-disc list-inside">
              <li>Create and manage your account</li>
              <li>Process transactions and commissions</li>
              <li>Improve platform performance</li>
              <li>Provide customer support</li>
              <li>Prevent fraud and unauthorized activity</li>
              <li>Send important notifications and updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Information Sharing
            </h2>
            <p className="mt-3 text-slate-700">
              We do not sell users’ personal information. However, we may share
              information with payment providers, delivery and logistics
              partners, legal authorities when required by law, and service
              providers that support our operations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Data Security
            </h2>
            <p className="mt-3 text-slate-700">
              We use appropriate technical and organizational measures to
              protect your data against unauthorized access, loss, or misuse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">Cookies</h2>
            <p className="mt-3 text-slate-700">
              Sell Rush may use cookies and tracking technologies to improve
              user experience and platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              User Rights
            </h2>
            <ul className="mt-3 space-y-2 text-slate-700 list-disc list-inside">
              <li>Access their personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of account information</li>
              <li>Opt out of promotional communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Changes to This Policy
            </h2>
            <p className="mt-3 text-slate-700">
              We may update this Privacy Policy periodically. Continued use of
              Sell Rush means acceptance of the updated policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
