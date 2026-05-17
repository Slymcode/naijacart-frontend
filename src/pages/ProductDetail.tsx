import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import { apiClient } from "@/api/client";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Copy, Star } from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { isAuthenticated, user } = useAuthStore();
  const { addToCart, setAffiliateCode } = useCartStore();
  const [searchParams] = useSearchParams();
  const reviewSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const response = await apiClient.getProductBySlug(slug);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product?.images?.length) {
      setActiveImageIndex(0);
    }
  }, [product]);

  useEffect(() => {
    if (!product || !isAuthenticated) {
      setCanReview(false);
      return;
    }

    const fetchEligibility = async () => {
      try {
        const response = await apiClient.canReviewProduct(product.id);
        setCanReview(response.data.canReview);
      } catch (error) {
        setCanReview(false);
      }
    };

    fetchEligibility();
  }, [product, isAuthenticated]);

  useEffect(() => {
    const refCode = searchParams.get("ref");

    if (!refCode) {
      return;
    }

    setAffiliateCode(refCode);
    apiClient.trackAffiliateLinkClick(refCode).catch((error) => {
      console.warn("Failed to track affiliate click", error);
    });
  }, [searchParams, setAffiliateCode]);

  useEffect(() => {
    if (searchParams.get("review") === "true") {
      setTimeout(() => {
        reviewSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
  }, [searchParams, product]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, quantity);
      alert("Added to cart!");
    } catch (error) {
      alert("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, quantity);
      window.location.href = "/checkout";
    } catch (error) {
      alert("Failed to proceed to checkout");
    }
  };

  const handleGenerateAffiliateLink = async () => {
    if (!product || !isAuthenticated) {
      window.location.href =
        "/signin?redirect=" +
        encodeURIComponent(window.location.pathname + window.location.search);
      return;
    }

    try {
      const response = await apiClient.generateAffiliateLink({
        productId: product.id,
      });
      const link = `${window.location.origin}/products/${product.slug}?ref=${response.data.code}`;
      setAffiliateLink(link);
    } catch (error) {
      alert("Failed to generate affiliate link");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSubmitReview = async () => {
    if (!product) return;
    setReviewError(null);
    setReviewSubmitting(true);

    try {
      await apiClient.createReview({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
      const response = await apiClient.getProductBySlug(product.slug);
      setProduct(response.data);
    } catch (error) {
      console.error(error);
      setReviewError(
        "Unable to submit review. Only delivered orders can leave a review.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product)
    return <div className="text-center py-12">Product not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-x-hidden"
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] min-w-0">
        <Card className="overflow-hidden min-w-0">
          <motion.div
            className="relative overflow-hidden bg-slate-100"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <motion.img
              key={product.images[activeImageIndex] || "placeholder"}
              src={product.images[activeImageIndex] || "/placeholder.jpg"}
              alt={product.name}
              className="h-[420px] w-full object-cover"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </motion.div>
          <CardContent>
            {product.images.length > 1 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {product.images.slice(0, 4).map((image, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`overflow-hidden rounded-3xl border transition duration-200 ${
                      activeImageIndex === idx
                        ? "border-blue-600 ring-1 ring-blue-200"
                        : "border-slate-200"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.jpg"}
                      alt={`${product.name} ${idx}`}
                      className="h-24 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 min-w-0">
          <div className="space-y-3 rounded-[28px] border border-slate-200 bg-white p-8 shadow-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  {product.name}
                </h1>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  {product.category}
                </p>
              </div>
              <Badge variant={product.stock > 0 ? "success" : "danger"}>
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </Badge>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-semibold text-blue-600">
                  {formatCurrency(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-slate-500 line-through">
                    {formatCurrency(product.comparePrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-slate-600 leading-7">{product.description}</p>
          </div>

          <div className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-card">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="min-w-[48px] text-center text-lg font-semibold">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {product.stock > 0 ? (
              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2" size={20} />
                Add to Cart
              </Button>
            ) : (
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                Out of stock
              </div>
            )}
          </div>

          {isAuthenticated &&
            user?.role === "AFFILIATE" &&
            product.stock > 0 &&
            product.commissionPercentage !== undefined && (
              <Card className="rounded-[28px] border-sky-200 bg-sky-50 shadow-none">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Earn Commission
                      </p>
                      <p className="text-sm text-slate-600">
                        Share this product and earn
                        <span className="font-semibold text-slate-900 mx-1">
                          {product.commissionPercentage}%
                        </span>
                        commission on the product price.
                      </p>
                      <p className="text-sm text-slate-500">
                        Estimated payout per sale:
                        <span className="font-semibold text-slate-900 ml-1">
                          {formatCurrency(
                            product.price *
                              (product.commissionPercentage / 100),
                          )}
                        </span>
                      </p>
                      <p className="text-sm text-slate-500">
                        Commission is calculated from the product price only.
                      </p>
                    </div>

                    {!affiliateLink ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGenerateAffiliateLink}
                      >
                        Generate Affiliate Link
                      </Button>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                        <Input
                          type="text"
                          value={affiliateLink}
                          readOnly
                          className="rounded-2xl"
                        />
                        <Button
                          variant="secondary"
                          onClick={copyToClipboard}
                          className="gap-2"
                        >
                          <Copy size={16} />
                          {copySuccess ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          <div ref={reviewSectionRef}>
            <Card className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card">
              <CardContent>
                <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={18}
                          className={
                            index <
                            Math.round(
                              product.productMetrics?.averageRating || 0,
                            )
                              ? "text-yellow-400"
                              : "text-slate-300"
                          }
                        />
                      ))}
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {product.productMetrics?.averageRating?.toFixed(1) ||
                            "0.0"}
                        </p>
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                          {product.productMetrics?.reviewCount || 0} reviews
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      Reviews are available for customers with delivered orders.
                    </p>
                  </div>

                  {isAuthenticated ? (
                    canReview ? (
                      <div className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Leave a review
                          </p>
                          <p className="text-sm text-slate-500">
                            Only customers who purchased and received this
                            product can submit a review.
                          </p>
                        </div>
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
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Review title
                          </label>
                          <Input
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            placeholder="Short summary of your experience"
                            className="rounded-2xl"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Your review
                          </label>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={4}
                            className="w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="Tell others what you liked or what could be improved"
                          />
                        </div>
                        {reviewError && (
                          <p className="text-sm text-rose-600">{reviewError}</p>
                        )}
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={handleSubmitReview}
                          disabled={reviewSubmitting}
                        >
                          {reviewSubmitting ? "Submitting..." : "Submit Review"}
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                        <p className="font-semibold">
                          You can leave a review only after receiving this
                          product.
                        </p>
                        <p className="mt-2 text-slate-500">
                          Reviews are available only for purchased products that
                          are marked delivered.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      <p className="font-semibold">
                        Sign in to leave a review.
                      </p>
                      <p className="mt-2 text-slate-500">
                        Customers who received the product can share their
                        rating.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {review.title}
                              </p>
                              <p className="text-sm text-slate-500">
                                {review.user.firstName} {review.user.lastName}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={index}
                                  size={16}
                                  className={
                                    index < review.rating
                                      ? "text-yellow-400"
                                      : "text-slate-300"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="mt-3 text-sm leading-6 text-slate-700">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        No reviews yet. Be the first customer to review this
                        product.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
