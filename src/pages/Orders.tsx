import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, useFetch } from "@/hooks";
import { apiClient } from "@/api/client";
import type { Order, OrderItem, Review } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ChevronRight,
  ShoppingBag,
  Package,
  Calendar,
  CreditCard,
  Star,
} from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated, hasCheckedAuth } = useAuth();
  const { data: orders, isLoading } = useFetch<Order[]>(
    () => apiClient.getOrders(),
    { immediate: isAuthenticated },
  );
  const { data: userReviews, reload: reloadUserReviews } = useFetch<Review[]>(
    () => apiClient.getUserReviews(),
    {
      immediate: isAuthenticated,
    },
  );
  const [reviewModalOrder, setReviewModalOrder] = useState<Order | null>(null);
  const [reviewItemId, setReviewItemId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      window.location.href =
        "/signin?redirect=" +
        encodeURIComponent(window.location.pathname + window.location.search);
    }
  }, [hasCheckedAuth, isAuthenticated]);

  const orderReviewMap = useMemo(
    () =>
      new Map(userReviews?.map((review) => [review.productId, review]) ?? []),
    [userReviews],
  );

  const getExistingReviewForOrder = (order: Order) => {
    return (
      order.items
        .map((item) => orderReviewMap.get(item.productId))
        .find((review): review is Review => Boolean(review)) ?? null
    );
  };

  const openReviewModal = (order: Order) => {
    const existingReview = getExistingReviewForOrder(order);
    const selectedItemId = existingReview
      ? (order.items.find((item) => item.productId === existingReview.productId)
          ?.id ??
        order.items?.[0]?.id ??
        null)
      : (order.items?.[0]?.id ?? null);

    setReviewModalOrder(order);
    setReviewItemId(selectedItemId);
    setReviewRating(existingReview?.rating ?? 5);
    setReviewTitle(existingReview?.title ?? "");
    setReviewComment(existingReview?.comment ?? "");
    setReviewError(null);
    setReviewSuccess(false);
    setEditingReviewId(existingReview?.id ?? null);
  };

  const closeReviewModal = () => {
    setReviewModalOrder(null);
    setReviewItemId(null);
    setReviewRating(5);
    setReviewTitle("");
    setReviewComment("");
    setReviewError(null);
    setReviewSuccess(false);
    setEditingReviewId(null);
  };

  const handleSubmitOrderReview = async () => {
    if (!reviewModalOrder || !reviewItemId) return;

    if (!reviewTitle.trim()) {
      setReviewError("Please enter a review title.");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError("Please enter your review details.");
      return;
    }

    const item = reviewModalOrder.items.find(
      (orderItem) => orderItem.id === reviewItemId,
    );

    if (!item) {
      setReviewError("Please choose an item to review.");
      return;
    }

    setReviewSubmitting(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      if (editingReviewId) {
        await apiClient.updateReview(editingReviewId, {
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        });
      } else {
        await apiClient.createReview({
          productId: item.productId,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        });
      }
      await reloadUserReviews();
      setReviewSuccess(true);
      closeReviewModal();
    } catch (error: any) {
      setReviewError(
        error?.response?.data?.message ||
          "Unable to submit review. Please try again.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const selectedReviewItem = reviewModalOrder?.items.find(
    (item) => item.id === reviewItemId,
  );

  const orderHasReview = (order: Order) =>
    order.items.some((item) => orderReviewMap.has(item.productId));

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
              <CardContent className="px-6 pt-6 pb-6">
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
                      {order.paymentStatus === "COMPLETED" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            openReviewModal(order);
                          }}
                        >
                          {orderHasReview(order)
                            ? "View comment"
                            : "Leave a review"}
                        </Button>
                      )}
                      {order.status === "DELIVERED" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/orders/${order.id}`);
                          }}
                        >
                          View details
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
      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {editingReviewId ? "Edit review" : "Leave a review"}
                </h2>
                <p className="text-sm text-slate-500">
                  Order #{reviewModalOrder.orderNumber} •{" "}
                  {reviewModalOrder.items.length} item(s)
                </p>
                {editingReviewId && (
                  <p className="mt-2 text-sm text-slate-500">
                    You already submitted a review for this order. Update it
                    below.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeReviewModal}
                className="text-slate-500 transition hover:text-slate-900"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product
                </label>
                {editingReviewId && selectedReviewItem ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                    {selectedReviewItem.name}
                  </div>
                ) : (
                  <select
                    value={reviewItemId ?? ""}
                    onChange={(event) => setReviewItemId(event.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    {reviewModalOrder.items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                )}
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Rating
                </p>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setReviewRating(index + 1)}
                      className="rounded-full p-1 transition hover:bg-slate-200"
                    >
                      <Star
                        size={24}
                        className={
                          index < reviewRating
                            ? "text-yellow-400"
                            : "text-slate-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Review title
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(event) => setReviewTitle(event.target.value)}
                  placeholder="Short summary of your experience"
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Review comment
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Tell others what you liked or what could be improved"
                />
              </div>

              {reviewError && (
                <p className="text-sm text-rose-600">{reviewError}</p>
              )}
              {reviewSuccess && (
                <p className="text-sm text-emerald-600">
                  Review submitted successfully.
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="secondary" onClick={closeReviewModal}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitOrderReview}
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting
                    ? editingReviewId
                      ? "Updating..."
                      : "Submitting..."
                    : editingReviewId
                      ? "Update Review"
                      : "Submit Review"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
