# Implementation start

## 목표

이 문서는 blindschool MVP 구현 시작점을 정리합니다. 모든 구현은 교직원 전용 인증, 익명성 분리, 업무 허브 통합이라는 제품 목표와 직접 연결되어야 합니다.

## 권장 초기 스택

MVP는 빠른 검증을 위해 단일 Next.js 앱으로 시작합니다.

- Web/API: Next.js App Router
- DB: PostgreSQL
- ORM: Prisma
- Auth: JWT + refresh token 또는 NextAuth 기반 세션
- File storage: S3 호환 스토리지
- Queue: Redis 기반 BullMQ 또는 managed queue
- OCR worker: 별도 worker process

규모가 커지면 API 서버를 NestJS 또는 Spring Boot로 분리합니다.

## 초기 구현 순서

1. DB 마이그레이션 적용
2. Prisma schema 작성
3. 회원가입과 로그인 구현
4. 재직증명서 업로드 API 구현
5. OCR/검증 요청 상태 모델 구현
6. 인증 점수 계산 모듈 구현
7. 운영자 인증 검토 큐 API 구현
8. 익명 프로필 생성과 게시판 구현
9. 신고/숨김/제재 기본 흐름 구현
10. 공지, 투표, 자료실, 일정 구현

## API 초안

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/me`

### Verification

- `POST /api/verification/certificate`
- `GET /api/verification/status`
- `POST /api/verification/resubmit`

### Admin verification

- `GET /api/admin/verifications`
- `GET /api/admin/verifications/:id`
- `POST /api/admin/verifications/:id/approve`
- `POST /api/admin/verifications/:id/reject`

### Community

- `GET /api/posts`
- `POST /api/posts`
- `GET /api/posts/:id`
- `POST /api/posts/:id/comments`
- `POST /api/posts/:id/reactions`
- `POST /api/reports`

### Work hub

- `GET /api/groups/:id/announcements`
- `POST /api/groups/:id/announcements`
- `GET /api/groups/:id/polls`
- `POST /api/groups/:id/polls`
- `POST /api/groups/:id/files`
- `GET /api/groups/:id/events`
- `POST /api/groups/:id/events`

## 인증 점수 모듈 책임

`calculateVerificationScore`는 다음 입력을 받습니다.

- 사용자가 입력한 이름
- 사용자가 입력한 학교명
- OCR 원문
- 추출 필드
- 파일 메타데이터
- 중복 해시 여부
- 위변조 위험 신호

반환값은 다음을 포함합니다.

- `score`
- `statusRecommendation`
- `positiveRules`
- `negativeRules`
- `hardRuleResults`
- `reviewReasons`

## OCR 워커 흐름

1. 업로드 완료 후 verification job 생성
2. worker가 파일을 내려받아 OCR 수행
3. 추출 필드를 정규화
4. 점수 계산 모듈 실행
5. `staff_verification_requests` 업데이트
6. 승인 시 `user_verification_state` 업데이트
7. 결과 알림 이벤트 발행
8. 실패 시 재시도, 최종 실패는 보류 처리

## 관리자 화면 우선순위

1. 보류 인증 목록
2. 인증 상세 비교 화면
3. 승인/반려 액션
4. 반려 사유 템플릿
5. 정책 점수 설정 화면
6. 최근 인증 처리 통계

## 익명성 구현 원칙

- `users`는 실명 계정입니다.
- `anonymous_profiles`는 커뮤니티 표시용 프로필입니다.
- 게시글 작성자는 서버 내부적으로 `author_user_id`를 갖지만 화면에는 익명 프로필만 표시합니다.
- 일반 운영자는 게시글 작성자의 실명 정보를 직접 조회할 수 없습니다.
- 감사 권한자는 정책에 따라 제한적으로 조회할 수 있고 모든 조회는 `audit_logs`에 남깁니다.

## 다음 작업 체크리스트

- [x] Next.js 프로젝트 생성
- [ ] PostgreSQL 연결 설정
- [x] Prisma schema 작성
- [ ] `001_init_staff_community.sql` 적용 방식 결정
- [x] 인증 점수 계산 단위 테스트 작성
- [ ] 파일 업로드 제한과 MIME 검사 구현
- [ ] 운영자 인증 검토 큐 구현
- [ ] 익명 게시판 CRUD 구현
