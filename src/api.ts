// src/api.ts
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8080" // 로컬 백엔드
    : "https://api.estimate-api.shop"); // 배포 백엔드

export const api = axios.create({
  baseURL,
  withCredentials: false,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("accessToken", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("accessToken");
  }
};

// 🔐 401(권한 없음) 전역 처리: 토큰 날리고 로그인 화면으로 이동
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      setAuthToken(null);
      localStorage.removeItem("adminUsername");
      // SPA 라우터 무시하고 강제 리다이렉트
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
