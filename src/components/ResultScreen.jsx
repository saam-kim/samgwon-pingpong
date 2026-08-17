import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { RotateCcw, ChevronDown, ChevronUp, Timer, Trophy } from 'lucide-react'
import { formatTime } from '../utils/formatTime'
import { saveBestTimeIfBetter } from '../utils/bestTime'

function getTitle(accuracy) {
  if (accuracy >= 90) return { label: '헌법 수호자', emoji: '🏆' }
  if (accuracy >= 70) return { label: '예비 헌법재판관', emoji: '⚖️' }
  if (accuracy >= 50) return { label: '국회 인턴', emoji: '📋' }
  return { label: '법전을 다시 펼쳐볼 시간', emoji: '📖' }
}

export default function ResultScreen({ score, total, maxCombo, wrongLog, elapsedMs, onRestart }) {
  const [reviewOpen, setReviewOpen] = useState(false)
  const [record, setRecord] = useState(null)
  const savedRef = useRef(false)
  const accuracy = Math.round((score / total) * 100)
  const title = getTitle(accuracy)

  useEffect(() => {
    if (savedRef.current) return
    savedRef.current = true
    setRecord(saveBestTimeIfBetter(total, elapsedMs))
  }, [total, elapsedMs])

  useEffect(() => {
    if (!record) return
    if (accuracy >= 70 || record.isNewRecord) {
      confetti({
        particleCount: record.isNewRecord ? 180 : 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#60a5fa', '#059669', '#d97706'],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-5 py-10">
      <div className="glass-card flex flex-col items-center gap-3 p-8 text-center">
        <div className="text-6xl">{title.emoji}</div>
        <h1 className="gradient-title text-3xl font-black">{title.label}</h1>
        <div className="font-display mt-2 text-5xl font-extrabold" style={{ color: 'var(--accent-blue-mid)' }}>
          {score} / {total}
        </div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
          정답률 {accuracy}% · 최고 콤보 {maxCombo}
        </p>

        <div
          className="mt-3 flex w-full flex-col items-center gap-1 rounded-2xl border-2 py-4"
          style={{
            borderColor: record?.isNewRecord ? 'var(--color-cc)' : 'rgba(37,99,235,0.15)',
            background: record?.isNewRecord ? 'rgba(217,119,6,0.06)' : 'var(--bg-tertiary)',
          }}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
            <Timer size={14} />
            기록
          </div>
          <div className="font-display text-4xl font-extrabold tabular-nums" style={{ color: record?.isNewRecord ? 'var(--color-cc)' : 'var(--accent-blue)' }}>
            {formatTime(elapsedMs)}
          </div>
          {record?.isNewRecord && (
            <div className="mt-1 flex items-center gap-1 text-sm font-extrabold" style={{ color: 'var(--color-cc)' }}>
              <Trophy size={16} />
              🎉 신기록!{record.previousBest !== null && ` (이전 ${formatTime(record.previousBest, { tenths: false })})`}
            </div>
          )}
          {record && !record.isNewRecord && record.previousBest !== null && (
            <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              최고기록 {formatTime(record.previousBest, { tenths: false })}보다 {formatTime(elapsedMs - record.previousBest, { tenths: false })} 느려요
            </p>
          )}
        </div>
      </div>

      {wrongLog.length > 0 && (
        <div className="glass-card p-5">
          <button
            onClick={() => setReviewOpen((v) => !v)}
            className="spring-btn flex w-full items-center justify-between text-left text-sm font-extrabold"
            style={{ color: 'var(--accent-blue)' }}
          >
            📝 오답 노트 ({wrongLog.length}문제 다시보기)
            {reviewOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {reviewOpen && (
            <div className="mt-4 flex flex-col gap-3">
              {wrongLog.map((item, i) => (
                <div key={`${item.roundId}-${i}`} className="law-article law-article-divider p-4">
                  <p className="mb-1 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                    {item.situation}
                  </p>
                  <p className="font-display mb-1 text-sm font-bold" style={{ color: 'var(--accent-blue-mid)' }}>
                    {item.article}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-main)' }}>
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
        📸 이 화면을 캡처해서 기록을 자랑해보세요!
      </p>

      <button
        onClick={onRestart}
        className="spring-btn btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold"
        style={{ minHeight: 52 }}
      >
        <RotateCcw size={18} />
        다시 시작하기
      </button>
    </div>
  )
}
