// src/App.tsx
import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminCakes from "./pages/AdminCakes";
import AdminCakeOptions from "./pages/AdminCakeOptions";
import AdminEstimates from "./pages/AdminEstimates";
import ProtectedRoute from "./components/ProtectedRoute";
import { setAuthToken } from "./api";

const App: React.FC = () => {
  // 새로고침했을 때도 axios에 Authorization 헤더 다시 심어주기
  React.useEffect(() => {
    const saved = localStorage.getItem("accessToken");
    if (saved) {
      setAuthToken(saved);
    }
  }, []);

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <header
        style={{
          padding: "12px 24px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <Link to="/" style={{ fontWeight: 600 }}>
          Estimate API
        </Link>
        <Link to="/login">관리자 로그인</Link>
        <Link to="/admin">관리자 계정</Link>
        <Link to="/admin/cakes">케이크</Link>
        <Link to="/admin/cake-options">케이크 옵션</Link>
        <Link to="/admin/estimates">견적 생성</Link>
      </header>

      <main style={{ minHeight: "calc(100vh - 56px)" }}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cakes"
            element={
              <ProtectedRoute>
                <AdminCakes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cake-options"
            element={
              <ProtectedRoute>
                <AdminCakeOptions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/estimates"
            element={
              <ProtectedRoute>
                <AdminEstimates />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
