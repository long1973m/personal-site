// 知识库 × 三档形态 — 流程示意图（详情面板用）

const PURPLE = '#6b46c1'
const CYAN = '#06b6d4'
const TEAL = '#14b8a6'

const steps = [
  { label: '统一知识库', sub: '检查项母表', w: 100 },
  { label: '集团版', sub: '六阶段 · 差异项清单', w: 115 },
  { label: '专业店版', sub: '五阶段 · 店长审批', w: 115 },
  { label: '小店版', sub: '三阶段 · AI 直出', w: 115 },
  { label: 'AI 反哺', sub: '人工确认后调整', w: 105 },
]

export default function FlowDiagram4({ className }: { className?: string }) {
  const totalW = steps.reduce((s, step) => s + step.w, 0) + (steps.length - 1) * 24 + 40
  const h = 130

  return (
    <div className={`w-full overflow-x-auto ${className ?? ''}`}>
      <svg viewBox={`0 0 ${totalW} ${h}`} className="h-28" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="flowGrad4" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0.4" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <rect width={totalW} height={h} fill="rgba(255,255,255,0.03)" rx="10" />

        {steps.map((step, i) => {
          let x = 20
          for (let j = 0; j < i; j++) x += steps[j].w + 24

          return (
            <g key={`step-${i}`}>
              <rect x={x} y="25" width={step.w} height="48" rx="8" fill={i === 0 ? 'url(#flowGrad4)' : 'rgba(20,184,166,0.12)'} stroke={i === 0 ? TEAL : i < 3 ? PURPLE : CYAN} strokeWidth="0.8" strokeOpacity="0.45" />
              <text x={x + step.w / 2} y="53" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">{step.label}</text>
              <text x={x + step.w / 2} y="68" textAnchor="middle" fill="#9ca3af" fontSize="8" fontFamily="Inter, sans-serif">{step.sub}</text>

              {i < steps.length - 1 && (
                <line x1={x + step.w + 4} y1="49" x2={x + step.w + 20} y2="49" stroke={TEAL} strokeWidth="1" strokeOpacity="0.35" />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
