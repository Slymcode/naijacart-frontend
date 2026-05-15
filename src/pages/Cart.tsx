import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import { formatCurrency } from "@/lib/utils";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";

export default function Cart() {
  const { items, subtotal, fetchCart, removeItem, updateQuantity } =
    useCartStore();
  const { isAuthenticated, hasCheckedAuth } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  if (!hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="h-24 w-full max-w-md rounded-3xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <Card className="w-full max-w-md shadow-card text-center">
          <CardContent className="pt-8 pb-8">
            <ShoppingBag className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Sign in Required
            </h1>
            <p className="text-slate-600 mb-6">
              Please sign in to view your shopping cart
            </p>
            <Button
              onClick={() =>
                (window.location.href =
                  "/signin?redirect=" +
                  encodeURIComponent(
                    window.location.pathname + window.location.search,
                  ))
              }
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <Card className="w-full max-w-md shadow-card text-center">
          <CardContent className="pt-8 pb-8">
            <ShoppingBag className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Your Cart is Empty
            </h1>
            <p className="text-slate-600 mb-6">
              Add some products to get started
            </p>
            <Button
              onClick={() => (window.location.href = "/products")}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shippingFee = 3500;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-slate-600">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card
                key={item.id}
                className="shadow-card hover:shadow-soft transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.images[0] || "/placeholder.jpg"}
                        alt={item.product.name}
                        className="w-24 h-24 rounded-xl object-cover shadow-soft"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-slate-600 font-medium mb-3">
                        {formatCurrency(item.price)}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            className="h-8 w-8 p-0 hover:bg-slate-200"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Badge
                            variant="secondary"
                            className="min-w-[2rem] justify-center"
                          >
                            {item.quantity}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-8 w-8 p-0 hover:bg-slate-200"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-card sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-slate-900">
                    <span>Total</span>
                    <span className="text-blue-600">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full h-12 text-base mt-6"
                  onClick={() => (window.location.href = "/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
