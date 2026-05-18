import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import AffiliateRegister from "@/pages/affiliate/Register";
import AffiliateDashboard from "@/pages/affiliate/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminCreateProduct from "@/pages/admin/CreateProduct";
import AddAddress from "@/pages/AddAddress";
import About from "@/pages/About";
import AffiliateInfo from "@/pages/AffiliateInfo";
import HelpCenter from "@/pages/HelpCenter";
import Privacy from "@/pages/Privacy";
import Returns from "@/pages/Returns";
import ShippingInfo from "@/pages/ShippingInfo";
import Terms from "@/pages/Terms";
import "./App.css";
import PaymentCallback from "./pages/PaymentCallback";

function App() {
  function ReferralTracker() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const setAffiliateCode = useCartStore((state) => state.setAffiliateCode);

    useEffect(() => {
      const refCode = searchParams.get("ref");
      if (refCode) {
        setAffiliateCode(refCode);
      }
    }, [location.search, searchParams, setAffiliateCode]);

    return null;
  }

  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <ReferralTracker />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/affiliate/register" element={<AffiliateRegister />} />
            <Route path="/affiliate" element={<AffiliateInfo />} />
            <Route path="/affiliate/*" element={<AffiliateDashboard />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/shipping" element={<ShippingInfo />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/payment/callback" element={<PaymentCallback />} />
            <Route path="/profile/add-address" element={<AddAddress />} />
            <Route
              path="/admin/create-product"
              element={<AdminCreateProduct />}
            />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
