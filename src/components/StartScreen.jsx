import { useState } from 'react'
import { Scale, Play, Trophy } from 'lucide-react'
import { getBestTime } from '../utils/bestTime'
import { formatTime } from '../utils/formatTime'

export default function StartScreen({ onStart }) {
  const [mode, setMode] = useState(5)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold" style={{ background: 'rgba(37,99,235,0.08)', color: 'var(--accent-blue-mid)' }}>
          <Scale size={16} />
          법과 사회 · 헌법 단원
        </div>
        <h1 className="gradient-title text-4xl font-black tracking-tight sm:text-5xl">
          ⚖️ 되받아쳐! 삼권분립
        </h1>
        <p className="mt-3 text-lg font-medium" style={{ color: 'var(--text-muted)' }}>
          견제와 균형, 핑퐁처럼 되받아쳐보자
        </p>
      </div>

      <div className="glass-card w-full max-w-md p-6">
        <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
          국가기관이 권한을 행사하는 상황이 제시되면, <b>견제할 기관</b>과 <b>헌법상 견제 수단</b>을 순서대로 골라 반격하세요. 헌법 조항 해설이 매 라운드 함께 제공됩니다.
        </p>

        <div className="mb-5 grid grid-cols-2 gap-3">
          {[
            { value: 5, label: '빠른 모드', desc: '5문제 랜덤' },
            { value: 10, label: '전체 모드', desc: '10문제 랜덤' },
          ].map((option) => {
            const best = getBestTime(option.value)
            return (
              <button
                key={option.value}
                onClick={() => setMode(option.value)}
                className="spring-btn rounded-xl border-2 p-4 text-left"
                style={{
                  borderColor: mode === option.value ? 'var(--accent-blue-mid)' : 'rgba(148,163,184,0.4)',
                  background: mode === option.value ? 'var(--bg-tertiary)' : '#fff',
                }}
              >
                <div className="font-bold" style={{ color: mode === option.value ? 'var(--accent-blue-mid)' : 'var(--text-main)' }}>
                  {option.label}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {option.desc}
                </div>
                {best !== null && (
                  <div className="font-display mt-1.5 flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--color-cc)' }}>
                    <Trophy size={12} />
                    최고기록 {formatTime(best, { tenths: false })}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => onStart(mode)}
          className="spring-btn btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold"
          style={{ minHeight: 52 }}
        >
          <Play size={18} fill="currentColor" />
          게임 시작하기
        </button>
      </div>
    </div>
  )
}
