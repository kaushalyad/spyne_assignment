import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Adjust as per your server

const api = axios.create({
  baseURL: API_URL,
});

// Set auth token in header if user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
