import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, useFetch } from "@/hooks";
import { apiClient } from "@/api/client";
import type { Order, OrderItem } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Package, Truck, MapPin, DollarSign } from "lucide-react";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, hasCheckedAuth } = useAuth();
  const { data: order, isLoading } = useFetch<Order>(
    () => (id ? apiClient.getOrder(id) : Promise.reject()),
    { immediate: isAuthenticated && !!id },
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-slate-600">Checking authentication...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <Truck className="text-green-600" size={24} />;
      case "SHIPPED":
        return <Package className="text-blue-600" size={24} />;
      case "PROCESSING":
        return <Package className="text-yellow-600" size={24} />;
      default:
        return <Package className="text-gray-600" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {getStatusIcon(order.status)}
          <div>
            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-gray-600">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <span
          className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(
            order.status,
          )}`}
        >
          {order.status}
        </span>
      </div>

      {/* Order Items */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item: OrderItem) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center pb-4 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3 text-right">
                    <div>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.price)} each
                      </p>
                      <p className="font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                    {order.status === "DELIVERED" && item.product?.slug && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(
                            `/products/${item.product.slug}?review=true`,
                          );
                        }}
                      >
                        Review product
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No items in this order</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin size={20} />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-700">
            <p className="font-semibold">{order.shippingAddress}</p>
            <p>
              {order.shippingCity}, {order.shippingState}{" "}
              {order.shippingZipCode}
            </p>
            <p>{order.shippingCountry}</p>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign size={20} />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-semibold">
                {formatCurrency(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-semibold">{formatCurrency(order.tax)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          {order.paymentStatus === "PENDING" && (
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Complete Payment
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
