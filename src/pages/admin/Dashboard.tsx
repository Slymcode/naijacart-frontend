import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { apiClient } from "@/api/client";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, hasCheckedAuth } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasCheckedAuth) return;

    if (!isAuthenticated || user?.role !== "ADMIN") {
      //window.location.href = "/";
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [statsResponse, ordersResponse, withdrawalsResponse] =
          await Promise.all([
            apiClient.client.get("/admin/dashboard"),
            apiClient.client.get("/admin/orders"),
            apiClient.getAdminWithdrawalRequests(),
          ]);

        setStats(statsResponse.data);
        setOrders(ordersResponse.data);
        setWithdrawals(withdrawalsResponse.data);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, hasCheckedAuth]);

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <div className="text-center py-12">Access Denied</div>;
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => navigate("/admin/create-product")}>
          Create Product
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold">
              {formatCurrency(stats?.totalRevenue || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Affiliates</p>
            <p className="text-2xl font-bold">{stats?.totalAffiliates || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Affiliate</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Requested</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((request: any) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">
                      {request.user?.firstName} {request.user?.lastName}
                    </td>
                    <td className="py-2 font-bold">
                      {formatCurrency(request.amount)}
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          request.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : request.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : request.status === "COMPLETED"
                                ? "bg-slate-100 text-slate-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="py-2">{formatDate(request.createdAt)}</td>
                    <td className="py-2 space-x-2">
                      {request.status === "PENDING" ? (
                        <>
                          <Button
                            size="sm"
                            onClick={async () => {
                              try {
                                await apiClient.approveWithdrawal(request.id);
                                const refreshed =
                                  await apiClient.getAdminWithdrawalRequests();
                                setWithdrawals(refreshed.data);
                              } catch (error) {
                                console.error(
                                  "Failed to approve withdrawal",
                                  error,
                                );
                              }
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={async () => {
                              try {
                                await apiClient.rejectWithdrawal(request.id);
                                const refreshed =
                                  await apiClient.getAdminWithdrawalRequests();
                                setWithdrawals(refreshed.data);
                              } catch (error) {
                                console.error(
                                  "Failed to reject withdrawal",
                                  error,
                                );
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      ) : request.status === "APPROVED" ? (
                        <Button
                          size="sm"
                          onClick={async () => {
                            try {
                              await apiClient.completeWithdrawal(request.id);
                              const refreshed =
                                await apiClient.getAdminWithdrawalRequests();
                              setWithdrawals(refreshed.data);
                            } catch (error) {
                              console.error(
                                "Failed to complete withdrawal",
                                error,
                              );
                            }
                          }}
                        >
                          Complete
                        </Button>
                      ) : (
                        <span className="text-sm text-slate-600">
                          No actions
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {withdrawals.length === 0 && (
            <p className="mt-4 text-sm text-slate-600">
              No withdrawal requests found.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Order #</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Total</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Payment</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{order.orderNumber}</td>
                    <td className="py-2">
                      {order.user.firstName} {order.user.lastName}
                    </td>
                    <td className="py-2 font-bold">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.paymentStatus === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-2">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
