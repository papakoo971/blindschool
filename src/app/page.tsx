const mvpAreas = [
  {
    title: "재직증명서 인증",
    body: "교직원 가입 시 증명서를 업로드하고 OCR 기반 점수로 자동 승인, 보류, 반려를 결정합니다.",
  },
  {
    title: "익명 커뮤니티",
    body: "실명 계정과 익명 프로필을 분리해 학교 문화, 제도, 고충, 개선 제안을 안전하게 다룹니다.",
  },
  {
    title: "업무 허브",
    body: "공지, 투표, 자료실, 일정 기능을 학교와 그룹 단위로 묶어 분산된 업무 소통을 줄입니다.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="shell">
        <p className="eyebrow">blindschool MVP</p>
        <h1>교직원 전용 익명 커뮤니티와 업무 소통 허브</h1>
        <p className="lead">
          현재 구현은 제품 문서, Prisma 데이터 모델, 재직증명서 인증 점수
          모듈을 기준으로 시작합니다. 학생과 학부모는 MVP 대상에서 제외합니다.
        </p>
        <div className="grid">
          {mvpAreas.map((area) => (
            <article className="card" key={area.title}>
              <h2>{area.title}</h2>
              <p>{area.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
