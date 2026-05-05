import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiClient } from "@/api/client";
import { useCartStore } from "@/stores/cart";

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const reference = params.get("reference");

    if (!reference) {
      navigate("/cart");
      return;
    }

    const verify = async () => {
      try {
        const res = await apiClient.verifyPayment({ reference });

        if (res.data.success) {
          // ✅ CONTINUE YOUR APP FLOW

          clearCart(); // clear cart

          navigate("/orders"); // or /order-success
        } else {
          navigate("/cart");
        }
      } catch (err) {
        console.error(err);
        navigate("/cart");
      }
    };

    verify();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="text-xl font-semibold">Verifying payment...</h2>
    </div>
  );
}
