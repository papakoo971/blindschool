const steps = [
  { title: "계정 생성", state: "완료" },
  { title: "SMS 인증", state: "대기" },
  { title: "재직증명서 PDF 업로드", state: "대기" },
  { title: "OCR/운영자 검토", state: "대기" },
];

export default function VerificationPage() {
  return (
    <main className="content-page">
      <section className="content-header">
        <p className="eyebrow">가입 상태 확인</p>
        <h1>인증 전에는 이 화면만 접근할 수 있습니다.</h1>
        <p>SMS 인증과 PDF 재직증명서 제출이 완료되면 일반 교직원 홈으로 이동할 수 있습니다.</p>
      </section>
      <section className="status-timeline">
        {steps.map((step) => (
          <article className="status-step" key={step.title}>
            <span>{step.state}</span>
            <h2>{step.title}</h2>
          </article>
        ))}
      </section>
      <section className="upload-panel">
        <h2>재직증명서 업로드</h2>
        <p>허용 형식은 PDF만 사용합니다. 파일 크기 제한과 보안 검사는 서버 구현 단계에서 적용합니다.</p>
        <button type="button">PDF 선택</button>
      </section>
    </main>
  );
}
