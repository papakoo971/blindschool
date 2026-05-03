# Auth and session plan

## 결정된 인증 정책

- 로그인 방식은 이메일 + 비밀번호입니다.
- 본인 확인은 SMS 인증까지 포함합니다.
- 재직증명서는 PDF만 허용합니다.
- 재직 인증 전 사용자는 가입 상태 확인 화면만 접근할 수 있습니다.
- 학교 단위 관리자 역할은 MVP에서 제외합니다.

## 사용자 권한

| 역할 | 설명 | 주요 접근 |
| --- | --- | --- |
| guest | 비로그인 방문자 | 공개 홈, 로그인, 가입 |
| pending_user | 가입 완료, SMS 또는 재직 인증 대기 | 인증 상태 확인 |
| staff | 재직 인증 완료 교직원 | 일반 홈, 익명 커뮤니티, 업무 허브 |
| platform_admin | 전체 운영자 | 관리자 대시보드, 인증 검토 |
| auditor | 제한적 감사 권한 | 감사 로그, 정책 위반 조회 |

## 필요한 환경 설정

### DATABASE_URL

PostgreSQL 데이터베이스 연결 문자열입니다.

```text
DATABASE_URL="postgresql://user:password@localhost:5432/blindschool"
```

처음에는 로컬 PostgreSQL로 시작하고, 배포 단계에서 Supabase, Neon, RDS 같은 관리형 PostgreSQL로 옮길 수 있습니다.

### AUTH_SECRET

세션 쿠키나 JWT 서명에 쓰는 비밀값입니다. GitHub에 커밋하면 안 됩니다.

```text
AUTH_SECRET="replace-with-random-secret"
```

### SMS provider

SMS 인증번호 발송을 위해 외부 발송사가 필요합니다. 한국 서비스라면 다음 후보를 비교하면 됩니다.

- Solapi: 국내 SMS 연동 자료가 많고 구현이 빠릅니다.
- Nurigo 계열: 국내 문자 발송에 익숙한 선택지입니다.
- AWS SNS: 인프라를 AWS로 갈 때 통합은 좋지만 국내 발송 정책 확인이 필요합니다.

MVP 추천은 Solapi입니다. 필요한 설정값은 발송사 확정 후 `.env`에 추가합니다.

```text
SMS_PROVIDER="solapi"
SMS_API_KEY="..."
SMS_API_SECRET="..."
SMS_SENDER_NUMBER="..."
```

### PDF storage

재직증명서 PDF는 DB에 직접 저장하지 않고 파일 저장소에 저장합니다. DB에는 URL, MIME, 파일 크기, SHA256만 저장합니다.

MVP 선택지는 두 가지입니다.

- 로컬 저장소: 개발이 빠르지만 배포/보안에 약합니다.
- S3 호환 스토리지: 배포 전환이 쉽고 접근 제어가 명확합니다.

MVP라도 실제 교직원 문서를 받기 시작한다면 S3 호환 스토리지를 권장합니다.

## 세션 흐름

1. 사용자가 이메일, 비밀번호, 휴대전화 번호로 가입합니다.
2. 서버가 비밀번호를 해시로 저장합니다.
3. 서버가 SMS 인증번호를 발송합니다.
4. 사용자가 인증번호를 입력하면 `phone_verified_at`을 기록합니다.
5. 사용자가 PDF 재직증명서를 업로드합니다.
6. OCR/점수 계산 결과에 따라 `pending_user` 또는 `staff` 상태로 분기합니다.
7. 인증 완료 전에는 `/verification` 외의 보호 라우트 접근을 막습니다.

## 라우트 접근 정책

| 경로 | guest | pending_user | staff | platform_admin |
| --- | --- | --- | --- | --- |
| `/` | 허용 | 허용 | 허용 | 허용 |
| `/login` | 허용 | 리다이렉트 | 리다이렉트 | 리다이렉트 |
| `/signup` | 허용 | 리다이렉트 | 리다이렉트 | 리다이렉트 |
| `/verification` | 로그인 필요 | 허용 | 상태 조회 | 허용 |
| `/home` | 로그인으로 이동 | 인증 상태로 이동 | 허용 | 허용 |
| `/community` | 로그인으로 이동 | 인증 상태로 이동 | 허용 | 허용 |
| `/workhub` | 로그인으로 이동 | 인증 상태로 이동 | 허용 | 허용 |
| `/admin` | 로그인으로 이동 | 홈으로 이동 | 홈으로 이동 | 허용 |

## 아직 결정이 필요한 것

- SMS 발송사
- PDF 저장소
- 비밀번호 재설정 이메일 발송 여부
- 관리자 최초 계정 생성 방식
