const KEY_PREFIX = 'pingpong-best-'

export function getBestTime(mode) {
  const raw = localStorage.getItem(KEY_PREFIX + mode)
  const ms = raw ? Number(raw) : null
  return Number.isFinite(ms) ? ms : null
}

// 기록이 갱신됐을 때만 저장하고, 신기록 여부와 직전 기록을 함께 돌려준다.
export function saveBestTimeIfBetter(mode, elapsedMs) {
  const previousBest = getBestTime(mode)
  const isNewRecord = previousBest === null || elapsedMs < previousBest
  if (isNewRecord) {
    localStorage.setItem(KEY_PREFIX + mode, String(Math.round(elapsedMs)))
  }
  return { isNewRecord, previousBest }
}
