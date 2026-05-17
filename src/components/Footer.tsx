import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/api/client";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      setSubscribed(false);
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      setSubscribed(false);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await apiClient.subscribeEmail({ email: trimmedEmail });
      setSubscribed(true);
      setEmail("");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to subscribe right now. Please try again later.",
      );
      setSubscribed(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-3xl font-bold text-white">NaijaCart</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              Discover premium fashion that speaks to your style. Quality
              craftsmanship, fast delivery, and reliable affiliate rewards.
            </p>
            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-300">
              <p className="font-semibold text-white">Secure Payment</p>
              <p className="mt-3">
                Pay with confidence using our secure checkout and trusted
                payment partners.
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Shop
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>
                <a href="/products" className="hover:text-white transition">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition">
                  Men&apos;s Collection
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition">
                  Women&apos;s Collection
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition">
                  Classics
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Support
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>
                <a href="/help" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/orders" className="hover:text-white transition">
                  Order Status
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Company
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>
                <a href="/about" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/affiliate" className="hover:text-white transition">
                  Affiliate
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-white transition">
                  Careers
                </a>
              </li>

              <li>
                <a href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Contact Us
            </p>
            <p className="mt-4 text-sm text-slate-300">
              Questions? Reach us at
              <a
                href="mailto:support@naijacart.com"
                className="text-slate-100 underline hover:text-white"
              >
                &nbsp;support@naijacart.com&nbsp;
              </a>
              or call <span className="font-semibold">+234 916 278 5798</span>.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Subscribe to our newsletter
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Stay updated on new arrivals, sales, and exclusive offers.
            </p>
            <form
              onSubmit={handleSubscribe}
              noValidate
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError(null);
                  if (subscribed) setSubscribed(false);
                }}
                className="min-w-0 flex-1 bg-slate-950 text-slate-100 placeholder:text-slate-500"
                required
              />
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={submitting}
              >
                {submitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            {error && (
              <p className="mt-3 text-sm text-rose-400" role="alert">
                {error}
              </p>
            )}
            {subscribed && !error && (
              <p className="mt-3 text-sm text-emerald-400" role="status">
                Thanks for subscribing! We’ll keep you updated.
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex sm:items-center sm:justify-between">
          <p>© 2026 NaijaCart. All rights reserved.</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <a href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </a>
            <span className="hidden sm:inline">•</span>
            <a href="/terms" className="hover:text-white transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
