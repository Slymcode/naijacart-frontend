import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/useFetch";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import { apiClient } from "@/api/client";
import { formatCurrency } from "@/lib/utils";
import type { Address } from "@/types";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, fetchCart, isLoading, affiliateCode } = useCartStore();
  const { user, isAuthenticated, hasCheckedAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingCountry: "Nigeria",
    shippingZipCode: "",
  });

  const {
    data: addresses,
    isLoading: loadingAddresses,
    execute: loadAddresses,
  } = useFetch<Address[]>(() => apiClient.getUserAddresses(), {
    immediate: false,
  });

  const defaultAddress = addresses?.find((address) => address.isDefault);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    if (!hasCheckedAuth) return;
    if (isAuthenticated) {
      loadAddresses();
    }
  }, [isAuthenticated, hasCheckedAuth, loadAddresses]);

  useEffect(() => {
    if (!defaultAddress) return;
    if (
      !formData.shippingAddress &&
      !formData.shippingCity &&
      !formData.shippingState &&
      !formData.shippingZipCode
    ) {
      setFormData({
        shippingAddress: defaultAddress.street,
        shippingCity: defaultAddress.city,
        shippingState: defaultAddress.state,
        shippingCountry: defaultAddress.country,
        shippingZipCode: defaultAddress.zipCode || "",
      });
    }
  }, [defaultAddress]);

  const subtotal = items.reduce<number>(
    (sum: number, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = 3500;
  const tax = 0;
  const total = subtotal + shippingFee;

  if (!hasCheckedAuth || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {isLoading ? "Loading cart…" : "Checking authentication..."}
        </h1>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-slate-600 mb-6">
          Add items to your cart before checking out.
        </p>
        <Button onClick={() => (window.location.href = "/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Sign in to checkout</h1>
        <Button
          onClick={() =>
            (window.location.href =
              "/signin?redirect=" +
              encodeURIComponent(
                window.location.pathname + window.location.search,
              ))
          }
        >
          Sign In
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const orderPayload: any = {
        items: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        ...formData,
      };

      if (affiliateCode) {
        orderPayload.affiliateCode = affiliateCode;
      }

      const orderResponse = await apiClient.createOrder(orderPayload);
      const orderId = orderResponse.data.id;

      // Initialize payment
      const paymentResponse = await apiClient.initializePayment({
        orderId,
        email: user?.email || "",
        amount: total,
      });

      // Redirect to Paystack
      window.location.href = paymentResponse.data.authorizationUrl;
    } catch (error) {
      alert("Failed to process checkout");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Checkout</h1>
          <p className="text-slate-600">Complete your order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Saved shipping address
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Use your default address or add a new one for this order.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/add-address")}
                  size="sm"
                >
                  Add new address
                </Button>
              </div>

              {loadingAddresses ? (
                <p className="mt-4 text-sm text-slate-500">
                  Loading saved addresses...
                </p>
              ) : defaultAddress ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Default Address
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        This address will be used unless you enter a new one.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          shippingAddress: defaultAddress.street,
                          shippingCity: defaultAddress.city,
                          shippingState: defaultAddress.state,
                          shippingCountry: defaultAddress.country,
                          shippingZipCode: defaultAddress.zipCode || "",
                        })
                      }
                    >
                      Use default
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <p>{defaultAddress.street}</p>
                    <p>
                      {defaultAddress.city}, {defaultAddress.state}
                    </p>
                    <p>
                      {defaultAddress.country}
                      {defaultAddress.zipCode
                        ? ` • ${defaultAddress.zipCode}`
                        : ""}
                    </p>
                  </div>
                </div>
              ) : addresses && addresses.length > 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  You have saved addresses, but none is marked as default. Add a
                  default address to speed up checkout.
                </p>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No saved addresses yet. Add a new address to make checkout
                  faster.
                </p>
              )}
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Street Address
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your street address"
                      value={formData.shippingAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingAddress: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter city"
                        value={formData.shippingCity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingCity: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        State
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter state"
                        value={formData.shippingState}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingState: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ZIP Code
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter ZIP code (optional)"
                      value={formData.shippingZipCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingZipCode: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-card sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-slate-700 ml-2">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
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
                </div>
                {affiliateCode && (
                  <div className="rounded-2xl bg-sky-50 border border-sky-100 px-4 py-3 text-sm text-slate-700">
                    Affiliate referral applied: {affiliateCode}
                  </div>
                )}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-slate-900">
                    <span>Total</span>
                    <span className="text-blue-600">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
