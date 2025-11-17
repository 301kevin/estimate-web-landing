import * as React from "react";
import { api } from "../api";
import { saveToken } from "../auth";

const Login: React.FC = () => {
  const [username, setU] = React.useState("admin");
  const [password, setP] = React.useState("Strong!Passw0rd");
  const [msg, setMsg] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/auth/login", { username, password });
      saveToken(data.accessToken);
      setMsg("로그인 성공! /admin으로 이동합니다.");
      location.href = "/admin";
    } catch (e: any) {
      setMsg("로그인 실패. 자격 증명을 확인하세요.");
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "48px auto", fontFamily: "system-ui" }}>
      <h2>관리자 로그인</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Username</label><br/>
          <input value={username} onChange={e=>setU(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label><br/>
          <input type="password" value={password} onChange={e=>setP(e.target.value)} />
        </div>
        <button type="submit">로그인</button>
      </form>
      <p>{msg}</p>
    </div>
  );
};
export default Login;
