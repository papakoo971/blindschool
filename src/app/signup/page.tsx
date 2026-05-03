export default function SignupPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel wide">
        <p className="eyebrow">가입</p>
        <h1>교직원 인증을 위한 기본 정보를 입력합니다.</h1>
        <p className="auth-copy">가입 후 SMS 인증과 PDF 재직증명서 업로드가 이어집니다.</p>
        <form className="auth-form two-column">
          <label>
            이름
            <input placeholder="홍길동" />
          </label>
          <label>
            이메일
            <input type="email" placeholder="teacher@example.com" />
          </label>
          <label>
            비밀번호
            <input type="password" placeholder="8자 이상" />
          </label>
          <label>
            휴대전화
            <input placeholder="01012345678" />
          </label>
          <label>
            학교급
            <select defaultValue="elementary">
              <option value="elementary">초등학교</option>
              <option value="middle">중학교</option>
              <option value="high">고등학교</option>
            </select>
          </label>
          <label>
            지역
            <select defaultValue="daegu">
              <option value="daegu">대구</option>
              <option value="gyeongbuk">경북</option>
              <option value="seoul">서울</option>
              <option value="busan">부산</option>
            </select>
          </label>
          <button type="button">가입 후 SMS 인증</button>
        </form>
      </section>
    </main>
  );
}
