// 4개 헌법기관의 공통 메타데이터. correctCheckerOrg / triggerOrg / targetOrg 값은
// 반드시 아래 id 문자열과 완전히 일치해야 정답 판정 로직이 동작한다.
export const ORGS = [
  {
    id: '국회',
    label: '국회',
    emoji: '🏛️',
    colorVar: '--color-assembly',
  },
  {
    id: '대통령·행정부',
    label: '대통령·행정부',
    emoji: '🏢',
    colorVar: '--color-executive',
  },
  {
    id: '법원',
    label: '법원',
    emoji: '⚖️',
    colorVar: '--color-court',
  },
  {
    id: '헌법재판소',
    label: '헌법재판소',
    emoji: '📜',
    colorVar: '--color-cc',
  },
]

export const getOrg = (id) => ORGS.find((org) => org.id === id)
