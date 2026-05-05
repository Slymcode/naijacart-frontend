import { ShoppingCart, Truck, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(76,29,149,0.35),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_30%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80 mb-4">
              Premium Watch Boutique
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Premium wristwatches with fast delivery and affiliate rewards.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
              Discover elegant timepieces, drive referrals, and earn commission
              with a polished, modern shopping experience.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="shadow-soft"
                onClick={() => (window.location.href = "/products")}
              >
                Shop Now
                <ArrowRight className="ml-2" size={18} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white bg-slate-900/90 border-white/20 hover:border-white hover:bg-white/10"
                onClick={() => (window.location.href = "/affiliate/register")}
              >
                Become Affiliate
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <Card className="bg-slate-800/95 border-slate-600 ring-1 ring-white/20 shadow-none">
              <CardContent className="pt-6">
                <ShoppingCart className="mb-4 text-sky-300" size={32} />
                <CardTitle className="text-slate-100">Easy Shopping</CardTitle>
                <p className="mt-2 text-sm text-slate-200">
                  Smooth checkout and trusted payment processing.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/95 border-slate-600 ring-1 ring-white/20 shadow-none">
              <CardContent className="pt-6">
                <Truck className="mb-4 text-sky-300" size={32} />
                <CardTitle className="text-slate-100">Fast Delivery</CardTitle>
                <p className="mt-2 text-sm text-slate-200">
                  Local shipping tailored for Nigerian customers.
                </p>
              </CardContent>
            </Card>
            <Card className="sm:col-span-2 bg-slate-800/95 border-slate-600 ring-1 ring-white/20 shadow-none">
              <CardContent className="pt-6">
                <Shield className="mb-4 text-sky-300" size={32} />
                <CardTitle className="text-slate-100">
                  Secure Payments
                </CardTitle>
                <p className="mt-2 text-sm text-slate-200">
                  Built-in payments and affiliate earnings powered by Paystack.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
