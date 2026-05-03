# 교직원 커뮤니티 MVP 다음 단계 산출물

이 문서는 이전 PRD의 후속 3가지 작업을 한 번에 진행하기 위한 실행 초안이다.

- 1) DB 스키마 SQL 초안
- 2) 인증 점수 계산 규칙표(가중치)
- 3) 관리자 검토 화면 와이어프레임

---

## 1) DB 스키마 SQL 초안 (PostgreSQL)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('user', 'school_admin', 'platform_admin', 'auditor');
CREATE TYPE verification_status AS ENUM ('submitted', 'auto_approved', 'pending_review', 'rejected', 'approved');
CREATE TYPE post_visibility AS ENUM ('anonymous', 'named');
CREATE TYPE report_status AS ENUM ('open', 'under_review', 'resolved', 'dismissed');

CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_code VARCHAR(32) UNIQUE,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id),
  role user_role NOT NULL DEFAULT 'user',
  real_name_enc TEXT NOT NULL,
  phone_enc TEXT NOT NULL,
  email VARCHAR(255),
  job_group VARCHAR(100),
  department VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE anonymous_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  anon_nickname VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE staff_verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_sha256 CHAR(64),
  file_mime VARCHAR(100),
  file_size_bytes BIGINT,
  ocr_raw JSONB,
  extracted_fields JSONB,
  score INT CHECK (score >= 0 AND score <= 100),
  status verification_status NOT NULL DEFAULT 'submitted',
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_verification_state (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  latest_request_id UUID REFERENCES staff_verification_requests(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id),
  name VARCHAR(120) NOT NULL,
  description TEXT,
  is_official BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id),
  author_user_id UUID NOT NULL REFERENCES users(id),
  visibility post_visibility NOT NULL DEFAULT 'anonymous',
  category VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_user_id UUID NOT NULL REFERENCES users(id),
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_user_id UUID NOT NULL REFERENCES users(id),
  target_type VARCHAR(30) NOT NULL,
  target_id UUID NOT NULL,
  reason_code VARCHAR(50) NOT NULL,
  reason_detail TEXT,
  status report_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 2) 인증 점수 계산 규칙표 (가중치)

판정 기준:
- 85점 이상: 자동 승인
- 60~84점: 수동 검토 큐
- 59점 이하: 자동 반려

### 가점

| 항목 | 점수 |
|---|---:|
| 입력 이름 = OCR 이름 일치 | +20 |
| 입력 학교명 = OCR 학교명 표준화 일치 | +20 |
| 재직 상태 키워드 검출 | +10 |
| 발급일 90일 이내 | +10 |
| 필수 필드 5개 이상 추출 성공 | +10 |
| 재직증명서 템플릿 매칭 | +10 |
| 직인/서명 영역 감지 | +10 |
| 문서번호/발급번호 추출 | +5 |
| OCR 평균 신뢰도 0.9 이상 | +5 |

### 감점

| 항목 | 점수 |
|---|---:|
| 발급일 91~180일 | -10 |
| 발급일 181일 초과 | -25 |
| 저해상도/흐림 | -10 |
| 편집/합성 의심 | -25 |
| 메타데이터 이상 패턴 | -10 |
| 이름 불일치 | -30 |
| 학교 불일치 | -30 |
| 승인계정과 동일 파일 해시 | -40 |

### 하드룰
- 성명/학교명 중 1개라도 미추출: 자동 승인 금지(최소 수동 검토)
- 악성 파일 또는 MIME 불일치: 즉시 반려
- 위변조 고위험 신호 2개 이상: 수동 검토 강제

---

## 3) 관리자 검토 화면 와이어프레임

### A. 인증 검토 큐

- 필터: 상태, 점수대, 학교, 접수일
- 정렬: 최신순/점수순/위험순
- 테이블 컬럼:
  - 요청ID
  - 이름
  - 학교
  - 점수
  - 상태
  - 접수시각
- 액션:
  - 상세 보기
  - 일괄 승인/일괄 반려(권한자)

### B. 인증 상세 화면

#### 좌측
- 원본 문서 뷰어(PDF/JPG)

#### 우측
- 입력값 vs OCR 추출값 비교
  - 이름
  - 학교명
  - 재직 상태
  - 발급일
  - 문서번호
- 위험 신호 카드
  - 편집 의심도
  - 화질
  - 해시 중복
- 하단 액션
  - 승인
  - 반려(사유 템플릿 + 커스텀 메모)

### C. 룰/임계치 설정 화면

- 자동승인 기준 점수
- 보류 기준 점수
- 발급일 유효 기준 일수
- 항목별 가중치 조정
- 최근 7일 성능 카드
  - 자동승인율
  - 수동검토율
  - 반려율
  - 수동검토 후 승인 전환율

---

## 부록: 상태 전이

- submitted → auto_approved | pending_review | rejected
- pending_review → approved | rejected
- approved/auto_approved 시 user_verification_state.is_verified = true
- rejected 시 재업로드 허용(일일 횟수 제한)
