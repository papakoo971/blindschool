# Test account

테스트 DB에 seed로 넣을 기본 교직원 계정입니다.

```text
email: teacher.demo@blindschool.local
password: Test1234!
role: user
school: 대구데모고등학교
school level: 고등학교
region: 대구
verification: verified
```

## 실행 조건

`.env`에 실제 개발용 PostgreSQL 연결 문자열이 필요합니다.

```text
DATABASE_URL="postgresql://user:password@localhost:5432/blindschool"
```

스키마를 먼저 적용한 뒤 seed를 실행합니다.

```bash
npm.cmd run prisma:generate
npm.cmd run db:seed
```

현재 로그인 UI는 정적 화면입니다. 이 계정은 다음 단계에서 실제 로그인 API와 세션을 연결할 때 사용할 기준 데이터입니다.
