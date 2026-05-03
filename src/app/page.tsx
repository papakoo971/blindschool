const publicFeatures = [
  {
    title: "교직원만 입장",
    body: "이메일 가입, SMS 본인 확인, 재직증명서 PDF 인증을 모두 거친 뒤 커뮤니티에 접근합니다.",
  },
  {
    title: "익명과 실무 분리",
    body: "학교 문화와 고충은 익명으로, 공지와 자료 공유는 업무 허브에서 정리합니다.",
  },
  {
    title: "학교급과 지역 표시",
    body: "초등학교, 중학교, 고등학교 구분과 경북, 대구 같은 시도 정보를 게시글에 함께 표시합니다.",
  },
];

const learningSteps = [
  "가입 후 SMS 인증으로 휴대전화 소유를 확인합니다.",
  "PDF 재직증명서를 업로드하면 OCR 점수와 운영자 검토로 인증 상태가 결정됩니다.",
  "인증 전에는 가입 상태 확인만 가능하고, 인증 완료 후 일반 홈으로 이동합니다.",
  "커뮤니티 글에는 학교급과 지역이 표시되어 맥락을 빠르게 파악할 수 있습니다.",
];

export default function PublicHome() {
  return (
    <main className="public-page">
      <section className="public-hero">
        <div className="public-copy">
          <p className="eyebrow">blindschool</p>
          <h1>교직원을 위한 익명 커뮤니티와 업무 소통 허브</h1>
          <p>
            학생과 학부모를 제외하고, 인증된 교직원만 사용하는 커뮤니티입니다.
            공개 홈에서는 서비스 원칙과 인증 흐름만 안내합니다.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="/signup">가입하기</a>
            <a className="secondary-link" href="/login">로그인</a>
          </div>
        </div>
        <div className="public-card" aria-label="인증 흐름 요약">
          <span>가입 접근 정책</span>
          <strong>인증 전 접근 제한</strong>
          <p>재직 인증이 끝나기 전에는 커뮤니티, 업무 허브, 일반 홈에 접근할 수 없습니다.</p>
        </div>
      </section>

      <section className="public-section" aria-label="주요 기능">
        {publicFeatures.map((feature) => (
          <article className="public-feature" key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.body}</p>
          </article>
        ))}
      </section>

      <section className="learning-section" aria-label="서비스 학습">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>스크롤하며 가입부터 이용까지의 흐름을 확인하세요.</h2>
        </div>
        <ol className="learning-list">
          {learningSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
