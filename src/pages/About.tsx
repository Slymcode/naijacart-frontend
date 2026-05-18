export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">About Us</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Welcome to Sell Rush, the affiliate-powered e-commerce marketplace
            built to help sellers and affiliates earn faster.
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              What We Do
            </h2>
            <p className="mt-3 text-slate-700">
              Sell Rush is a modern affiliate-powered e-commerce marketplace
              designed to help individuals, retailers, vendors, and
              entrepreneurs sell products faster through community sharing and
              digital referrals.
            </p>
            <p className="mt-3 text-slate-700">
              Our platform connects sellers with affiliate marketers who promote
              products using personalized share links across social media
              platforms, messaging apps, and online communities. When a product
              is successfully sold through an affiliate link, the affiliate
              earns a commission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Our Mission
            </h2>
            <p className="mt-3 text-slate-700">
              To create the fastest and most rewarding social commerce platform
              where anyone can sell, promote, and earn online.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Our Vision
            </h2>
            <p className="mt-3 text-slate-700">
              To become Africa’s leading affiliate-driven marketplace that
              empowers millions of people to earn through digital commerce.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              What We Offer
            </h2>
            <ul className="mt-3 space-y-2 text-slate-700 list-disc list-inside">
              <li>Product listing for vendors and retailers</li>
              <li>Affiliate marketing opportunities</li>
              <li>Fast product sharing tools</li>
              <li>Secure order management</li>
              <li>Seller and affiliate dashboards</li>
              <li>Real-time sales tracking</li>
              <li>Commission-based earning system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              Why Choose Sell Rush
            </h2>
            <ul className="mt-3 space-y-2 text-slate-700 list-disc list-inside">
              <li>Easy to use</li>
              <li>Fast product promotion</li>
              <li>Opportunity to earn online</li>
              <li>Large affiliate network</li>
              <li>Mobile-friendly experience</li>
              <li>Secure and transparent transactions</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
