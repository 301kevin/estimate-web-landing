# Estimate API / Web

소상공인(케이크·디저트샵 등)을 위한 **견적 자동화 API + 관리자 콘솔** 프로젝트.

---

## 1. Tech Stack

- **Frontend**
  - Vite + React + TypeScript
  - React Router
  - Axios
  - Deploy: Vercel (`www.estimate-api.shop`)

- **Backend**
  - Spring Boot
  - Spring Security (JWT)
  - JPA
  - DB: PostgreSQL (Neon)
  - Deploy: Render (`api.estimate-api.shop`)

---

## 2. Features

- **인증 / 보안**
  - 관리자 로그인 (JWT)
  - 관리자 전용 라우트 보호

- **관리자 계정 관리**
  - 관리자 목록 조회
  - 관리자 생성 (아이디/비밀번호/역할)
  - 관리자 삭제

- **케이크 관리**
  - 케이크 목록 조회 (id, name, price)
  - 케이크 추가
  - 케이크 삭제

> TODO: 케이크 옵션, 견적 생성/조회, 멀티 상점 구조 등

---

## 3. Architecture

- Frontend: `www.estimate-api.shop` (Vercel)
- Backend: `api.estimate-api.shop` (Render)
- DB: Neon PostgreSQL

흐름:

1. 사용자는 프론트에 접속
2. 로그인 요청 → `POST /api/auth/login` (JWT 발급)
3. 이후 관리자 API 호출 시 `Authorization: Bearer <token>`

---

## 4. Local Development

### Backend

```bash
# estimate-api
./gradlew bootRun
# http://localhost:8080

5. Deploy

Vercel (Frontend)

브랜치: main

ENV:

VITE_API_BASE_URL=https://api.estimate-api.shop

Render (Backend)

ENV: DB URL, USER/PW, JWT_SECRET 등

Health Check / Flyway Migration 설정

6. Roadmap

 케이크 옵션(사이즈/토핑) 관리

 견적 생성/조회 화면

 소상공인별 계정/권한 분리

 실제 매장 파일럿 적용
