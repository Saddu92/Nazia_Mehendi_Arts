const configuredUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = (
  configuredUrl || "/api"
).replace(/\/$/, "");

export const apiUrl = (path = "") =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;