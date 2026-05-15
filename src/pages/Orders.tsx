import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, useFetch } from "@/hooks";
import { apiClient } from "@/api/client";
import type { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ChevronRight,
  ShoppingBag,
  Package,
  Calendar,
  CreditCard,
} from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated, hasCheckedAuth } = useAuth();
  const { data: orders, isLoading } = useFetch<Order[]>(
    () => apiClient.getOrders(),
    { immediate: isAuthenticated },
  );

  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      window.location.href =
        "/signin?redirect=" +
        encodeURIComponent(window.location.pathname + window.location.search);
    }
  }, [hasCheckedAuth, isAuthenticated]);

  if (!hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-card text-center">
          <CardContent className="pt-8 pb-8">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-card text-center">
          <CardContent className="pt-8 pb-8">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <Card className="w-full max-w-md shadow-card text-center">
          <CardContent className="pt-12 pb-12">
            <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              No Orders Yet
            </h1>
            <p className="text-slate-600 mb-8">
              You haven't placed any orders yet. Start shopping now!
            </p>
            <Button onClick={() => (window.location.href = "/products")}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "SHIPPED":
        return "info";
      case "PROCESSING":
        return "warning";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PENDING":
        return "warning";
      case "FAILED":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Orders</h1>
          <p className="text-slate-600">Track and manage your order history</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="shadow-card hover:shadow-soft transition-all cursor-pointer group"
              onClick={() => (window.location.href = `/orders/${order.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge
                        variant={getPaymentStatusVariant(order.paymentStatus)}
                      >
                        <CreditCard className="w-3 h-3 mr-1" />
                        {order.paymentStatus}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-600">
                      {order.items?.length || 0} item(s) • Total:{" "}
                      {formatCurrency(order.total)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end lg:flex-col lg:items-end gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 group-hover:text-blue-600 transition-colors">
                      {order.status === "DELIVERED" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/orders/${order.id}`);
                          }}
                        >
                          Review items
                        </Button>
                      )}
                      <span className="text-sm font-medium">View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
