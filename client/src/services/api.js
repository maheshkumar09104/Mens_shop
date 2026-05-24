import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://mens-shop-1.onrender.com";

const api = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/$/, "")}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("mensShopUser") || "null");

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;
