export default function Returns() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Refund & Return Policy
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Understand how refunds and returns work on Sell Rush.
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Refund & Return Policy
            </h2>
            <p className="mt-3 text-slate-700">
              Customers may request refunds or returns under the following
              conditions:
            </p>
            <ul className="mt-3 space-y-2 text-slate-700 list-disc list-inside">
              <li>Wrong item delivered</li>
              <li>Damaged product</li>
              <li>Incomplete order</li>
              <li>Product significantly different from description</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Return Window
            </h2>
            <p className="mt-3 text-slate-700">
              Returns must be initiated within 7 days of delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Non-Refundable Items
            </h2>
            <p className="mt-3 text-slate-700">
              Certain products may not qualify for refunds due to hygiene,
              digital delivery, or customized production.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Refund Processing
            </h2>
            <p className="mt-3 text-slate-700">
              Approved refunds may take 5–10 business days depending on the
              payment provider.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
