import { useState, useEffect, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { apiClient } from "@/api/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingUp, Users, DollarSign, Link as LinkIcon } from "lucide-react";
import { WithdrawalRequest } from "@/types";

export default function AffiliateDashboard() {
  const { isAuthenticated, user, hasCheckedAuth } = useAuthStore();
  const [dashboard, setDashboard] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);

  useEffect(() => {
    if (!hasCheckedAuth) return;

    if (!isAuthenticated) {
      window.location.href = "/signin";
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await apiClient.getAffiliateDashboard();
        setDashboard(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      }
    };

    const fetchWithdrawals = async () => {
      try {
        const response = await apiClient.getAffiliateWithdrawalRequests();
        setWithdrawals(response.data);
      } catch (error) {
        console.error("Failed to fetch withdrawal requests", error);
      }
    };

    const loadData = async () => {
      try {
        await Promise.all([fetchDashboard(), fetchWithdrawals()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, hasCheckedAuth]);

  if (!isAuthenticated) return null;

  const handleWithdrawalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRequestMessage(null);
    setRequestLoading(true);

    try {
      const amount = parseFloat(withdrawForm.amount);
      if (Number.isNaN(amount) || amount <= 0) {
        throw new Error("Enter a valid withdrawal amount");
      }

      await apiClient.requestWithdrawal({
        amount,
        bankName: withdrawForm.bankName,
        accountNumber: withdrawForm.accountNumber,
        accountHolder: withdrawForm.accountHolder,
      });

      setRequestMessage("Withdrawal request submitted successfully.");
      setWithdrawForm({
        amount: "",
        bankName: "",
        accountNumber: "",
        accountHolder: "",
      });
      const [dashboardResponse, withdrawalsResponse] = await Promise.all([
        apiClient.getAffiliateDashboard(),
        apiClient.getAffiliateWithdrawalRequests(),
      ]);
      setDashboard(dashboardResponse.data);
      setWithdrawals(withdrawalsResponse.data);
    } catch (error) {
      setRequestMessage("Failed to submit withdrawal request.");
      console.error(error);
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="mb-4">You are not registered as an affiliate yet.</p>
            <Button
              onClick={() => (window.location.href = "/affiliate/register")}
            >
              Register as Affiliate
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Affiliate Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold">
                  {dashboard.stats.totalClicks}
                </p>
              </div>
              <LinkIcon className="text-blue-600" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversions</p>
                <p className="text-2xl font-bold">
                  {dashboard.stats.totalConversions}
                </p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(dashboard.stats.totalEarnings)}
                </p>
              </div>
              <DollarSign className="text-green-600" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available to Withdraw</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(dashboard.stats.availableEarnings)}
                </p>
              </div>
              <Users className="text-yellow-600" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Withdraw Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Request a payout from approved affiliate earnings. Your request
              will be reviewed by an admin.
            </p>
            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={withdrawForm.amount}
                    onChange={(e) =>
                      setWithdrawForm({
                        ...withdrawForm,
                        amount: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={withdrawForm.bankName}
                    onChange={(e) =>
                      setWithdrawForm({
                        ...withdrawForm,
                        bankName: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3"
                    placeholder="Your bank"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={withdrawForm.accountNumber}
                    onChange={(e) =>
                      setWithdrawForm({
                        ...withdrawForm,
                        accountNumber: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3"
                    placeholder="Account number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Account Holder
                  </label>
                  <input
                    type="text"
                    value={withdrawForm.accountHolder}
                    onChange={(e) =>
                      setWithdrawForm({
                        ...withdrawForm,
                        accountHolder: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3"
                    placeholder="Account holder name"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={requestLoading}>
                  {requestLoading ? "Submitting..." : "Request Payout"}
                </Button>
                <p className="text-sm text-slate-500">
                  Available: {formatCurrency(dashboard.stats.availableEarnings)}
                </p>
              </div>
            </form>
            {requestMessage && (
              <p className="mt-4 text-sm text-slate-700">{requestMessage}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawals.length > 0 ? (
              <div className="space-y-3">
                {withdrawals.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {formatCurrency(request.amount)}
                        </p>
                        <p className="text-sm text-slate-600">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {request.bankName} · {request.accountNumber} ·{" "}
                      {request.accountHolder}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No withdrawal requests yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Affiliate Links */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Affiliate Links</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboard.links && dashboard.links.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Product</th>
                    <th className="text-left py-2">Clicks</th>
                    <th className="text-left py-2">Conversions</th>
                    <th className="text-left py-2">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.links.map((link: any) => (
                    <tr key={link.id} className="border-b">
                      <td className="py-2">{link.product.name}</td>
                      <td className="py-2">{link.clicks}</td>
                      <td className="py-2">{link.conversions}</td>
                      <td className="py-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {link.code}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">
              No affiliate links yet. Generate one from a product page.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboard.recentReferrals && dashboard.recentReferrals.length > 0 ? (
            <div className="space-y-4">
              {dashboard.recentReferrals.map((referral: any) => (
                <div
                  key={referral.id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <p className="font-semibold">
                      Order #{referral.order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(referral.createdAt)}
                    </p>
                  </div>
                  <p className="font-bold text-blue-600">
                    {formatCurrency(referral.order.total)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No referrals yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
