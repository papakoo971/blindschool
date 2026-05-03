# 구현 시작 노트

다음 단계 구현을 시작하기 위해, 우선 데이터 계층의 기준점을 확정했습니다.

## 완료 사항
- `db/migrations/001_init_staff_community.sql` 생성
- 교직원 인증 파이프라인, 익명 프로필 분리, 게시글/댓글/신고 기본 테이블 반영
- 조회/운영에 필요한 핵심 인덱스 추가

## 다음 작업(권장 순서)
1. 인증 점수 계산 서비스 구현 (`verification_scoring` 모듈)
2. 인증 요청 상태 전이 API 구현 (`submitted -> auto_approved/pending/rejected`)
3. 관리자 검토 큐 API 구현 (필터/정렬)
