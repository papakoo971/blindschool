"use client";

import { useMemo, useState } from "react";

const jobGroups = [
  {
    id: "teacher",
    label: "교원",
    description: "교사와 비교과 교원을 위한 익명 게시판",
  },
  {
    id: "administrative_staff",
    label: "행정직",
    description: "행정실장 및 행정실 직원을 위한 익명 게시판",
  },
];

const regions = [
  "서울",
  "경기",
  "강원",
  "충남",
  "충북",
  "대전",
  "세종",
  "대구",
  "부산",
  "울산",
  "경북",
  "경남",
  "전북",
  "전남",
  "광주",
  "인천",
];

const schoolLevels = [
  { id: "elementary", label: "초" },
  { id: "middle", label: "중" },
  { id: "high", label: "고" },
];

const samplePosts = [
  {
    jobGroup: "teacher",
    region: "서울",
    schoolLevel: "초",
    category: "학교문화",
    title: "학년 협의 자료가 한 곳에 모이면 신규 교사 적응이 빨라질 것 같습니다.",
  },
  {
    jobGroup: "teacher",
    region: "경북",
    schoolLevel: "고",
    category: "제도개선",
    title: "고사 기간 업무 분장 기준을 사전에 공유했으면 합니다.",
  },
  {
    jobGroup: "teacher",
    region: "대구",
    schoolLevel: "중",
    category: "고충",
    title: "생활지도 민원 대응 매뉴얼이 학교마다 너무 다릅니다.",
  },
  {
    jobGroup: "administrative_staff",
    region: "경기",
    schoolLevel: "초",
    category: "행정업무",
    title: "계약 서류 체크리스트를 지역별로 공유하면 실무 부담이 줄어듭니다.",
  },
  {
    jobGroup: "administrative_staff",
    region: "부산",
    schoolLevel: "고",
    category: "시설/예산",
    title: "시설 민원 접수와 처리 이력을 업무 허브와 연결했으면 합니다.",
  },
  {
    jobGroup: "administrative_staff",
    region: "충남",
    schoolLevel: "중",
    category: "인사/복무",
    title: "복무 관련 반복 문의를 모아볼 수 있는 고정 게시판이 필요합니다.",
  },
];

function getSchoolLevelLabel(levelId: string) {
  return schoolLevels.find((level) => level.id === levelId)?.label ?? levelId;
}

export function CommunityBoardSelector() {
  const [jobGroup, setJobGroup] = useState("teacher");
  const [region, setRegion] = useState("서울");
  const [schoolLevel, setSchoolLevel] = useState("elementary");

  const selectedJobGroup = jobGroups.find((group) => group.id === jobGroup);
  const schoolLevelLabel = getSchoolLevelLabel(schoolLevel);

  const visiblePosts = useMemo(
    () =>
      samplePosts.filter(
        (post) =>
          post.jobGroup === jobGroup &&
          post.region === region &&
          post.schoolLevel === schoolLevel,
      ),
    [jobGroup, region, schoolLevel],
  );

  return (
    <section className="board-selector" aria-label="커뮤니티 게시판 선택">
      <article className="board-controls">
        <div>
          <p className="eyebrow">직군</p>
          <div className="choice-grid two">
            {jobGroups.map((group) => (
              <button
                className={group.id === jobGroup ? "choice active" : "choice"}
                key={group.id}
                onClick={() => setJobGroup(group.id)}
                type="button"
              >
                <strong>{group.label}</strong>
                <span>{group.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">지역</p>
          <div className="choice-grid regions">
            {regions.map((item) => (
              <button
                className={item === region ? "choice chip active" : "choice chip"}
                key={item}
                onClick={() => setRegion(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">학교급</p>
          <div className="choice-grid three">
            {schoolLevels.map((level) => (
              <button
                className={level.id === schoolLevel ? "choice active" : "choice"}
                key={level.id}
                onClick={() => setSchoolLevel(level.id)}
                type="button"
              >
                <strong>{level.label}</strong>
              </button>
            ))}
          </div>
        </div>
      </article>

      <article className="selected-board">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">선택된 게시판</p>
            <h2>
              {selectedJobGroup?.label} · {region} · {schoolLevelLabel}
            </h2>
          </div>
          <span className="status-pill quiet">지역/학교급 표시</span>
        </div>

        {visiblePosts.length > 0 ? (
          <div className="post-list">
            {visiblePosts.map((post) => (
              <article className="post-item" key={post.title}>
                <span>
                  {post.category} · {selectedJobGroup?.label} · {getSchoolLevelLabel(post.schoolLevel)} · {post.region}
                </span>
                <h2>{post.title}</h2>
                <p>익명 · 도움됨 표시 예정 · 신고 기능 예정</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-board">
            <strong>아직 샘플 게시글이 없습니다.</strong>
            <p>
              실제 DB 연결 후에는 선택한 직군, 지역, 학교급에 맞는 게시글만 이 영역에 표시됩니다.
            </p>
          </div>
        )}
      </article>
    </section>
  );
}
