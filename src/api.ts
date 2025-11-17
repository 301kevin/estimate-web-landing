import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

// 토큰 자동 첨부(있을 때)
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("accessToken");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
