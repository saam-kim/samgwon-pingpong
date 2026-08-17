import { useEffect, useMemo, useState } from 'react'
import { Check, X, ChevronRight, Lightbulb, Timer } from 'lucide-react'
import { ORGS, getOrg } from '../data/orgs'
import { shuffle } from '../utils/shuffle'
import { formatTime } from '../utils/formatTime'
import FlashOverlay from './FlashOverlay'
import OrgChip from './OrgChip'

// 라운드 안에서 오답을 낼 때마다 페널티가 5초, 10초, 15초...로 커진다.
// 기관/카드 선택지가 몇 개 안 되기 때문에 "몰라도 다 눌러보면 통과"를 막기 위한 장치.
const PENALTY_STEP_MS = 5000

export default function GameScreen({
  round,
  roundNumber,
  totalRounds,
  combo,
  elapsedMs,
  onPauseTimer,
  onResumeTimer,
  onWrongAttempt,
  onRoundComplete,
}) {
  const [stage, setStage] = useState('select-org') // 'select-org' | 'select-card' | 'feedback'
  const [wrongOrgIds, setWrongOrgIds] = useState(new Set())
  const [shakeOrgId, setShakeOrgId] = useState(null)
  const [wrongOptionIds, setWrongOptionIds] = useState(new Set())
  const [shakeOptionId, setShakeOptionId] = useState(null)
  const [mistakeHappened, setMistakeHappened] = useState(false)
  const [flash, setFlash] = useState(null)
  const [flashKey, setFlashKey] = useState(0)
  const [penaltyFlash, setPenaltyFlash] = useState(false)
  const [lastPenaltyMs, setLastPenaltyMs] = useState(PENALTY_STEP_MS)

  const shuffledOptions = useMemo(() => shuffle(round.options), [round])

  // 라운드가 바뀌면 상태 초기화
  useEffect(() => {
    setStage('select-org')
    setWrongOrgIds(new Set())
    setShakeOrgId(null)
    setWrongOptionIds(new Set())
    setShakeOptionId(null)
    setMistakeHappened(false)
    setFlash(null)
    setLastPenaltyMs(PENALTY_STEP_MS)
  }, [round.id])

  // Step D(조항 해설)를 읽는 동안은 기록에서 제외하고, 문제를 푸는 동안만 시간을 잰다.
  useEffect(() => {
    if (stage === 'feedback') {
      onPauseTimer()
    } else {
      onResumeTimer()
    }
  }, [stage, onPauseTimer, onResumeTimer])

  function triggerPenalty() {
    // 이번 라운드에서 이미 낸 오답 수만큼 다음 페널티를 키운다 (5초 → 10초 → 15초 ...).
    const mistakesSoFar = wrongOrgIds.size + wrongOptionIds.size
    const penaltyMs = PENALTY_STEP_MS * (mistakesSoFar + 1)
    onWrongAttempt(penaltyMs)
    setLastPenaltyMs(penaltyMs)
    setPenaltyFlash(true)
    setTimeout(() => setPenaltyFlash(false), 700)
  }

  function triggerFlash(type) {
    setFlash(type)
    setFlashKey((k) => k + 1)
  }

  function handleOrgClick(orgId) {
    if (stage !== 'select-org') return
    if (orgId === round.correctCheckerOrg) {
      triggerFlash('success')
      setStage('select-card')
    } else {
      setMistakeHappened(true)
      setWrongOrgIds((prev) => new Set(prev).add(orgId))
      setShakeOrgId(orgId)
      triggerFlash('danger')
      triggerPenalty()
      setTimeout(() => setShakeOrgId(null), 400)
    }
  }

  function handleOptionClick(option) {
    if (stage !== 'select-card') return
    if (option.isCorrect) {
      triggerFlash('success')
      setStage('feedback')
    } else {
      setMistakeHappened(true)
      setWrongOptionIds((prev) => new Set(prev).add(option.id))
      setShakeOptionId(option.id)
      triggerFlash('danger')
      triggerPenalty()
      setTimeout(() => setShakeOptionId(null), 400)
    }
  }

  function handleNext() {
    onRoundComplete(!mistakeHappened)
  }

  const triggerOrg = getOrg(round.triggerOrg)

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-5 py-8">
      <FlashOverlay flashKey={flashKey} type={flash} />

      {/* 상단 진행 바 + 타이머 + 콤보 */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
            <span>Round {roundNumber} / {totalRounds}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgba(148,163,184,0.25)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(roundNumber / totalRounds) * 100}%`, background: 'linear-gradient(90deg, var(--accent-blue-mid), var(--accent-blue-light))' }}
            />
          </div>
        </div>
        <div className="ml-4 flex flex-col items-end gap-1.5">
          <div
            className="font-display flex items-center gap-1.5 rounded-full px-3 py-1 text-base font-bold tabular-nums transition-colors"
            style={{
              background: penaltyFlash ? 'rgba(239,68,68,0.12)' : 'var(--bg-tertiary)',
              color: penaltyFlash ? 'var(--color-danger)' : 'var(--accent-blue-mid)',
              border: `2px solid ${penaltyFlash ? 'rgba(239,68,68,0.3)' : 'rgba(37,99,235,0.15)'}`,
            }}
          >
            <Timer size={15} />
            {formatTime(elapsedMs)}
            {penaltyFlash && <span className="text-xs font-bold">+{lastPenaltyMs / 1000}초</span>}
          </div>
          {combo > 1 && (
            <div className="combo-badge font-display rounded-full px-3 py-1 text-xs font-bold">
              🔥 {combo} 콤보
            </div>
          )}
        </div>
      </div>

      {/* Step A: 상황 발생 */}
      <div className="glass-card p-6">
        <div className="mb-3 flex items-center gap-2">
          <OrgChip orgId={triggerOrg.id} />
          <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>이 행동을 개시했습니다</span>
        </div>
        <p className="text-lg font-medium leading-relaxed" style={{ color: 'var(--text-main)' }}>
          {round.situation}
        </p>
      </div>

      {/* Step B: 견제 기관 선택 */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold" style={{ color: 'var(--accent-blue)' }}>
          <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-white" style={{ background: 'var(--accent-blue-mid)' }}>1</span>
          어느 기관이 견제해야 할까요?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {ORGS.map((org) => {
            const isWrong = wrongOrgIds.has(org.id)
            const isCorrectPick = stage !== 'select-org' && org.id === round.correctCheckerOrg
            return (
              <button
                key={org.id}
                onClick={() => handleOrgClick(org.id)}
                disabled={stage !== 'select-org' || isWrong}
                className={`spring-btn flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-base font-bold ${shakeOrgId === org.id ? 'shake' : ''}`}
                style={{
                  minHeight: 56,
                  borderColor: isCorrectPick ? 'var(--color-success)' : isWrong ? 'var(--color-danger)' : 'rgba(148,163,184,0.35)',
                  background: isCorrectPick ? 'rgba(5,150,105,0.08)' : isWrong ? 'rgba(239,68,68,0.06)' : '#fff',
                  color: isWrong ? 'var(--color-danger)' : 'var(--text-main)',
                }}
              >
                <span aria-hidden="true">{org.emoji}</span>
                {org.label}
                {isCorrectPick && <Check size={16} style={{ color: 'var(--color-success)' }} />}
                {isWrong && <X size={16} />}
              </button>
            )
          })}
        </div>
        {wrongOrgIds.size > 0 && stage === 'select-org' && (
          <p className="mt-3 flex items-start gap-2 text-sm font-medium" style={{ color: 'var(--color-danger)' }}>
            <Lightbulb size={16} className="mt-0.5 shrink-0" />
            {round.hint}
          </p>
        )}
      </div>

      {/* Step C: 견제 수단 카드 선택 */}
      {stage !== 'select-org' && (
        <div className="card-pop">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold" style={{ color: 'var(--accent-blue)' }}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-white" style={{ background: 'var(--accent-blue-mid)' }}>2</span>
            어떤 헌법상 권한으로 견제할까요?
          </h2>
          <div className="flex flex-col gap-3">
            {shuffledOptions.map((option) => {
              const isWrong = wrongOptionIds.has(option.id)
              const isCorrectPick = stage === 'feedback' && option.isCorrect
              return (
                <div key={option.id}>
                  <button
                    onClick={() => handleOptionClick(option)}
                    disabled={stage !== 'select-card' || isWrong}
                    className={`spring-btn glass-card flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-base font-semibold ${shakeOptionId === option.id ? 'shake' : ''}`}
                    style={{
                      minHeight: 56,
                      borderColor: isCorrectPick ? 'var(--color-success)' : isWrong ? 'var(--color-danger)' : undefined,
                      background: isCorrectPick ? 'rgba(5,150,105,0.08)' : isWrong ? 'rgba(239,68,68,0.06)' : undefined,
                    }}
                  >
                    <span>{option.text}</span>
                    {isCorrectPick && <Check size={18} style={{ color: 'var(--color-success)' }} />}
                    {isWrong && <X size={18} style={{ color: 'var(--color-danger)' }} />}
                  </button>
                  {isWrong && (
                    <p className="mt-1.5 px-2 text-xs font-medium" style={{ color: 'var(--color-danger)' }}>
                      {option.reason}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Step D: 핑퐁 성공 및 헌법 조항 피드백 */}
      {stage === 'feedback' && (
        <div className="law-article card-pop p-5">
          <div className="law-article-divider mb-3 flex items-center justify-between pb-2">
            <span className="font-display text-base font-bold" style={{ color: 'var(--accent-blue-mid)' }}>
              ✅ 견제 성공! {round.article}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
            {round.explanation}
          </p>
          <button
            onClick={handleNext}
            className="spring-btn btn-primary mt-5 flex w-full items-center justify-center gap-1 rounded-xl py-3.5 text-base font-bold"
            style={{ minHeight: 52 }}
          >
            다음 라운드
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
