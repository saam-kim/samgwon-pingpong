// 순수 랜덤 추출은 triggerOrg가 한쪽(대통령·행정부)으로 쏠린 문제 풀에서
// 특정 유형만 반복 출제될 수 있다. 그렇다고 매 그룹을 라운드로빈으로 끝까지
// 채우면, 문항이 적은 그룹(법원·헌법재판소)은 통째로 다 뽑혀 매판 고정 출제된다.
// 그래서 그룹당 1문제만 보장하고, 나머지 자리는 전체 잔여 풀에서 완전히
// 무작위로 채운다 — "여러 기관이 고르게 등장"과 "판마다 안 겹침"을 동시에 노린다.
export function stratifiedSample(items, count, groupKeyFn, shuffleFn) {
  const groups = new Map()
  for (const item of items) {
    const key = groupKeyFn(item)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
  }

  const groupKeys = shuffleFn([...groups.keys()])
  const picked = []
  const leftover = []

  for (const key of groupKeys) {
    const pool = shuffleFn(groups.get(key))
    if (pool.length === 0) continue
    if (picked.length < count) {
      picked.push(pool[0])
      leftover.push(...pool.slice(1))
    } else {
      leftover.push(...pool)
    }
  }

  const remaining = count - picked.length
  if (remaining > 0) {
    picked.push(...shuffleFn(leftover).slice(0, remaining))
  }

  return shuffleFn(picked)
}
