import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth";
import { apiClient } from "@/api/client";
import { Toast } from "@/components/Toast";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, hasCheckedAuth } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    if (!hasCheckedAuth) return;

    if (!isAuthenticated || user?.role !== "ADMIN") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [
          statsResponse,
          ordersResponse,
          withdrawalsResponse,
          productsResponse,
        ] = await Promise.all([
          apiClient.client.get("/admin/dashboard"),
          apiClient.client.get("/admin/orders"),
          apiClient.getAdminWithdrawalRequests(),
          apiClient.getOwnedProducts(),
        ]);

        setStats(statsResponse.data);
        setOrders(ordersResponse.data);
        setWithdrawals(withdrawalsResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, hasCheckedAuth, navigate]);

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      isFeatured: false,
      isActive: true,
    });
    setEditingProduct(null);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price || ""),
      stock: String(product.stock || ""),
      category: product.category || "",
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== false,
    });
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    try {
      const payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        category: productForm.category.trim(),
        isFeatured: productForm.isFeatured,
        isActive: productForm.isActive,
      };

      await apiClient.updateProduct(editingProduct.id, payload);
      const refreshed = await apiClient.getOwnedProducts();
      setProducts(refreshed.data);
      setToast({
        message: "Product updated successfully.",
        variant: "success",
      });
      resetProductForm();
    } catch (error: any) {
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to update product. Please try again.",
        variant: "error",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) {
      return;
    }

    try {
      await apiClient.deleteProduct(productId);
      const refreshed = await apiClient.getOwnedProducts();
      setProducts(refreshed.data);
      setToast({
        message: "Product deleted successfully.",
        variant: "success",
      });
    } catch (error: any) {
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to delete product. It may be in a cart or order.",
        variant: "error",
      });
    }
  };

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <div className="text-center py-12">Access Denied</div>;
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Product</th>
                  <th className="text-left py-2">Category</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Stock</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product: any) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{product.name}</td>
                      <td className="py-2">{product.category}</td>
                      <td className="py-2 font-bold">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="py-2">{product.stock}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-2 space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-slate-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Edit Product
                </h2>
                <p className="text-sm text-slate-500">
                  Update the product details and save your changes.
                </p>
              </div>
              <button
                type="button"
                onClick={resetProductForm}
                className="text-slate-500 transition hover:text-slate-900"
              >
                ×
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product Name
                </label>
                <Input
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Price
                  </label>
                  <Input
                    type="number"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Stock
                  </label>
                  <Input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        stock: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <Input
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={productForm.isActive}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Active
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={resetProductForm}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProduct}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <th className="text-left py-2">Bank</th>
                  <th className="text-left py-2">Account</th>
                  <th className="text-left py-2">Holder</th>
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
                    <td className="py-2">{request.bankName || "—"}</td>
                    <td className="py-2">{request.accountNumber || "—"}</td>
                    <td className="py-2">{request.accountHolder || "—"}</td>
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
                  <th className="text-left py-2 whitespace-nowrap">Order #</th>
                  <th className="text-left py-2 whitespace-nowrap">Customer</th>
                  <th className="text-left py-2 whitespace-nowrap">Shipping</th>
                  <th className="text-left py-2 whitespace-nowrap">Total</th>
                  <th className="text-left py-2 whitespace-nowrap">Status</th>
                  <th className="text-left py-2 whitespace-nowrap">Payment</th>
                  <th className="text-left py-2 whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 whitespace-nowrap">
                      {order.orderNumber}
                    </td>
                    <td className="py-2 whitespace-nowrap">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="py-2 max-w-xs truncate">
                      {order.shippingAddress}, {order.shippingCity}
                      {order.shippingState ? `, ${order.shippingState}` : ""}
                    </td>
                    <td className="py-2 whitespace-nowrap font-bold">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-2 whitespace-nowrap">
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
