import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/api/client";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await apiClient.getFeaturedProducts();
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="bg-background">
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Featured collection
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Best sellers this week
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/products")}
          >
            View all products
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-96 rounded-[28px] bg-white shadow-card p-6 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <motion.a
                key={product.id}
                href={`/products/${product.slug}`}
                className="group block"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                whileHover={{ y: -6 }}
              >
                <Card className="overflow-hidden border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <div className="relative overflow-hidden bg-slate-50">
                    <motion.img
                      src={product.images[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="h-60 w-full object-cover transition duration-700 ease-out"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent px-4 py-4 opacity-0 transition duration-500 group-hover:opacity-100">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
                        View details
                      </p>
                    </div>
                  </div>
                  <CardContent className="pt-5">
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                      {product.category}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900 truncate">
                      {product.name}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={14}
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
                      <span className="ml-auto text-xs uppercase tracking-[0.24em] text-slate-400">
                        {product.productMetrics?.averageRating?.toFixed(1) ||
                          "0.0"}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-2xl font-semibold text-slate-900">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition group-hover:border-blue-300 group-hover:text-blue-700">
                        View
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
