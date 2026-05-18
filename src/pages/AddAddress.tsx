import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, useForm } from "@/hooks";
import { apiClient } from "@/api/client";
import { Toast } from "@/components/Toast";

export default function AddAddress() {
  const navigate = useNavigate();
  const { isAuthenticated, hasCheckedAuth } = useAuth();
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const { values, handleChange, handleSubmit, isSubmitting, setValues } =
    useForm(
      {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        isDefault: false,
      },
      async () => {
        await apiClient.addAddress({
          street: values.street.trim(),
          city: values.city.trim(),
          state: values.state.trim(),
          country: values.country.trim(),
          zipCode: values.zipCode.trim() || undefined,
          isDefault: values.isDefault || false,
        });

        setToast({
          message: "Address added successfully.",
          variant: "success",
        });
        setTimeout(() => navigate("/profile"), 1200);
      },
    );

  useEffect(() => {
    if (!hasCheckedAuth) return;

    if (!isAuthenticated) {
      window.location.href =
        "/signin?redirect=" +
        encodeURIComponent(window.location.pathname + window.location.search);
    }
  }, [hasCheckedAuth, isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Add Address</h1>
            <p className="text-slate-600 mt-1">
              Save a delivery address for faster checkout.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/profile")}>
            Back to Profile
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Street Address
                </label>
                <Input
                  name="street"
                  value={values.street}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <Input
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    placeholder="Lagos"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State / Province
                  </label>
                  <Input
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                    placeholder="Lagos State"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country
                  </label>
                  <Input
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    placeholder="Nigeria"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ZIP / Postal Code
                  </label>
                  <Input
                    name="zipCode"
                    value={values.zipCode}
                    onChange={handleChange}
                    placeholder="100001"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="isDefault"
                  name="isDefault"
                  type="checkbox"
                  checked={Boolean((values as any).isDefault)}
                  onChange={(e) =>
                    setValues((prev: any) => ({
                      ...prev,
                      isDefault: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="text-sm text-slate-700">
                  Set as default address
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving address..." : "Save Address"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/profile")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
