import api from "../api/axios";

// Service to initialize the Stripe checkout session
export const createCheckoutSession = async (checkoutData) => {
  const response = await api.post("/api/create-checkout-session", checkoutData);
  return response.data;
};

// Service to create a new order record in the database
export const createOrder = async (orderData) => {
  const response = await api.post("/api/orders", orderData);
  return response.data;
};

// Service to fetch the order list based on user role
// Fetches all orders if Admin; otherwise, fetches only the user's specific orders
export const getOrders = async (user) => {
  let url = `/api/orders/user/${user.id}`;

  if (user.role === "ADMIN") {
    url = "/api/orders";
  }

  const response = await api.get(url);
  return response.data;
};