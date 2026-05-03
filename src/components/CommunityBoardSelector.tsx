"use client";

import { useMemo, useState } from "react";

const ALL_JOB_GROUPS = "all_job_groups";
const ALL_REGIONS = "전체";
const ALL_SCHOOL_LEVELS = "all_school_levels";

const jobGroups = [
  {
    id: ALL_JOB_GROUPS,
    label: "전체",
    description: "교원과 행정직 게시판 전체",
  },
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
  ALL_REGIONS,
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
  { id: ALL_SCHOOL_LEVELS, label: "전체" },
  { id: "elementary", label: "초" },
  { id: "middle", label: "중" },
  { id: "high", label: "고" },
];

const jobGroupSortOrder = {
  teacher: 0,
  administrative_staff: 1,
} as Record<string, number>;

const regionSortOrder = regions
  .filter((region) => region !== ALL_REGIONS)
  .reduce<Record<string, number>>((order, region, index) => {
    order[region] = index;
    return order;
  }, {});

const schoolLevelSortOrder = {
  elementary: 0,
  middle: 1,
  high: 2,
} as Record<string, number>;

const samplePosts = [
  {
    jobGroup: "teacher",
    region: "서울",
    schoolLevel: "elementary",
    category: "학교문화",
    title: "학년 협의 자료가 한 곳에 모이면 신규 교사 적응이 빨라질 것 같습니다.",
  },
  {
    jobGroup: "teacher",
    region: "경북",
    schoolLevel: "high",
    category: "제도개선",
    title: "고사 기간 업무 분장 기준을 사전에 공유했으면 합니다.",
  },
  {
    jobGroup: "teacher",
    region: "대구",
    schoolLevel: "middle",
    category: "고충",
    title: "생활지도 민원 대응 매뉴얼이 학교마다 너무 다릅니다.",
  },
  {
    jobGroup: "teacher",
    region: "경기",
    schoolLevel: "elementary",
    category: "수업/학사",
    title: "학년 초 평가 계획 예시를 지역별로 공유하면 도움이 됩니다.",
  },
  {
    jobGroup: "teacher",
    region: "부산",
    schoolLevel: "elementary",
    category: "제도개선",
    title: "초등 돌봄 관련 협의 자료를 한 게시판에서 보고 싶습니다.",
  },
  {
    jobGroup: "administrative_staff",
    region: "경기",
    schoolLevel: "elementary",
    category: "행정업무",
    title: "계약 서류 체크리스트를 지역별로 공유하면 실무 부담이 줄어듭니다.",
  },
  {
    jobGroup: "administrative_staff",
    region: "부산",
    schoolLevel: "high",
    category: "시설/예산",
    title: "시설 민원 접수와 처리 이력을 업무 허브와 연결했으면 합니다.",
  },
  {
    jobGroup: "administrative_staff",
    region: "충남",
    schoolLevel: "middle",
    category: "인사/복무",
    title: "복무 관련 반복 문의를 모아볼 수 있는 고정 게시판이 필요합니다.",
  },
  {
    jobGroup: "administrative_staff",
    region: "서울",
    schoolLevel: "elementary",
    category: "회계",
    title: "초등학교 회계 마감 체크리스트를 공유할 수 있으면 좋겠습니다.",
  },
];

function getJobGroupLabel(jobGroupId: string) {
  return jobGroups.find((group) => group.id === jobGroupId)?.label ?? jobGroupId;
}

function getSchoolLevelLabel(levelId: string) {
  return schoolLevels.find((level) => level.id === levelId)?.label ?? levelId;
}

function comparePosts(first: (typeof samplePosts)[number], second: (typeof samplePosts)[number]) {
  return (
    (jobGroupSortOrder[first.jobGroup] ?? 999) - (jobGroupSortOrder[second.jobGroup] ?? 999) ||
    (schoolLevelSortOrder[first.schoolLevel] ?? 999) - (schoolLevelSortOrder[second.schoolLevel] ?? 999) ||
    (regionSortOrder[first.region] ?? 999) - (regionSortOrder[second.region] ?? 999)
  );
}

export function CommunityBoardSelector() {
  const [jobGroup, setJobGroup] = useState(ALL_JOB_GROUPS);
  const [region, setRegion] = useState(ALL_REGIONS);
  const [schoolLevel, setSchoolLevel] = useState(ALL_SCHOOL_LEVELS);

  const visiblePosts = useMemo(
    () =>
      samplePosts
        .filter(
          (post) =>
            (jobGroup === ALL_JOB_GROUPS || post.jobGroup === jobGroup) &&
            (schoolLevel === ALL_SCHOOL_LEVELS || post.schoolLevel === schoolLevel) &&
            (region === ALL_REGIONS || post.region === region),
        )
        .sort(comparePosts),
    [jobGroup, region, schoolLevel],
  );

  const boardJobGroupLabel = jobGroup === ALL_JOB_GROUPS ? "전체 직군" : getJobGroupLabel(jobGroup);
  const boardRegionLabel = region === ALL_REGIONS ? "전체 지역" : region;
  const boardSchoolLevelLabel =
    schoolLevel === ALL_SCHOOL_LEVELS ? "전체 학교급" : getSchoolLevelLabel(schoolLevel);

  return (
    <section className="board-selector" aria-label="커뮤니티 게시판 선택">
      <article className="board-controls">
        <div>
          <p className="eyebrow">직군</p>
          <div className="choice-grid three">
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
          <div className="choice-grid four">
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
              {boardJobGroupLabel} · {boardRegionLabel} · {boardSchoolLevelLabel}
            </h2>
          </div>
          <span className="status-pill quiet">전체 필터 지원</span>
        </div>

        {visiblePosts.length > 0 ? (
          <div className="post-list">
            {visiblePosts.map((post) => (
              <article className="post-item" key={post.title}>
                <span>
                  {post.category} · {getJobGroupLabel(post.jobGroup)} · {getSchoolLevelLabel(post.schoolLevel)} · {post.region}
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
