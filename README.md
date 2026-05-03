# blindschool

교직원 전용 익명 커뮤니티와 업무 소통 허브 MVP입니다.

## 제품 방향

blindschool은 한국 교직원을 대상으로 합니다. 학생과 학부모는 MVP 대상에서 제외합니다.

핵심 목표는 다음과 같습니다.

- 재직증명서 PDF 업로드 기반 교직원 인증
- 이메일 + 비밀번호 로그인
- SMS 기반 휴대전화 본인 확인
- 익명 커뮤니티와 실명/준실명 업무 기능 분리
- 카카오톡 단체방, 밴드 등에 흩어진 공지, 투표, 자료, 일정 기능 통합
- 웹 우선 구현, 이후 앱 확장을 고려한 API-first 구조

## MVP 범위

- 공개 홈
- 로그인/가입
- 가입 상태 및 재직 인증 확인
- 일반 교직원 홈
- 익명 커뮤니티
- 업무 허브
- 플랫폼 관리자 대시보드

## 문서

- [MVP next steps](docs/mvp_next_steps.md)
- [Implementation start](docs/implementation_start.md)
- [Auth and session plan](docs/auth_session_plan.md)
- [Test account](docs/test_account.md)
- [Initial DB migration](db/migrations/001_init_staff_community.sql)
