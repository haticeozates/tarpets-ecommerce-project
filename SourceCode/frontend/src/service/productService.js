import api from "../api/axios";

// Fetch all products from the database
export const getAllProducts = async () => {
  const response = await api.get("/api/products");
  return response.data;
};

// Fetch a specific product by its ID
export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

// Fetch products based on a specific category
export const getProductsByCategory = async (category) => {
  const response = await api.get(`/api/products/category/${category}`);
  return response.data;
};

// Fetch discounted products (e.g. for the Home page slider)
export const getDiscountedProducts = async () => {
  const response = await api.get("/api/products/discounted");
  return response.data;
};