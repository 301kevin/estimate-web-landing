// src/pages/Home.tsx
import * as React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  const primaryPath = token ? "/admin" : "/login";

  return (
    <div style={{ display: "grid", gap: 20, gridTemplateColumns: "minmax(0, 2.1fr) minmax(0, 1.5fr)" }}>
      {/* 메인 히어로 카드 */}
      <section className="card">
        <div className="card-header">
          <h1 className="card-title" style={{ fontSize: 22 }}>
            소상공인을 위한 케이크 견적 관리자
          </h1>
          <p className="card-sub">
            커스텀 케이크 주문을 받을 때, 가격 계산과 옵션 관리를 한 번에 처리하는
            <br />
            작은 “견적 API + 관리자 콘솔”입니다.
          </p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>
            이 화면은 내부 운영자를 위한 대시보드 홈이에요. 보통 이런 흐름으로 사용합니다:
          </p>
          <ul style={{ fontSize: 13, color: "#e5e7eb", paddingLeft: 18, margin: 0 }}>
            <li> <strong>관리자 계정 로그인</strong> (여러 직원 계정 관리)</li>
            <li> 카페/케이크샵에 맞는 <strong>케이크 기본 가격</strong> 등록</li>
            <li> 사이즈·메시지·토핑 같은 <strong>옵션과 추가 금액</strong> 설정</li>
            <li> 고객 문의가 들어오면 <strong>견적 생성 화면에서 실시간 가격 산출</strong></li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          <Link to={primaryPath} className="btn btn-primary">
            {token ? "관리자 콘솔 열기" : "관리자 로그인 하러 가기"}
          </Link>
          <Link to="/admin/cakes" className="btn btn-ghost">
            케이크 관리 바로가기
          </Link>
          <Link to="/admin/estimates" className="btn btn-ghost">
            견적 계산 화면 보기
          </Link>
        </div>

        <div style={{ marginTop: 18, fontSize: 11, color: "#9ca3af" }}>
          <span className="chip" style={{ marginRight: 6 }}>
            Spring Boot · React · Vite · Neon · Render · Vercel
          </span>
        </div>
      </section>

      {/* 사이드 카드: 오늘의 작업 / 상태 */}
      <aside className="card card-compact">
        <div className="card-header">
          <h2 className="card-section-title">오늘 할 수 있는 작업</h2>
          <p className="card-section-sub">
            실제 카페 운영에서 자주 쓰는 흐름을 기준으로 빠르게 이동할 수 있어요.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link to="/admin" className="btn" style={{ justifyContent: "space-between" }}>
            <span>관리자 계정 관리</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>직원 계정 / 권한</span>
          </Link>

          <Link to="/admin/cakes" className="btn" style={{ justifyContent: "space-between" }}>
            <span>케이크 기본 상품 정리</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>이름 · 기본 가격</span>
          </Link>

          <Link to="/admin/cake-options" className="btn" style={{ justifyContent: "space-between" }}>
            <span>옵션·추가 금액 관리</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>사이즈 / 토핑 / 메시지</span>
          </Link>

          <Link to="/admin/estimates" className="btn" style={{ justifyContent: "space-between" }}>
            <span>견적 계산 연습</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>실시간 가격 계산</span>
          </Link>
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: "#9ca3af" }}>
          <p style={{ margin: 0 }}>
            이 프로젝트는 “케이크/디저트 가게 견적 자동화”를 위한
            <br />
            <strong>백엔드 + 관리자 프론트 통합 샘플</strong>입니다.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default Home;
