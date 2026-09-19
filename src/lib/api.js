const configuredUrl = import.meta.env.VITE_API_URL?.trim();
const defaultUrl = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://nazia-mehendi-arts-backend.onrender.com/api";

export const API_BASE_URL = (
  configuredUrl || defaultUrl
).replace(/\/$/, "");

export const apiUrl = (path = "") =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;