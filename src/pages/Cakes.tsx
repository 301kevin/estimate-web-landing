import * as React from "react";
import { api } from "../api";

const Cakes: React.FC = () => {
  const [rows, setRows] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    api.get("/api/cakes").then(r => setRows(r.data));
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: "48px auto", fontFamily: "system-ui" }}>
      <h2>케이크 목록</h2>
      <pre>{rows ? JSON.stringify(rows, null, 2) : "불러오는 중..."}</pre>
      <a href="/login">관리자 로그인</a>
    </div>
  );
};
export default Cakes;
