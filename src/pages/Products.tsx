import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/api/client";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", search: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.getProducts(filters);
        setProducts(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Browse the catalog
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Shop the latest products
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={() => setFilters({ category: "", search: "" })}
        >
          Clear filters
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px] mb-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Input
            placeholder="Search products"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <div className="sm:col-span-1 xl:col-span-2">
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Categories</option>
              <option value="wristwatches">Wristwatches</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-96 rounded-[32px] bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] p-6 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <motion.a
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.04,
                ease: "easeOut",
              }}
              whileHover={{ y: -4 }}
            >
              <Card className="shadow-none overflow-hidden border border-slate-200/70 bg-white/95 ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-soft hover:ring-blue-300 hover:ring-opacity-40 cursor-pointer">
                <div className="relative h-72 overflow-hidden bg-slate-50">
                  <motion.img
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 ease-out"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3">
                    <span className="rounded-full bg-slate-900/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white shadow-sm">
                      {product.category}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold ${product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                    >
                      {product.stock > 0 ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent px-4 py-4 opacity-0 transition duration-500 group-hover:opacity-100">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                      View product details
                    </p>
                  </div>
                </div>

                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                      {product.name}
                    </h3>
                    <p className="max-h-14 overflow-hidden text-sm leading-6 text-slate-600">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={16}
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
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700">
                        {product.productMetrics?.averageRating?.toFixed(1) ||
                          "0.0"}
                      </p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        {product.productMetrics?.reviewCount || 0} reviews
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="block text-2xl font-semibold text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-slate-500 line-through">
                          {formatCurrency(product.comparePrice)}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition group-hover:border-blue-300 group-hover:text-blue-700">
                      View product details
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
