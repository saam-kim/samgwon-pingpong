import { useEffect, useRef, useState } from 'react'

// 총 풀이 시간을 재는 스톱워치. Step D(조항 해설) 구간은 pause()로 제외하고,
// 오답 시 addPenalty()로 페널티를 더해 "빠르고 정확하게"를 유도한다.
export function useStopwatch() {
  const accumulatedRef = useRef(0)
  const startRef = useRef(null)
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 200)
    return () => clearInterval(id)
  }, [])

  function elapsedMs() {
    return accumulatedRef.current + (startRef.current ? Date.now() - startRef.current : 0)
  }

  function start() {
    if (!startRef.current) startRef.current = Date.now()
  }

  function pause() {
    if (startRef.current) {
      accumulatedRef.current += Date.now() - startRef.current
      startRef.current = null
    }
  }

  function addPenalty(ms) {
    accumulatedRef.current += ms
  }

  function reset() {
    accumulatedRef.current = 0
    startRef.current = null
  }

  function seed(ms) {
    accumulatedRef.current = ms
    startRef.current = null
  }

  return { elapsedMs, start, pause, addPenalty, reset, seed }
}
