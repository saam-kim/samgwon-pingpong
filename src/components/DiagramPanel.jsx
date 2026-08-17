import { X, ScrollText } from 'lucide-react'

const EDGES = [
  { from: [200, 60], to: [340, 300], label: '거부권 · 탄핵소추 · 해임건의' },
  { from: [340, 300], to: [60, 300], label: '법관 임명권 ↔ 명령·규칙 심사' },
  { from: [60, 300], to: [200, 60], label: '대법원장 임명동의' },
  { from: [200, 220], to: [200, 60], label: '탄핵심판 · 권한쟁의심판' },
  { from: [200, 220], to: [340, 300], label: '탄핵 심판 대상' },
  { from: [200, 220], to: [60, 300], label: '위헌법률심판' },
]

const NODES = [
  { id: '국회', emoji: '🏛️', pos: [200, 60], color: 'var(--color-assembly)' },
  { id: '대통령·행정부', emoji: '🏢', pos: [340, 300], color: 'var(--color-executive)' },
  { id: '법원', emoji: '⚖️', pos: [60, 300], color: 'var(--color-court)' },
  { id: '헌법재판소', emoji: '📜', pos: [200, 220], color: 'var(--color-cc)' },
]

function midpoint([x1, y1], [x2, y2]) {
  return [(x1 + x2) / 2, (y1 + y2) / 2]
}

export default function DiagramPanel({ open, onToggle }) {
  return (
    <div
      className="lawbook-slider glass-card fixed top-0 z-50 flex h-full w-full max-w-md flex-col border-l-2 shadow-2xl"
      style={{
        right: open ? 0 : '-28rem',
        borderColor: 'var(--accent-blue-mid)',
        borderRadius: 0,
      }}
    >
      <button
        onClick={onToggle}
        className="lawbook-handle spring-btn absolute top-24 -left-12 flex flex-col items-center justify-center gap-2 rounded-l-xl border-2 border-r-0 py-6 px-2 text-xs font-extrabold"
        style={{
          background: 'linear-gradient(to right, var(--bg-tertiary), #fff)',
          borderColor: 'var(--accent-blue-mid)',
          color: 'var(--accent-blue-mid)',
        }}
        aria-expanded={open}
      >
        <ScrollText size={18} />
        권력분립 도식도
      </button>

      <div className="flex items-center justify-between border-b px-6 py-5" style={{ background: 'var(--bg-tertiary)', borderColor: 'rgba(0,0,0,0.05)' }}>
          <h3 className="text-lg font-extrabold" style={{ color: 'var(--accent-blue)' }}>
            📜 견제와 균형 한눈에 보기
          </h3>
          <button onClick={onToggle} className="spring-btn rounded-full p-2" style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <svg viewBox="0 0 400 340" className="w-full">
            {EDGES.map((edge, i) => {
              const [mx, my] = midpoint(edge.from, edge.to)
              return (
                <g key={i}>
                  <line
                    x1={edge.from[0]}
                    y1={edge.from[1]}
                    x2={edge.to[0]}
                    y2={edge.to[1]}
                    stroke="rgba(37, 99, 235, 0.35)"
                    strokeWidth="2"
                    strokeDasharray="5 4"
                  />
                  <rect x={mx - 55} y={my - 11} width="110" height="20" rx="10" fill="#ffffff" opacity="0.92" />
                  <text x={mx} y={my + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--text-muted)">
                    {edge.label}
                  </text>
                </g>
              )
            })}
            {NODES.map((node) => (
              <g key={node.id}>
                <circle cx={node.pos[0]} cy={node.pos[1]} r="34" fill="#ffffff" stroke={node.color} strokeWidth="3" />
                <text x={node.pos[0]} y={node.pos[1] - 4} textAnchor="middle" fontSize="20">
                  {node.emoji}
                </text>
                <text x={node.pos[0]} y={node.pos[1] + 16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={node.color}>
                  {node.id}
                </text>
              </g>
            ))}
          </svg>

          <div className="mt-6 flex flex-col gap-3">
            <div className="law-article law-article-divider p-4">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
                점선은 두 기관이 서로 견제할 수 있는 헌법상 권한이 있다는 뜻이에요. 가운데 <b>헌법재판소</b>는 국회·대통령·법원 세 기관 모두를 최종적으로 심판하는 역할을 합니다.
              </p>
            </div>
            <p className="px-1 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              ※ 정당해산심판도 헌법재판소의 권한이지만, 이는 국가기관이 아닌 정당을 상대로 하는 심판이라 이 게임에서는 다루지 않아요.
            </p>
          </div>
        </div>
    </div>
  )
}
