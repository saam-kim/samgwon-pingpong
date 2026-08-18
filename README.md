# 되받아쳐! 삼권분립

고등학교 "법과 사회" 헌법 단원용 웹 퀴즈 게임입니다. 국가기관(국회·대통령·행정부·법원·헌법재판소)이 권한을 행사하는 상황이 제시되면, 이를 견제할 기관과 헌법상 견제 수단을 순서대로 골라 핑퐁처럼 되받아치며 학습합니다.

## 플레이

https://saam-kim.github.io/samgwon-pingpong/

## 개발

```bash
npm install
npm run dev      # 로컬 개발 서버
npm run build    # 정적 빌드 (dist/)
npm run lint      # oxlint
```

`master` 브랜치에 push하면 GitHub Actions가 자동으로 빌드하여 GitHub Pages에 배포합니다 (`.github/workflows/deploy.yml`).

## 데이터 추가/수정

문제는 `src/data/pingPongData.json`에 있습니다. 각 문항은 상황(situation), 견제해야 할 기관(correctCheckerOrg), 선택지(options, 오답 사유 포함), 근거 조항(article)과 해설(explanation)로 구성됩니다.

## 출처

문제와 권력분립 도식([DiagramPanel](src/components/DiagramPanel.jsx))은 아래 고등학교 "법과 사회" 교과서를 참고하여 제작했습니다.

- 비상교육 《법과 사회》 교사용 지도서, 55쪽 "우리나라 국가기관 간 견제 수단" 도식
- 천재교육 《법과 사회》 교과서, 62~67쪽(권력 분립의 원리), 95~98쪽(법원과 헌법재판소)
