const homeCards = [
  { label: "내 지역", value: "대구", note: "게시글 지역 표시 기본값" },
  { label: "학교급", value: "고등학교", note: "필터 기본값" },
  { label: "새 댓글", value: "5", note: "내가 참여한 글" },
  { label: "업무 알림", value: "3", note: "오늘 마감" },
];

export default function StaffHomePage() {
  return (
    <main className="content-page">
      <section className="content-header">
        <p className="eyebrow">일반 교직원 홈</p>
        <h1>지역과 학교급을 기준으로 필요한 글과 업무를 먼저 보여줍니다.</h1>
      </section>
      <section className="stat-grid">
        {homeCards.map((card) => (
          <article className="stat-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.note}</p>
          </article>
        ))}
      </section>
      <section className="dashboard-grid">
        <article className="panel">
          <p className="eyebrow">추천 커뮤니티</p>
          <h2>대구 · 고등학교 게시글</h2>
          <p className="panel-copy">지역과 학교급 맥락이 표시된 익명 글을 우선 노출합니다.</p>
        </article>
        <article className="panel">
          <p className="eyebrow">업무허브</p>
          <h2>오늘 확인할 공지와 투표</h2>
          <p className="panel-copy">공지, 투표, 자료, 일정을 한 화면에서 확인합니다.</p>
        </article>
      </section>
    </main>
  );
}
