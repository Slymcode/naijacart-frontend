export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "CUSTOMER" | "AFFILIATE";
  phone?: string;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  isDefault: boolean;
}

export interface ReviewUser {
  firstName: string;
  lastName: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  user: ReviewUser;
}

export interface ProductMetric {
  averageRating: number;
  reviewCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  cost: number;
  stock: number;
  category: string;
  images: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  productMetrics?: ProductMetric;
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  total: number;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount?: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingZipCode?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  name: string;
}

export interface Affiliate {
  id: string;
  code: string;
  totalEarnings: number;
  pendingEarnings: number;
  totalClicks: number;
  totalConversions: number;
}

export interface AffiliateLink {
  id: string;
  code: string;
  productId: string;
  clicks: number;
  conversions: number;
}

export interface WithdrawalRequest {
  id: string;
  affiliateId: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "COMPLETED" | "REJECTED" | "CANCELLED";
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  createdAt: string;
}
