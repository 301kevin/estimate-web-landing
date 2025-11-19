# estimate-web (Frontend)

`Estimate API` 프로젝트의 **프론트엔드** 레포지토리입니다.  
소상공인(케이크·디저트샵 등)을 위한 **견적 자동화 API + 관리자 콘솔** 중,  
React 기반 **웹 화면(랜딩 + 관리자 화면)** 을 담당합니다.

---

## 1. Tech Stack

- **Framework**: Vite + React + TypeScript
- **Routing**: React Router
- **HTTP 클라이언트**: Axios
- **State**: React Hooks (useState, useEffect 등)
- **Deployment**: Vercel  
  - 도메인: `https://www.estimate-api.shop`
- **연동 백엔드**: `https://api.estimate-api.shop` (Spring Boot / Render)

---

## 2. 주요 화면 / 기능

### 2-1. 랜딩 페이지 (`/`)

- 서비스 소개
- 향후:
  - 견적 API 설명
  - 사용 예시, 데모 링크
  - CTA 버튼(문의, 가입 등) 추가 예정

### 2-2. 관리자 로그인 (`/login`)

- 아이디 / 비밀번호 입력
- 성공 시:
  - 백엔드 `/api/auth/login`으로부터 **JWT accessToken** 발급
  - 로컬 스토리지에 토큰 + 관리자 아이디 저장
  - 관리자 콘솔로 이동(`/admin`)

### 2-3. 관리자 계정 관리 (`/admin`)

- 기능
  - 관리자 계정 목록 조회
  - 관리자 계정 생성
    - 아이디 (3~50자)
    - 비밀번호 (8~100자)
    - 역할(role, 기본값: `ADMIN`)
  - 관리자 계정 삭제
- 특징
  - JWT가 없거나 만료된 경우 → 로그인 페이지로 리다이렉트
  - 권한 없음(403) 시 에러 메시지 표시

### 2-4. 케이크 관리 (`/admin/cakes`)

- 기능
  - 케이크 목록 조회 (id, name, price)
  - 케이크 추가 (이름 + 가격)
  - 케이크 삭제
- 엔드포인트 (백엔드 기준)
  - `GET /api/cakes`
  - `POST /api/cakes`
  - `DELETE /api/cakes/{id}`

---

## 3. API 연동 구조

프론트에서는 `src/api.ts`에서 Axios 인스턴스를 한 번만 만들고,  
이 인스턴트를 통해 백엔드 API를 호출합니다.

```ts
// src/api.ts (요약)
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8080"              // 로컬 개발용
    : "https://api.estimate-api.shop");    // 배포용

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
