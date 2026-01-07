import axios from "axios";

// Base URL for the backend server (Retrieved from ENV, defaults to localhost:8080)
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Customized Axios instance with global configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor:
// Runs before every HTTP request. If a token exists in localStorage,
// it attaches it to the 'Authorization' header to ensure secure requests.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;