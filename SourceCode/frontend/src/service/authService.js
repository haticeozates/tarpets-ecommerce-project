import api from "../api/axios";

// Service to handle user login
export const loginUser = async (credentials) => {
  const response = await api.post("/api/login", credentials);
  return response.data;
};

// Service to handle new user registration
export const registerUser = async (userData) => {
  const response = await api.post("/api/register", userData);
  return response.data;
};