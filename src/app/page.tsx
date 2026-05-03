const stats = [
  { label: "인증 대기", value: "18", note: "수동 검토 7건" },
  { label: "오늘 게시글", value: "42", note: "신고율 1.8%" },
  { label: "진행 투표", value: "6", note: "평균 참여 64%" },
  { label: "이번 주 일정", value: "12", note: "마감 임박 3건" },
];

const verificationRules = [
  { label: "성명/학교 일치", score: "+40", state: "필수" },
  { label: "발급일 90일 이내", score: "+10", state: "권장" },
  { label: "직인/문서번호 감지", score: "+15", state: "신뢰" },
  { label: "위변조 고위험 2건", score: "보류", state: "하드룰" },
];

const posts = [
  {
    category: "제도개선",
    title: "학기 초 업무 분장 공지 시점을 앞당겼으면 합니다",
    meta: "익명 · 도움됨 38 · 댓글 12",
  },
  {
    category: "고충",
    title: "생활지도 관련 민원 대응 매뉴얼이 학교마다 너무 다릅니다",
    meta: "익명 · 도움됨 24 · 댓글 9",
  },
  {
    category: "학교문화",
    title: "회의록 공유 방식이 통일되면 신규 교직원 적응이 빠를 것 같습니다",
    meta: "익명 · 도움됨 19 · 댓글 5",
  },
];

const workItems = [
  { type: "공지", title: "5월 교무회의 안건 취합", status: "오늘 마감" },
  { type: "투표", title: "연수 일정 선호도 조사", status: "참여율 71%" },
  { type: "자료", title: "체험학습 운영 서식 v1.2", status: "최근 업데이트" },
  { type: "일정", title: "부장협의회", status: "목 15:30" },
];

const reviewQueue = [
  { name: "김OO", school: "서울OO고", score: 91, status: "자동승인" },
  { name: "박OO", school: "경기OO중", score: 78, status: "검토필요" },
  { name: "이OO", school: "부산OO초", score: 54, status: "반려검토" },
];

export default function Home() {
  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="주요 메뉴">
        <div>
          <p className="brand-mark">blindschool</p>
          <p className="brand-copy">교직원 인증 기반 커뮤니티</p>
        </div>
        <nav className="nav-list">
          <a href="#overview">대시보드</a>
          <a href="#verification">인증</a>
          <a href="#community">커뮤니티</a>
          <a href="#workhub">업무허브</a>
          <a href="#admin">관리자</a>
        </nav>
        <div className="sidebar-note">
          <span>운영 모드</span>
          <strong>MVP Pilot</strong>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">한국 교직원 전용</p>
            <h1>익명 의견과 실무 소통을 한 화면에서 관리합니다.</h1>
          </div>
          <div className="topbar-actions" aria-label="상태 요약">
            <span>학생 제외</span>
            <span>재직증명서 인증</span>
          </div>
        </header>

        <section className="stat-grid" id="overview" aria-label="서비스 현황">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.note}</p>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="panel verification-panel" id="verification">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">교직원 인증</p>
                <h2>재직증명서 자동 판정</h2>
              </div>
              <span className="status-pill">85점 이상 승인</span>
            </div>
            <div className="score-block">
              <div className="score-ring">
                <strong>82</strong>
                <span>검토필요</span>
              </div>
              <div className="score-copy">
                <h3>OCR 결과와 입력값을 비교해 신뢰 점수를 계산합니다.</h3>
                <p>
                  자동 승인, 수동 검토, 반려를 분기하고 모든 관리자 조치는 감사
                  로그에 남깁니다.
                </p>
              </div>
            </div>
            <div className="rule-list">
              {verificationRules.map((rule) => (
                <div className="rule-row" key={rule.label}>
                  <span>{rule.label}</span>
                  <strong>{rule.score}</strong>
                  <em>{rule.state}</em>
                </div>
              ))}
            </div>
          </article>

          <article className="panel" id="community">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">익명 커뮤니티</p>
                <h2>오늘 올라온 주요 의견</h2>
              </div>
              <span className="status-pill quiet">실명 비노출</span>
            </div>
            <div className="post-list">
              {posts.map((post) => (
                <article className="post-item" key={post.title}>
                  <span>{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.meta}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="dashboard-grid lower-grid">
          <article className="panel" id="workhub">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">업무허브</p>
                <h2>공지 · 투표 · 자료 · 일정</h2>
              </div>
            </div>
            <div className="work-list">
              {workItems.map((item) => (
                <div className="work-row" key={item.title}>
                  <span>{item.type}</span>
                  <strong>{item.title}</strong>
                  <em>{item.status}</em>
                </div>
              ))}
            </div>
          </article>

          <article className="panel admin-panel" id="admin">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">관리자 센터</p>
                <h2>인증 검토 큐</h2>
              </div>
            </div>
            <div className="review-table" role="table" aria-label="인증 검토 큐">
              <div className="review-row review-head" role="row">
                <span>이름</span>
                <span>학교</span>
                <span>점수</span>
                <span>상태</span>
              </div>
              {reviewQueue.map((item) => (
                <div className="review-row" role="row" key={`${item.name}-${item.school}`}>
                  <span>{item.name}</span>
                  <span>{item.school}</span>
                  <strong>{item.score}</strong>
                  <em>{item.status}</em>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
