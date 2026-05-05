import { useForm } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { apiClient } from "@/api/client";
import { useEffect } from "react";

export default function AffiliateRegister() {
  const { isAuthenticated, user, hasCheckedAuth } = useAuth();

  useEffect(() => {
    if (!hasCheckedAuth) return;

    if (!isAuthenticated) {
      window.location.href = "/signin";
      return;
    }

    if (user?.role === "AFFILIATE") {
      // window.location.href = "/affiliate";
      // return;
    }
  }, [isAuthenticated, user, hasCheckedAuth]);

  const {
    values,
    handleChange,
    errors,
    isSubmitting,
    handleSubmit,
    setValues,
  } = useForm(
    {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bankName: "",
      accountNumber: "",
      accountHolder: "",
    },
    async (formData) => {
      try {
        await apiClient.registerAffiliate(formData);
        window.location.href = "/affiliate";
      } catch (error) {
        throw error;
      }
    },
  );
  useEffect(() => {
    if (hasCheckedAuth && user) {
      setValues((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      }));
    }
  }, [hasCheckedAuth, user, setValues]);
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Become an Affiliate</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Why Become an Affiliate?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Earn 10% commission on every sale</li>
                <li>✓ Get unique affiliate links for tracking</li>
                <li>✓ Real-time dashboard to monitor earnings</li>
                <li>✓ Withdraw funds directly to your bank account</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                disabled
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                disabled
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={values.bankName}
                onChange={handleChange}
                placeholder="e.g., GTBank, Access Bank"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
              {errors.bankName && (
                <p className="text-red-600 text-sm mt-1">{errors.bankName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={values.accountNumber}
                onChange={handleChange}
                placeholder="Your bank account number"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
              {errors.accountNumber && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.accountNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Holder Name
              </label>
              <input
                type="text"
                name="accountHolder"
                value={values.accountHolder}
                onChange={handleChange}
                placeholder="Name on the bank account"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
              {errors.accountHolder && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.accountHolder}
                </p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Registering..." : "Become Affiliate"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => (window.location.href = "/profile")}
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-gray-600 text-center">
              By becoming an affiliate, you agree to our affiliate terms and
              conditions.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
