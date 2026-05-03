export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">로그인</p>
        <h1>이메일과 비밀번호로 로그인합니다.</h1>
        <p className="auth-copy">아직 실제 세션 처리는 연결 전입니다. 다음 단계에서 서버 인증을 붙입니다.</p>
        <form className="auth-form">
          <label>
            이메일
            <input type="email" placeholder="teacher@example.com" />
          </label>
          <label>
            비밀번호
            <input type="password" placeholder="비밀번호" />
          </label>
          <button type="button">로그인</button>
        </form>
        <a className="text-link" href="/signup">계정이 없다면 가입하기</a>
      </section>
    </main>
  );
}
