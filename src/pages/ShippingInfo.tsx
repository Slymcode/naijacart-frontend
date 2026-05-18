export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Shipping Information
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Learn how Sell Rush delivers your orders safely and quickly.
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Delivery Zones
            </h2>
            <p className="mt-3 text-slate-700">
              Sell Rush ships products across Nigeria, with fast local delivery
              options and trusted logistics partners. Delivery times vary by
              location and seller, so please check the estimated delivery
              details on your order page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Shipping Process
            </h2>
            <p className="mt-3 text-slate-700">
              Once your order is placed, sellers prepare the item for dispatch
              and hand it over to delivery partners. You will receive order
              status updates and tracking information when the package is on the
              way.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Shipping Fees
            </h2>
            <p className="mt-3 text-slate-700">
              Shipping fees depend on the product, seller location, and delivery
              service selected at checkout. Your order summary displays the
              exact shipping fee before payment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Failed Delivery
            </h2>
            <p className="mt-3 text-slate-700">
              If delivery fails, the courier will contact you and attempt a
              redelivery. For any shipping issues, contact support immediately
              with your order number.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
