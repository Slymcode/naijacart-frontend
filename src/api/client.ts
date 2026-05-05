import axios, { type AxiosInstance } from "axios";

class APIClient {
  public client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem("authToken");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("authToken", token);
    this.client.defaults.headers.Authorization = `Bearer ${token}`;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("authToken");
    delete this.client.defaults.headers.Authorization;
  }

  // Auth endpoints
  async signUp(data: any) {
    return this.client.post("/auth/signup", data);
  }

  async signIn(data: any) {
    return this.client.post("/auth/signin", data);
  }

  // Products
  async getProducts(filters?: any) {
    return this.client.get("/products", { params: filters });
  }

  async getProductBySlug(slug: string) {
    return this.client.get(`/products/${slug}`);
  }

  async getFeaturedProducts() {
    return this.client.get("/products/featured");
  }

  async createProduct(data: any) {
    return this.client.post("/products", data);
  }

  // Cart
  async getCart() {
    return this.client.get("/cart");
  }

  async addToCart(data: any) {
    return this.client.post("/cart/items", data);
  }

  async updateCartItem(id: string, data: any) {
    return this.client.put(`/cart/items/${id}`, data);
  }

  async removeFromCart(id: string) {
    return this.client.delete(`/cart/items/${id}`);
  }

  // Orders
  async createOrder(data: any) {
    return this.client.post("/orders", data);
  }

  async getOrders() {
    return this.client.get("/orders");
  }

  async getOrder(id: string) {
    return this.client.get(`/orders/${id}`);
  }

  // Payment
  async initializePayment(data: any) {
    return this.client.post("/payment/initialize", data);
  }

  async verifyPayment(data: any) {
    return this.client.post("/payment/verify", data);
  }

  // Affiliate
  async registerAffiliate(data: any) {
    return this.client.post("/affiliate/register", data);
  }

  async getAffiliateProfile() {
    return this.client.get("/affiliate/profile");
  }

  async getAffiliateDashboard() {
    return this.client.get("/affiliate/dashboard");
  }

  async generateAffiliateLink(data: any) {
    return this.client.post("/affiliate/links/generate", data);
  }

  async createReview(data: any) {
    return this.client.post("/reviews", data);
  }

  async canReviewProduct(productId: string) {
    return this.client.get(`/reviews/can-review/${productId}`);
  }

  async getAdminWithdrawalRequests() {
    return this.client.get("/admin/withdrawals");
  }

  async approveWithdrawal(id: string) {
    return this.client.put(`/admin/withdrawals/${id}/approve`);
  }

  async rejectWithdrawal(id: string) {
    return this.client.put(`/admin/withdrawals/${id}/reject`);
  }

  async completeWithdrawal(id: string) {
    return this.client.put(`/admin/withdrawals/${id}/complete`);
  }

  async trackAffiliateLinkClick(code: string) {
    return this.client.get(`/affiliate/links/track/${code}`);
  }

  async requestWithdrawal(data: any) {
    return this.client.post("/affiliate/withdrawal/request", data);
  }

  async getAffiliateWithdrawalRequests() {
    return this.client.get("/affiliate/withdrawal/requests");
  }

  // User
  async getUserProfile() {
    return this.client.get("/users/profile");
  }

  async updateProfile(data: any) {
    return this.client.put("/users/profile", data);
  }

  async getUserAddresses() {
    return this.client.get("/users/addresses");
  }

  async addAddress(data: any) {
    return this.client.post("/users/addresses", data);
  }
}

export const apiClient = new APIClient();
