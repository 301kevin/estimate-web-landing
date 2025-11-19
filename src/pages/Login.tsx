// src/pages/Login.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../api";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (!username.trim() || !password) {
      setErr("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", {
        username: username.trim(),
        password,
      });

      const token = res.data.accessToken;
      if (!token) {
        setErr("토큰이 응답에 없습니다.");
        return;
      }

      // 토큰 + 관리자 아이디 저장
      setAuthToken(token);
      localStorage.setItem("adminUsername", username.trim());

      navigate("/admin", { replace: true });
    } catch (error: any) {
      console.error("login error:", error);
      const status = error.response?.status;
      if (status === 401) {
        setErr("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setErr("로그인에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 360,
        margin: "72px auto",
        padding: 24,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        fontFamily: "system-ui",
        background: "white",
      }}
    >
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>관리자 로그인</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <div>
          <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>
            아이디
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            style={{
              width: "100%",
              padding: 8,
              fontSize: 13,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              fontSize: 13,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        {err && (
          <p style={{ fontSize: 12, color: "crimson", marginTop: 4 }}>{err}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 4,
            padding: "8px 12px",
            fontSize: 14,
            borderRadius: 999,
            border: "none",
            background: "#4f46e5",
            color: "white",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
};

export default Login;
