import { CommunityBoardSelector } from "../../components/CommunityBoardSelector";

export default function CommunityPage() {
  return (
    <main className="content-page">
      <section className="content-header">
        <p className="eyebrow">익명 커뮤니티</p>
        <h1>직군, 지역, 학교급을 선택해 필요한 게시판만 봅니다.</h1>
        <p>
          교원과 행정직 게시판을 분리하고, 각 게시글에는 지역과 학교급이 함께 표시됩니다.
        </p>
      </section>
      <CommunityBoardSelector />
    </main>
  );
}
