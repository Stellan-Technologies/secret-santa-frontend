import axios from "axios";

const base = import.meta.env.VITE_API_URL || "server/api";

const api = axios.create({
  baseURL: base.replace(/\/$/, ""), // strip trailing slash
  timeout: 15000,
  // withCredentials: true, // enable only if you use cookies/auth
});

export default api;
