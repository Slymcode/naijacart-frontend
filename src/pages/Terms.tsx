export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Terms of Service
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            By using Sell Rush, you agree to these terms and conditions.
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              User Accounts
            </h2>
            <p className="mt-3 text-slate-700">
              Users must provide accurate information during registration and
              are responsible for maintaining the confidentiality of their
              accounts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Seller Responsibilities
            </h2>
            <ul className="mt-3 space-y-2 text-slate-700 list-disc list-inside">
              <li>Provide accurate product information</li>
              <li>Deliver products as described</li>
              <li>Avoid prohibited or illegal products</li>
              <li>Maintain ethical business practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Affiliate Responsibilities
            </h2>
            <ul className="mt-3 space-y-2 text-slate-700 list-disc list-inside">
              <li>Promote products honestly</li>
              <li>Avoid spam or misleading advertising</li>
              <li>Respect platform policies</li>
              <li>Avoid fake purchases or fraudulent referrals</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Commission Policy
            </h2>
            <p className="mt-3 text-slate-700">
              Affiliate commissions are paid only on verified and completed
              sales. Sell Rush reserves the right to reverse commissions linked
              to fraudulent or canceled transactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Prohibited Activities
            </h2>
            <ul className="mt-3 space-y-2 text-slate-700 list-disc list-inside">
              <li>Upload illegal products</li>
              <li>Engage in fraud or scams</li>
              <li>Violate intellectual property rights</li>
              <li>Manipulate commissions or sales data</li>
              <li>Use the platform for unlawful activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Account Suspension
            </h2>
            <p className="mt-3 text-slate-700">
              Sell Rush reserves the right to suspend or terminate accounts that
              violate platform policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Limitation of Liability
            </h2>
            <p className="mt-3 text-slate-700">
              Sell Rush is not liable for seller product disputes, delayed
              deliveries, user-generated content, or indirect or incidental
              damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Modifications
            </h2>
            <p className="mt-3 text-slate-700">
              We may update these Terms and Conditions at any time without prior
              notice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
