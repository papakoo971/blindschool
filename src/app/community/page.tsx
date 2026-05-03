const communityPosts = [
  { region: "대구", school: "고등학교", category: "제도개선", title: "고사 기간 업무 분장 기준을 사전에 공유했으면 합니다." },
  { region: "경북", school: "중학교", category: "고충", title: "생활지도 민원 대응 자료가 지역별로 공유되면 좋겠습니다." },
  { region: "서울", school: "초등학교", category: "학교문화", title: "학년 회의록을 한 곳에 모아두면 신규 교사가 적응하기 쉽습니다." },
];

export default function CommunityPage() {
  return (
    <main className="content-page">
      <section className="content-header">
        <p className="eyebrow">익명 커뮤니티</p>
        <h1>모든 게시글에 학교급과 지역을 함께 표시합니다.</h1>
      </section>
      <section className="filter-bar" aria-label="게시글 필터">
        <span>초등학교</span>
        <span>중학교</span>
        <span>고등학교</span>
        <span>대구</span>
        <span>경북</span>
      </section>
      <section className="post-list">
        {communityPosts.map((post) => (
          <article className="post-item" key={post.title}>
            <span>{post.category} · {post.school} · {post.region}</span>
            <h2>{post.title}</h2>
            <p>익명 · 도움됨 표시 예정 · 신고 기능 예정</p>
          </article>
        ))}
      </section>
    </main>
  );
}
