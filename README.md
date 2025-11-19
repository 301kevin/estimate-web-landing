# Estimate API / Web

소상공인(케이크·디저트샵 등)을 위한 **견적 자동화 API + 관리자 콘솔** 프로젝트입니다.  
관리자는 웹 콘솔에서 케이크·옵션·관리자 계정을 관리하고, 프론트는 Vercel, 백엔드는 Render/Neon 기반으로 동작합니다.

---

## 1. Tech Stack

- **Frontend**
  - Vite + React + TypeScript
  - React Router
  - Axios
  - 배포: Vercel (`www.estimate-api.shop`)

- **Backend**
  - Spring Boot
  - JPA / Spring Security / JWT
  - DB: PostgreSQL (Neon)
  - 배포: Render (`api.estimate-api.shop`)

---

## 2. 주요 기능

- **관리자 인증**
  - /api/auth/login (JWT 발급)
  - 관리자 전용 라우트 보호 (프론트에서 토큰 기반)

- **관리자 계정 관리 (Admin Console)**
  - 관리자 계정 목록 조회
  - 관리자 계정 생성 (아이디/비밀번호/권한)
  - 관리자 계정 삭제

- **케이크 관리**
  - 케이크 목록 조회 (id, name, price)
  - 케이크 추가 (이름 + 가격)
  - 케이크 삭제

> 추후 추가 예정:
> - 케이크 옵션(사이즈/토핑) 관리
> - 견적 생성/조회 화면
> - 소상공인별 브랜드 계정/권한 분리

---

## 3. 아키텍처 / 도메인 구조

- `www.estimate-api.shop` → Vercel에 배포된 React 앱
- `api.estimate-api.shop` → Render에 배포된 Spring Boot API
- DB: Neon PostgreSQL

트래픽 흐름:

1. 브라우저에서 React 앱 접속
2. 로그인 시 `POST https://api.estimate-api.shop/api/auth/login`
3. 응답으로 받은 JWT를 로컬스토리지에 저장 후,  
   이후 관리자 API 호출 시 `Authorization: Bearer <token>` 헤더를 사용
4. 백엔드에서 JWT 검증 후, 관리자 권한에 따라 API 허용/차단

---

## 4. 로컬 실행 방법 (개발환경)

### Backend

```bash
# estimate-api 디렉터리
./gradlew bootRun
