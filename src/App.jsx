import { useEffect, useState } from 'react'
import pingPongData from './data/pingPongData.json'
import { shuffle } from './utils/shuffle'
import { stratifiedSample } from './utils/stratifiedSample'
import { useStopwatch } from './hooks/useStopwatch'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import ResultScreen from './components/ResultScreen'
import DiagramPanel from './components/DiagramPanel'

const STORAGE_KEY = 'pingpong-state-v1'

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.screen === 'game' && Array.isArray(parsed.roundOrder) && parsed.roundOrder.length > 0) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export default function App() {
  const saved = loadSavedState()
  const stopwatch = useStopwatch()

  const [screen, setScreen] = useState(saved?.screen ?? 'start')
  const [roundOrder, setRoundOrder] = useState(saved?.roundOrder ?? [])
  const [currentIndex, setCurrentIndex] = useState(saved?.currentIndex ?? 0)
  const [score, setScore] = useState(saved?.score ?? 0)
  const [combo, setCombo] = useState(saved?.combo ?? 0)
  const [maxCombo, setMaxCombo] = useState(saved?.maxCombo ?? 0)
  const [wrongLog, setWrongLog] = useState(saved?.wrongLog ?? [])
  const [diagramOpen, setDiagramOpen] = useState(false)

  // 새로고침으로 게임 중이던 상태를 복원할 때, 스톱워치도 저장된 지점부터 이어서 흐르게 한다.
  useEffect(() => {
    if (saved) {
      stopwatch.seed(saved.elapsedMsSnapshot ?? 0)
      stopwatch.start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (screen === 'start') {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        screen,
        roundOrder,
        currentIndex,
        score,
        combo,
        maxCombo,
        wrongLog,
        elapsedMsSnapshot: stopwatch.elapsedMs(),
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, roundOrder, currentIndex, score, combo, maxCombo, wrongLog])

  function handleStart(mode) {
    const order = stratifiedSample(pingPongData, mode, (item) => item.triggerOrg, shuffle)
    setRoundOrder(order)
    setCurrentIndex(0)
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setWrongLog([])
    setDiagramOpen(false)
    stopwatch.reset()
    stopwatch.start()
    setScreen('game')
  }

  function handleRoundComplete(wasFirstTry) {
    const round = roundOrder[currentIndex]
    let nextCombo = combo
    let nextScore = score
    let nextWrongLog = wrongLog

    if (wasFirstTry) {
      nextScore = score + 1
      nextCombo = combo + 1
      setMaxCombo((m) => Math.max(m, nextCombo))
    } else {
      nextCombo = 0
      nextWrongLog = [
        ...wrongLog,
        { roundId: round.id, situation: round.situation, article: round.article, explanation: round.explanation },
      ]
    }

    setScore(nextScore)
    setCombo(nextCombo)
    setWrongLog(nextWrongLog)

    if (currentIndex + 1 >= roundOrder.length) {
      setScreen('result')
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  function handleRestart() {
    localStorage.removeItem(STORAGE_KEY)
    setScreen('start')
  }

  return (
    <div className="min-h-screen">
      {screen === 'start' && <StartScreen onStart={handleStart} />}

      {screen === 'game' && roundOrder[currentIndex] && (
        <>
          <GameScreen
            key={roundOrder[currentIndex].id}
            round={roundOrder[currentIndex]}
            roundNumber={currentIndex + 1}
            totalRounds={roundOrder.length}
            combo={combo}
            elapsedMs={stopwatch.elapsedMs()}
            onPauseTimer={stopwatch.pause}
            onResumeTimer={stopwatch.start}
            onWrongAttempt={(penaltyMs) => stopwatch.addPenalty(penaltyMs)}
            onRoundComplete={handleRoundComplete}
          />
          <DiagramPanel open={diagramOpen} onToggle={() => setDiagramOpen((v) => !v)} />
        </>
      )}

      {screen === 'result' && (
        <ResultScreen
          score={score}
          total={roundOrder.length}
          maxCombo={maxCombo}
          wrongLog={wrongLog}
          elapsedMs={stopwatch.elapsedMs()}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}
