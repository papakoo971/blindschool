const workhubItems = [
  { type: "공지", region: "대구", school: "고등학교", title: "5월 교무회의 안건 취합" },
  { type: "투표", region: "경북", school: "중학교", title: "연수 일정 선호도 조사" },
  { type: "자료", region: "대구", school: "초등학교", title: "체험학습 운영 서식 v1.2" },
  { type: "일정", region: "서울", school: "고등학교", title: "부장협의회" },
];

export default function WorkhubPage() {
  return (
    <main className="content-page">
      <section className="content-header">
        <p className="eyebrow">업무 허브</p>
        <h1>카카오톡과 밴드에 흩어진 업무 흐름을 한 화면에 모읍니다.</h1>
      </section>
      <section className="work-list">
        {workhubItems.map((item) => (
          <div className="work-row" key={item.title}>
            <span>{item.type}</span>
            <strong>{item.title}</strong>
            <em>{item.school} · {item.region}</em>
          </div>
        ))}
      </section>
    </main>
  );
}
