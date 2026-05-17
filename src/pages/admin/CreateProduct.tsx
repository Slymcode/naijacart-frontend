import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/Toast";
import { useAuthStore } from "@/stores/auth";
import { apiClient } from "@/api/client";

export default function AdminCreateProduct() {
  const navigate = useNavigate();
  const { isAuthenticated, hasCheckedAuth, user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    cost: "",
    stock: "",
    category: "",
    comparePrice: "",
    commissionPercentage: "",
    images: "",
    tags: "",
    isFeatured: false,
  });

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleChange = (field: string, value: string | boolean) => {
    if (field === "name" && typeof value === "string") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (hasCheckedAuth && (!isAuthenticated || user?.role !== "ADMIN")) {
      navigate("/");
    }
  }, [hasCheckedAuth, isAuthenticated, user, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        cost: Number(formData.cost),
        stock: Number(formData.stock),
        category: formData.category.trim(),
        comparePrice: formData.comparePrice
          ? Number(formData.comparePrice)
          : undefined,
        commissionPercentage: formData.commissionPercentage
          ? Number(formData.commissionPercentage)
          : undefined,
        images: formData.images
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        tags: formData.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        isFeatured: formData.isFeatured,
      };

      await apiClient.createProduct(payload);
      const successMessage = "Product created successfully.";
      setMessage(successMessage);
      setToast({ message: successMessage, variant: "success" });
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: "",
        cost: "",
        stock: "",
        category: "",
        comparePrice: "",
        commissionPercentage: "",
        images: "",
        tags: "",
        isFeatured: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create product. Please check your input.";
      setMessage(errorMessage);
      setToast({ message: errorMessage, variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-slate-600">Checking admin access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Create Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  {message}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Purple Sneakers"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slug
                  </label>
                  <Input
                    required
                    value={formData.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="purple-sneakers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Write a short product description"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price
                  </label>
                  <Input
                    required
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="12000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cost
                  </label>
                  <Input
                    required
                    type="number"
                    min="0"
                    value={formData.cost}
                    onChange={(e) => handleChange("cost", e.target.value)}
                    placeholder="7000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Stock
                  </label>
                  <Input
                    required
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Commission Percentage
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.commissionPercentage}
                    onChange={(e) =>
                      handleChange("commissionPercentage", e.target.value)
                    }
                    placeholder="10"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Enter the affiliate commission percentage for this product.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <Input
                    required
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    placeholder="Footwear"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Compare Price
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.comparePrice}
                    onChange={(e) =>
                      handleChange("comparePrice", e.target.value)
                    }
                    placeholder="15000"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Image URLs
                  </label>
                  <Input
                    value={formData.images}
                    onChange={(e) => handleChange("images", e.target.value)}
                    placeholder="https://... , https://..."
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Separate multiple URLs with commas.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tags
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => handleChange("tags", e.target.value)}
                    placeholder="sneakers, casual"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Separate tags with commas.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="featured"
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange("isFeatured", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-sm text-slate-700">
                  Mark as featured product
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating product..." : "Create Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/admin")}
                >
                  Back to Dashboard
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
