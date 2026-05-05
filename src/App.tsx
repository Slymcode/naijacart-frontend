import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { Header } from "@/components/Header";
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
import "./App.css";
import PaymentCallback from "./pages/PaymentCallback";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
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
            <Route path="/affiliate/*" element={<AffiliateDashboard />} />
            <Route path="/payment/callback" element={<PaymentCallback />} />
            <Route
              path="/admin/create-product"
              element={<AdminCreateProduct />}
            />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
