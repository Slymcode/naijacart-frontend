import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { Menu, X, User, ShoppingBag, BarChart3 } from "lucide-react";

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xl font-semibold tracking-tight text-slate-900"
            >
              NaijaCart
            </a>
            <span className="hidden text-sm text-slate-500 md:inline">
              Modern affiliate commerce
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="/" className="transition hover:text-slate-900">
              Home
            </a>
            <a href="/products" className="transition hover:text-slate-900">
              Shop
            </a>
            <a
              href="/cart"
              className="relative transition hover:text-slate-900"
            >
              Cart
              {cartQuantity > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-2 text-xs font-semibold text-white">
                  {cartQuantity}
                </span>
              )}
            </a>
            {isAuthenticated && (
              <>
                <a href="/orders" className="transition hover:text-slate-900">
                  Orders
                </a>
                {user?.role === "AFFILIATE" && (
                  <a
                    href="/affiliate"
                    className="transition hover:text-slate-900"
                  >
                    Affiliate
                  </a>
                )}
                {user?.role === "ADMIN" && (
                  <a href="/admin" className="transition hover:text-slate-900">
                    Admin
                  </a>
                )}
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                  <User size={16} />
                  <span>{user?.firstName}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/profile")}
                >
                  Profile
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/signin")}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => (window.location.href = "/signup")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="space-y-2 px-4 py-4">
            <a
              href="/"
              className="block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/products"
              className="block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </a>
            <a
              href="/cart"
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                <ShoppingBag size={16} className="inline mr-2" />
                Cart
              </span>
              {cartQuantity > 0 && (
                <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-2 text-xs font-semibold text-white">
                  {cartQuantity}
                </span>
              )}
            </a>
            {isAuthenticated && (
              <>
                <a
                  href="/orders"
                  className="block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag size={16} className="inline mr-2" /> Orders
                </a>
                {user?.role === "AFFILIATE" && (
                  <a
                    href="/affiliate"
                    className="block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 size={16} className="inline mr-2" /> Affiliate
                  </a>
                )}
                {user?.role === "ADMIN" && (
                  <a
                    href="/admin"
                    className="block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 size={16} className="inline mr-2" /> Admin
                  </a>
                )}
                <a
                  href="/profile"
                  className="block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={16} className="inline mr-2" /> Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-700 transition hover:bg-slate-100"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="space-y-2 pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.location.href = "/signin";
                    setIsMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    window.location.href = "/signup";
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
